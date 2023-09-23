import type { inferRouterOutputs } from "@trpc/server";
import { Loader, Save, Trash } from "lucide-react";
import { useRouter } from "next/router";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next/types";
import { useReducer, useState } from "react";

import Playground from "~/components/playground";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/utils/api";
import type { RelationRecord, SclProgram } from "~/utils/schemas-types";
import { generateSSRHelper } from "~/utils/ssr-helper";

type Project = inferRouterOutputs<AppRouter>["project"]["getProjectById"];

const ProjectPage = ({
  project,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { toast } = useToast();
  const router = useRouter();

  const { mutate: saveProject, isLoading: projectIsSaving } =
    api.project.updateProjectById.useMutation({
      onSuccess: () =>
        toast({
          description: "Project successfully saved!",
        }),
      onError: (error) =>
        toast({
          description: `Project failed to save! Reason: ${error.message}`,
        }),
    });

  const { mutate: deleteProjectById, isLoading: projectIsDeleting } =
    api.project.deleteProjectById.useMutation({
      onSuccess: async () => {
        toast({
          description: "Project successfully deleted!",
        })
        await router.push("/dashboard");
      },
      onError: (error) =>
        toast({
          description: `Project failed to delete! Reason: ${error.message}`,
        }),
    });

  const inputsCopy: RelationRecord = {};
  const outputsCopy: RelationRecord = {};

  project.inputs.forEach((input) => {
    inputsCopy[input.name] = input;
  });

  project.outputs.forEach((output) => {
    outputsCopy[output.name] = output;
  });

  const [program, setProgram] = useState<SclProgram>(project.program);
  const [inputs, setInputs] = useState<RelationRecord>(inputsCopy);
  const [outputs, setOutputs] = useState<RelationRecord>(outputsCopy);
  const [projectTitle, setProjectTitle] = useState<string>(project.title);

  return (
    <main className="flex flex-col h-[calc(100vh-53px)] gap-3 bg-background p-4">
      <div className="flex items-center justify-between">
        <Input
          type="text"
          defaultValue={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          className="scroll-m-20 text-2xl font-semibold tracking-tight w-fit"
          placeholder={project.title}
        />
        <div className="flex space-x-3">
          <Button
            onClick={() =>
              saveProject({
                id: project.id,
                project: {
                  title: projectTitle,
                  program: program,
                  inputs: Object.values(inputs),
                  outputs: Object.values(outputs),
                },
              })
            }
            disabled={projectIsSaving}
          >
            {projectIsSaving ? (
              <>
                <Loader className="mr-2 w-4 h-4" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 w-4 h-4" /> Save project
              </>
            )}
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteProjectById({
              id: project.id
            })}
            disabled={projectIsDeleting}
          >
            {projectIsDeleting ? (
              <>
                <Loader className="mr-2 w-4 h-4" /> Deleting...
              </>
            ) : (
              <>
                <Trash className="mr-2 w-4 h-4" /> Delete project
              </>
            )}
          </Button>
        </div>
      </div>
      <Playground
        program={program}
        inputs={inputs}
        outputs={outputs}
        setProgram={setProgram}
        setInputs={setInputs}
        setOutputs={setOutputs}
      />
    </main>
  );
};

export const getServerSideProps = (async (ctx) => {
  const projectId = ctx.params?.projectId;

  if (typeof projectId !== "string") {
    throw new Error("no project id");
  }

  const helper = await generateSSRHelper(ctx);

  const project = await helper.project.getProjectById({
    id: projectId,
  });

  return {
    props: {
      // worst hack ever
      project: JSON.parse(JSON.stringify(project)) as Project,
    },
  };
}) satisfies GetServerSideProps<{
  project: Project;
}>;

export default ProjectPage;

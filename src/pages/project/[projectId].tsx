import type { inferRouterOutputs } from "@trpc/server";
import { Loader, Save, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next/types";
import { useState } from "react";

import Playground from "~/components/playground";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { useToast } from "~/components/ui/use-toast";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/utils/api";
import type { RelationRecord, SclProgram } from "~/utils/schemas-types";
import { generateSSRHelper } from "~/utils/ssr-helper";

type Project = inferRouterOutputs<AppRouter>["project"]["getProjectById"];

const ProjectPage = ({
  project,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const isAuthor = session?.user?.id === project.authorId;

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

  const { mutate: deleteProject, isLoading: projectIsDeleting } =
    api.project.deleteProjectById.useMutation({
      onSuccess: async ({ title }) => {
        toast({
          description: (
            <p>
              Project <b>{title}</b> successfully deleted!
            </p>
          ),
        });
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
  const [title, setTitle] = useState<string>(project.title);
  const [published, setPublished] = useState<boolean>(project.published);

  return (
    <main className="flex flex-col h-[calc(100vh-53px)] gap-3 bg-background p-4">
      <div className="flex items-center justify-between">
        {isAuthor ? (
          <Input
            type="text"
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)}
            className="scroll-m-20 text-2xl font-semibold tracking-tight w-fit"
            placeholder={project.title}
          />
        ) : (
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight w-fit">
            {title}
          </h3>
        )}
        {isAuthor ? (
          <div className="flex space-x-5">
            <span className="flex items-center space-x-2">
              <Label htmlFor="publish-switch">
                {published ? "Published" : "Unpublished"}
              </Label>
              <Switch
                id="publish-switch"
                checked={published}
                onCheckedChange={(checked: boolean) => {
                  setPublished(checked);
                  saveProject({
                    id: project.id,
                    project: {
                      published: checked,
                    },
                  });
                }}
              />
            </span>
            <Button
              className="w-36"
              onClick={() => {
                saveProject({
                  id: project.id,
                  project: {
                    title: title,
                    program: program,
                    inputs: Object.values(inputs),
                    outputs: Object.values(outputs),
                  },
                });
              }}
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
              onClick={() =>
                deleteProject({
                  id: project.id,
                })
              }
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
        ) : null}
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

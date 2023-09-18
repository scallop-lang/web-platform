import type { inferRouterOutputs } from "@trpc/server";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next/types";
import { useState } from "react";

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

  const updateProject = api.project.updateProjectById.useMutation({
    onSuccess: () => {
      toast({
        description: "Project successfully saved!",
      });
    },
    onError: (error) => {
      toast({
        description: `Project failed to save! Reason: ${error.message}`,
      });
    },
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
            onClick={() => {
              updateProject.mutate({
                id: project.id,
                project: {
                  title: projectTitle ? projectTitle : "Untitled Project",
                  program: program,
                  inputs: Object.values(inputs),
                  outputs: Object.values(outputs),
                },
              });
            }}
          >
            Save project
          </Button>
          <Button
            variant="destructive"
            onClick={() => alert("totally deleted")}
          >
            Delete project
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

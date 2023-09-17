import type { NextPage } from "next/types";

import Playground from "~/components/playground";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import type { RelationRecord } from "~/utils/schemas-types";

const Project: NextPage<{ projectId: string }> = ({ projectId }) => {
  const project = api.project.getProjectById.useQuery({
    id: projectId,
  });

  const program = project.data?.program ? project.data?.program : "";
  const inputs: RelationRecord = {};
  const outputs: RelationRecord = {};

  project.data?.inputs.forEach((InputRelation) => {
    inputs[InputRelation.name] = InputRelation;
  });

  project.data?.outputs.forEach((OutputRelation) => {
    outputs[OutputRelation.name] = OutputRelation;
  });

  return (
    <main className="flex flex-col h-[calc(100vh-53px)] gap-3 bg-background p-4">
      <div className="flex items-center justify-between">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Project name: {projectId}
        </h2>

        <div className="flex space-x-3">
          <Button onClick={() => alert("poo poo pee pee")}>Save project</Button>
          <Button
            variant="destructive"
            onClick={() => alert("totally deleted")}
          >
            Delete project
          </Button>
        </div>
      </div>
      <Playground
        initProgram={program}
        initInputs={inputs}
        initOutputs={outputs}
      />
    </main>
  );
};

export default Project;

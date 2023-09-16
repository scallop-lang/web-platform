import type { NextRouter } from "next/router";
import { useRouter } from "next/router";

import Playground from "~/components/playground";
import { Button } from "~/components/ui/button";

const ProjectHeader = ({ router }: { router: NextRouter }) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Project name: {router.query.projectId}
      </h2>

      <div className="flex space-x-3">
        <Button
          size="sm"
          onClick={() => alert("yes")}
        >
          More interesting buttons
        </Button>
        <Button
          size="sm"
          onClick={() => alert("me when I delete project")}
        >
          Save project
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => alert("totally deleted")}
        >
          Delete project
        </Button>
      </div>
    </div>
  );
};

const Project = () => {
  const router = useRouter();

  return (
    <main className="flex flex-col h-[calc(100vh-53px)] gap-3 bg-background p-4">
      <ProjectHeader router={router} />
      <Playground
        initProgram={""}
        initInputs={{}}
        initOutputs={{}}
      />
    </main>
  );
};

export default Project;

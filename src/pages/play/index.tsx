import { useState } from "react";

import Playground from "~/components/playground";
import { type RelationRecord } from "~/utils/schemas-types";

const Root = () => {
  const [initialProgram, setInitialProgram] = useState("");
  const [initialInputs, setInitialInputs] = useState<RelationRecord>({});
  const [initialOutputs, setInitialOutputs] = useState<RelationRecord>({});

  return (
    <main className="flex h-[calc(100vh-53px)] flex-col gap-3 bg-background p-4">
      <Playground
        program={initialProgram}
        inputs={initialInputs}
        outputs={initialOutputs}
        setProgram={setInitialProgram}
        setInputs={setInitialInputs}
        setOutputs={setInitialOutputs}
      />
    </main>
  );
};

export default Root;

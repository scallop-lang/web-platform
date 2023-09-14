import { useState } from "react";

import { type RelationRecord, type SclProgram } from "~/utils/schemas-types";

import CodeEditor from "./code-editor";
import TableEditor from "./table-editor";

const Playground = () => {
  const [program, setProgram] = useState<SclProgram>("");
  const [inputs, setInputs] = useState<RelationRecord>({});
  const [outputs, setOutputs] = useState<RelationRecord>({});

  return (
    <main className="grid h-[calc(100vh-53px)] grid-cols-2 gap-3 bg-background p-4">
      <CodeEditor
        inputs={inputs}
        outputs={outputs}
        program={program}
        setProgram={setProgram}
        setOutputs={setOutputs}
      />
      <TableEditor
        inputs={inputs}
        outputs={outputs}
        setInputs={setInputs}
        setOutputs={setOutputs}
      />
    </main>
  );
};

export default Playground;

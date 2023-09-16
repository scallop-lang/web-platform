import { useState } from "react";

import { type RelationRecord, type SclProgram } from "~/utils/schemas-types";

import CodeEditor from "./code-editor";
import TableEditor from "./table-editor";

const Playground = ({
  initProgram,
  initInputs,
  initOutputs,
}: {
  initProgram: SclProgram;
  initInputs: RelationRecord;
  initOutputs: RelationRecord;
}) => {
  const [program, setProgram] = useState<SclProgram>(initProgram);
  const [inputs, setInputs] = useState<RelationRecord>(initInputs);
  const [outputs, setOutputs] = useState<RelationRecord>(initOutputs);

  return (
    <div className="grid grid-cols-2 h-full gap-3">
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
    </div>
  );
};

export default Playground;

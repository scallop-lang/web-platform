import { type RelationRecord, type SclProgram } from "~/utils/schemas-types";

import CodeEditor from "./code-editor";
import TableEditor from "./table-editor";

const Playground = ({
  program,
  inputs,
  outputs,
  setProgram,
  setInputs,
  setOutputs,
}: {
  program: SclProgram;
  inputs: RelationRecord;
  outputs: RelationRecord;
  setProgram: React.Dispatch<React.SetStateAction<SclProgram>>;
  setInputs: React.Dispatch<React.SetStateAction<RelationRecord>>;
  setOutputs: React.Dispatch<React.SetStateAction<RelationRecord>>;
}) => {
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

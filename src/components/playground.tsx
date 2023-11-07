import { ProjectContext } from "~/components/project-context";
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
    <div className="flex h-full gap-3">
      <ProjectContext.Provider
        value={{
          program,
          setProgram,
          inputs,
          setInputs,
          outputs,
          setOutputs,
        }}
      >
        <CodeEditor />
        <TableEditor />
      </ProjectContext.Provider>
    </div>
  );
};

export default Playground;

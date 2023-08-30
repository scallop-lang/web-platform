import { useState } from "react";
import { type RelationRecord, type SclProgram } from "~/utils/schemas-types";
import CodeEditor from "./code-editor";
import Header from "./header";
import TableEditor from "./table-editor";

const Playground = () => {
  const [program, setProgram] = useState<SclProgram>("");
  const [inputs, setInputs] = useState<RelationRecord>({});
  const [outputs, setOutputs] = useState<RelationRecord>({});

  return (
    <div className="min-h-screen">
      <Header />
      <main className="grid h-[calc(100vh-65px)] grid-cols-1 gap-5 bg-background p-5 lg:grid-cols-2 lg:gap-8 lg:p-8">
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
    </div>
  );
};

export default Playground;

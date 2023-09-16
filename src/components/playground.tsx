import Link from "next/link";
import { useState } from "react";

import { type RelationRecord, type SclProgram } from "~/utils/schemas-types";

import CodeEditor from "./code-editor";
import TableEditor from "./table-editor";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const Playground = () => {
  const [program, setProgram] = useState<SclProgram>("");
  const [inputs, setInputs] = useState<RelationRecord>({});
  const [outputs, setOutputs] = useState<RelationRecord>({});

  return (
    <main className="flex flex-col h-[calc(100vh-53px)] gap-3 bg-background p-4">
      <Alert className="shrink-0">
        <AlertTitle>Welcome to the Scallop playground!</AlertTitle>
        <AlertDescription>
          If you close this tab you&apos;ll lose your work. Make an account to
          access the <Link href="/dashboard">dashboard</Link> and save your
          projects.
        </AlertDescription>
      </Alert>
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
    </main>
  );
};

export default Playground;

import { PartyPopper } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import Playground from "~/components/playground";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { type RelationRecord } from "~/utils/schemas-types";

const WelcomeAlert = () => {
  const [closed, setClosed] = useState(false);

  if (closed) {
    return null;
  }

  return (
    <Alert className="shrink-0">
      <PartyPopper className="mr-2 h-5 w-5" />
      <AlertTitle>Welcome to Scallop!</AlertTitle>
      <AlertDescription>
        If you close the playground all work will be lost. Make an account to
        access the{" "}
        <Link
          href="/dashboard"
          className="font-medium underline"
        >
          dashboard
        </Link>{" "}
        and to save your projects.{" "}
        <button
          className="font-medium underline"
          onClick={() => setClosed(true)}
        >
          Close this alert.
        </button>
      </AlertDescription>
    </Alert>
  );
};

const Root = () => {
  const [initialProgram, setInitialProgram] = useState("");
  const [initialInputs, setInitialInputs] = useState<RelationRecord>({});
  const [initialOutputs, setInitialOutputs] = useState<RelationRecord>({});

  return (
    <main className="flex h-[calc(100vh-53px)] flex-col gap-3 bg-background p-4">
      <WelcomeAlert />
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

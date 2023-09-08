import { lintGutter } from "@codemirror/lint";
import CodeMirror from "@uiw/react-codemirror";
import {
  Scallop,
  ScallopHighlighter,
  ScallopLinter,
} from "codemirror-lang-scallop";

import { Loader, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

import { v4 as uuidv4 } from "uuid";
import { api } from "~/utils/api";
import type { RelationRecord, SclProgram } from "~/utils/schemas-types";
import RawFileComponent from "./raw-file-component";
import { useToast } from "./ui/use-toast";

const CodeEditor = ({
  inputs,
  outputs,
  program,
  setProgram,
  setOutputs,
}: {
  inputs: RelationRecord;
  outputs: RelationRecord;
  program: SclProgram;
  setProgram: React.Dispatch<React.SetStateAction<SclProgram>>;
  setOutputs: React.Dispatch<React.SetStateAction<RelationRecord>>;
}) => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const { toast } = useToast();

  // this is to avoid hydration mismatch due to `resolvedTheme` being
  // undefined on the server. see pages/input.tsx for more info
  useEffect(() => setMounted(true), []);

  const create = api.project.create.useMutation();
  const get = api.project.getProjectById.useQuery({
    id: "clm9yv5500000j0dkf4aqjo08",
  });

  const run = api.scallop.run.useMutation({
    onSuccess: (data) => {
      const outputsCopy = structuredClone(outputs);

      for (const [relationName, facts] of Object.entries(data)) {
        outputsCopy[relationName]!.facts = [];

        for (const [tag, tuple] of facts) {
          outputsCopy[relationName]!.facts.push({
            id: uuidv4(),
            tag: tag,
            tuple: tuple,
          });
        }
      }

      setOutputs(outputsCopy);

      toast({
        title: "Execution successfully completed!",
        description: "Please check your output relations.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "An error occurred when running your program",
        description: error.message,
      });
    },
  });

  const resolvedEditor = !mounted ? (
    <Skeleton className="h-full w-full rounded-md" />
  ) : (
    <CodeMirror
      value={program}
      height="100%"
      extensions={[
        Scallop(),
        ScallopHighlighter(resolvedTheme!),
        ScallopLinter,
        lintGutter(),
      ]}
      theme={resolvedTheme === "light" ? "light" : "dark"}
      autoFocus={true}
      placeholder={`// write your Scallop program here`}
      style={{ height: "100%" }}
      onChange={setProgram}
    />
  );

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between">
        <Button
          onClick={() => {
            run.mutate({
              program: program,
              inputs: Object.values(inputs),
              outputs: Object.values(outputs),
            });

            create.mutate({
              title: "Test",
              program: program,
              inputs: Object.values(inputs),
              outputs: Object.values(outputs),
            });

            toast({
              title: "Running your program",
              description: "Please hold tight...",
            });
          }}
          disabled={run.isLoading}
        >
          {run.isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4" /> Running...
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" /> Run program
            </>
          )}
        </Button>
        <RawFileComponent
          program={program}
          inputs={inputs}
          outputs={outputs}
        />
      </div>
      <Card className="h-0 grow p-4">{resolvedEditor}</Card>
    </div>
  );
};

export default CodeEditor;

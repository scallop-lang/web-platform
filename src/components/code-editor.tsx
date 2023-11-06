import { lintGutter } from "@codemirror/lint";
import CodeMirror from "@uiw/react-codemirror";
import {
  Scallop,
  ScallopHighlighter,
  ScallopLinter,
} from "codemirror-lang-scallop";
import { relationButtonPlugin}  from "~/utils/relation-button";
import { Loader, PlayCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { ProjectContext } from "~/components/project-context";
import { api } from "~/utils/api";
import { ScallopDark, ScallopLight } from "~/utils/editor-themes";

import RawFileComponent from "./raw-file-component";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { useToast } from "./ui/use-toast";

const CodeEditor = () => {
  const { inputs, outputs, program, setOutputs, setProgram } =
    useContext(ProjectContext);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const { toast } = useToast();

  // this is to avoid hydration mismatch due to `resolvedTheme` being
  // undefined on the server. see pages/input.tsx for more info
  useEffect(() => setMounted(true), []);

  const run = api.scallop.run.useMutation({
    onSuccess: (data) => {
      const outputsCopy = structuredClone(outputs);

      for (const [relationName, facts] of Object.entries(data)) {
        outputsCopy[relationName]!.facts = [];

        for (const fact of facts) {
          outputsCopy[relationName]!.facts.push({
            id: uuidv4(),
            tag: fact.tag,
            tuple: fact.tuple,
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
        relationButtonPlugin,
      ]}
      theme={resolvedTheme === "light" ? ScallopLight : ScallopDark}
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

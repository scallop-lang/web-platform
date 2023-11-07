import { lintGutter } from "@codemirror/lint";
import CodeMirror from "@uiw/react-codemirror";
import {
  Scallop,
  ScallopHighlighter,
  ScallopLinter,
} from "codemirror-lang-scallop";
import { Loader, PlayCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { doc } from "prettier";
import React, { useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { set } from "zod";

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

  const [width, setWidth] = useState(300);
  const isResized = useRef(false);

  // this is to avoid hydration mismatch due to `resolvedTheme` being
  // undefined on the server. see pages/input.tsx for more info

  function resizeWindow() {
    const prevWidth = width;
    // rework this later
    setWidth(window.innerWidth < prevWidth ? (window.innerWidth * window.innerWidth / prevWidth)
             : (prevWidth * prevWidth / window.innerWidth));
  }

  useEffect(() => {
    setMounted(true);
    window.addEventListener("resize", resizeWindow);
  }, []);

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    isResized.current = true;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseMove(e: MouseEvent) {
    if(!isResized.current) return;
    
    const newWidth = e.movementX;
    setWidth((prevWidth) => {
      return Math.min(window.innerWidth * 0.70, Math.max(prevWidth + newWidth, 300));
    });
  }

  function handleMouseUp() {
    isResized.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }

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
      ]}
      theme={resolvedTheme === "light" ? ScallopLight : ScallopDark}
      autoFocus={true}
      placeholder={`// write your Scallop program here`}
      style={{ height: "100%" }}
      onChange={setProgram}
    />
  );

  return (
    <div className="flex">
      <div
        className="flex h-full flex-col space-y-4"
        style={{ width: width }}
      >
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
      <div
        className="ml-3 w-2 cursor-w-resize rounded-lg hover:bg-black hover:bg-opacity-10 duration-200"
        onMouseDown={(e) => handleMouseDown(e)}
      ></div>
    </div>
  );
};

export default CodeEditor;


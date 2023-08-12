import { syntaxHighlighting } from "@codemirror/language";
import CodeMirror from "@uiw/react-codemirror";
import { Scallop, ScallopHighlightStyle } from "codemirror-lang-scallop";

import { FileDown, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";

import { v4 as uuid } from "uuid";
import { api } from "~/utils/api";
import type { RelationRecord, SclProgram } from "~/utils/schemas-types";

const download = (content: string, filename: string) => {
  const a = document.createElement("a");
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));

  a.href = url;
  a.download = filename + ".scl";
  a.click();

  URL.revokeObjectURL(url);
};

const DownloadButton = ({ program }: { program: string }) => {
  const [filename, setFilename] = useState("raw");

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <FileDown className="mr-2 h-4 w-4" /> Download raw file
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="grid gap-3"
        sideOffset={10}
      >
        <p className="text-sm text-muted-foreground">
          Download a single Scallop (.scl) file that contains both your program
          code and all relation table content.
        </p>
        <div className="mb-2 grid gap-2">
          <Label htmlFor="filename">Name your file</Label>
          <Input
            type="text"
            placeholder="Filename (required)"
            id="filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
          />
        </div>
        <Button
          disabled={filename.length === 0}
          onClick={() => download(program, filename)}
          className="transition"
        >
          Download
        </Button>
      </PopoverContent>
    </Popover>
  );
};

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

  // this is to avoid hydration mismatch due to `resolvedTheme` being
  // undefined on the server. see pages/input.tsx for more info
  useEffect(() => setMounted(true), []);

  const run = api.scallop.run.useMutation({
    onSuccess: (data) => {
      const outputsCopy = structuredClone(outputs);

      for (const [relationName, facts] of Object.entries(data)) {
        for (const [tag, tuple] of facts) {
          outputsCopy[relationName]!.facts.push({
            id: uuid(),
            tag: tag,
            tuple: tuple,
          });
        }
      }

      setOutputs(outputsCopy);

      console.log("outputs updated!");
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
        syntaxHighlighting(ScallopHighlightStyle(resolvedTheme!)),
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
          }}
        >
          <PlayCircle className="mr-2 h-4 w-4" /> Run program
        </Button>
        <DownloadButton program={program} />
      </div>
      <Card className="h-0 grow p-4">{resolvedEditor}</Card>
    </div>
  );
};

export default CodeEditor;

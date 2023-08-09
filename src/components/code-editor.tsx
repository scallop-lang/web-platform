import { syntaxHighlighting } from "@codemirror/language";
import { oneDarkHighlightStyle } from "@codemirror/theme-one-dark";
import CodeMirror from "@uiw/react-codemirror";
import { Scallop } from "codemirror-lang-scallop";

import { FileDown, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { type ScallopProgram } from "~/server/api/routers/scallop";
import { download } from "../utils/download";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";

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

const CodeToolbar = ({ program }: { program: string }) => {
  return (
    <div className="flex justify-between">
      <Button onClick={() => alert("will eventually update program state.")}>
        <PlayCircle className="mr-2 h-4 w-4" /> Run program
      </Button>
      <DownloadButton program={program} />
    </div>
  );
};

const CodeEditor = ({
  program,
  onProgramChange,
}: {
  program: ScallopProgram;
  onProgramChange: React.Dispatch<React.SetStateAction<ScallopProgram>>;
}) => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // this is to avoid hydration mismatch due to `resolvedTheme` being
  // undefined on the server. see pages/input.tsx for more info
  useEffect(() => setMounted(true), []);

  const resolvedEditor = !mounted ? (
    <Skeleton className="h-full w-full rounded-md" />
  ) : (
    <CodeMirror
      value={program}
      height="100%"
      extensions={[Scallop(), syntaxHighlighting(oneDarkHighlightStyle)]}
      theme={resolvedTheme === "light" ? "light" : "dark"}
      autoFocus={true}
      placeholder={`// write your Scallop program here`}
      style={{ height: "100%" }}
      onChange={onProgramChange}
    />
  );

  return (
    <div className="flex flex-col space-y-4">
      <CodeToolbar program={program} />
      <Card className="h-0 grow p-4">{resolvedEditor}</Card>
    </div>
  );
};

export default CodeEditor;

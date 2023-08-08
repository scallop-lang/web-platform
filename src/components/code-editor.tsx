import CodeMirror from "@uiw/react-codemirror";
import { FileDown, PlayCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { type ScallopProgram } from "~/server/api/routers/scallop";
import { download } from "../utils/download";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const DownloadButton = ({ program }: { program: string }) => {
  const [filename, setFilename] = useState("raw");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileDown className="mr-2 h-5 w-5" />
          <span className="text-base">Download raw file</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Download</DialogTitle>
          <DialogDescription className="text-base">
            This will download a Scallop (.scl) file containing any program code
            you&apos;ve written, along with your input and output tables. Table
            content is appended to the file.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-1.5">
          <Label
            className="text-base"
            htmlFor="filename"
          >
            Name your file
          </Label>
          <Input
            type="text"
            placeholder="Filename"
            id="filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            className="bg-pink-300 text-black hover:bg-pink-400"
            onClick={() => download(program, filename)}
          >
            <FileDown className="mr-2 h-5 w-5" />
            <span className="text-base">Download</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const CodeToolbar = ({ program }: { program: string }) => {
  return (
    <div className="flex items-center justify-between">
      <Button
        className="bg-pink-300 text-black hover:bg-pink-400"
        onClick={() => alert("will eventually update program state.")}
      >
        <PlayCircle className="mr-2 h-5 w-5" />
        <span className="text-base">Run program</span>
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
  return (
    <div className="flex flex-col space-y-4">
      <CodeToolbar program={program} />
      <Card className="h-0 grow p-4">
        <CodeMirror
          value={program}
          height="100%"
          autoFocus={true}
          placeholder={`// write your Scallop program here`}
          style={{ height: "100%" }}
          onChange={onProgramChange}
        />
      </Card>
    </div>
  );
};

export default CodeEditor;

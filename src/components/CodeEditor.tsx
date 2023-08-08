import CodeMirror from "@uiw/react-codemirror";
import { FileDown, PlayCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { type ScallopProgram } from "~/server/api/routers/scallop";
import { download } from "../utils/download";
import { Card } from "./ui/card";

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
      <Button
        variant="outline"
        onClick={() => download(program)}
      >
        <FileDown className="mr-2 h-5 w-5" />
        <span className="text-base">Download raw Scallop (.scl) file</span>
      </Button>
    </div>
  );
};

export const CodeEditor = ({
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

import CodeMirror from "@uiw/react-codemirror";
import { FileDown, PlayCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { type ScallopProgram } from "~/server/api/routers/scallop";
import { download } from "../utils/download";

const EditorToolbar = ({ code }: { code: string }) => {
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
        onClick={() => download(code)}
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
  program: string;
  onProgramChange: React.Dispatch<React.SetStateAction<ScallopProgram>>;
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <EditorToolbar code={program} />
      <div className="h-0 grow rounded-md bg-zinc-200 p-4">
        <CodeMirror
          value={program}
          height="100%"
          autoFocus={true}
          placeholder={`// write your Scallop program here`}
          style={{ height: "100%" }}
          onChange={onProgramChange}
        />
      </div>
    </div>
  );
};

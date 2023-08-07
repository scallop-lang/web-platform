import CodeMirror from "@uiw/react-codemirror";
import { FileDown, PlayCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { downloadRawFile } from "../utils/downloadRawFile";
import { api } from "~/utils/api";

const EditorToolbar = ({ code }: { code: string }) => {
  const [query, setQuery] = useState("");

  const res = api.scallop.runScallop.useQuery({
            "inputs": [
                {
                    "name": "parent",
                    "facts": [[1, ["Alice", "Bob"]], [1, ["Bob", "Emily"]]],
                }
            ],
            "program": "rel grandparent(a, c) = parent(a, b), parent(b, c)",
            "outputs": ["grandparent"],
        })
        
  return (
    <div className="flex items-center justify-between">
      <Button
        className="bg-pink-300 text-black hover:bg-pink-400"
        onClick={() => setQuery(code)}
      >
        <PlayCircle className="mr-2 h-5 w-5" />
        <span className="text-base">Run Program</span>
      </Button>
      <Button
        variant="outline"
        onClick={() => downloadRawFile(code)}
      >
        <FileDown className="mr-2 h-5 w-5" />
        <span className="text-base">Download raw Scallop (.scl) file</span>
      </Button>
    </div>
  );
};
export const CodeEditor = () => {
  const [code, setCode] = useState(
    `rel name(a, b) :- name(a, b), is_a(c, b)\nrel num_animals(n) :- count(o: name(o, "animal"))`
  );

  return (
    <div className="flex flex-col space-y-4">
      <EditorToolbar code={code} />
      <div className="h-0 grow rounded-md bg-zinc-200 p-4">
        <CodeMirror
          value={code}
          height="100%"
          autoFocus={true}
          placeholder={`// write your Scallop program here`}
          style={{ height: "100%" }}
          onChange={setCode}
        />
      </div>
    </div>
  );
};

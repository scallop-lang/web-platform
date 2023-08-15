import { Check, Clipboard, FileCode2, FileDown } from "lucide-react";
import { useState } from "react";
import { type ArgumentType, type RelationRecord } from "~/utils/schemas-types";
import { Button } from "./ui/button";
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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const download = (content: string, filename: string) => {
  const a = document.createElement("a");
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));

  a.href = url;
  a.download = filename + ".scl";
  a.click();

  URL.revokeObjectURL(url);
};

const parseType = (type: ArgumentType) => {
  switch (type) {
    case "Boolean":
      return "bool";
    case "Float":
      return "f32";
    case "Integer":
      return "i32";
    default:
      return type;
  }
};

const copyToClipboard = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

const RawFileComponent = ({
  program,
  inputs,
  outputs,
}: {
  program: string;
  inputs: RelationRecord;
  outputs: RelationRecord;
}) => {
  const [filename, setFilename] = useState("raw");
  const [copied, setCopied] = useState(false);

  const rawArray = [
    "// your Scallop code",
    program,
    "",
    "// your input relations",
  ];

  for (const relation of Object.values(inputs)) {
    // first declare type definition
    rawArray.push(
      `type ${relation.name}(${relation.args
        .map(({ type, name }) => {
          return name ? `${name}: ${parseType(type)}` : parseType(type);
        })
        .join(", ")})`
    );

    // then parse facts
    rawArray.push(`rel ${relation.name} = {`);
    relation.facts.forEach(({ tag, tuple }, factIndex) => {
      let fact = `  ${tag}::(${tuple
        .map((value, argIndex) => {
          const type = relation.args[argIndex]!.type;

          // only String types require quotes around them
          return type === "String" ? `"${value}"` : value;
        })
        .join(", ")})`;

      // only add comma if it's not the last fact
      if (factIndex !== relation.facts.length - 1) {
        fact += ",";
      }

      rawArray.push(fact);
    });

    rawArray.push("}");
    rawArray.push("");
  }

  rawArray.push("// your output relations");
  for (const name of Object.keys(outputs)) {
    rawArray.push(`query ${name}`);
  }

  const rawFile = rawArray.join("\n");

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setCopied(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileCode2 className="mr-2 h-4 w-4" /> View raw file
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>View raw file</DialogTitle>
          <DialogDescription>
            The raw Scallop (.scl) file contains both the program code
            you&apos;ve written, and all defined relation table content. To
            learn more about Scallop syntax, visit our documentation.
          </DialogDescription>
        </DialogHeader>
        <pre className="max-h-[60vh] overflow-y-auto rounded-lg bg-muted p-4 font-mono text-sm">
          <code>{rawFile}</code>
        </pre>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              void copyToClipboard(rawFile);
              setCopied(true);
            }}
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Copied!
              </>
            ) : (
              <>
                <Clipboard className="mr-2 h-4 w-4" /> Copy to clipboard
              </>
            )}
          </Button>
          <Popover modal={true}>
            <PopoverTrigger asChild>
              <Button>
                <FileDown className="mr-2 h-4 w-4" /> Download file
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="grid gap-3"
              sideOffset={10}
            >
              <div className="mb-2 grid gap-2">
                <Label htmlFor="filename">Filename</Label>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RawFileComponent;

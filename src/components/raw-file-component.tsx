import { FileCode2, FileDown } from "lucide-react";
import { useState } from "react";
import { type RelationRecord } from "~/utils/schemas-types";
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

const download = (content: string, filename: string) => {
  const a = document.createElement("a");
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));

  a.href = url;
  a.download = filename + ".scl";
  a.click();

  URL.revokeObjectURL(url);
};

const RawFileComponent = ({
  program,
  inputs: input,
  outputs: output,
}: {
  program: string;
  inputs: RelationRecord;
  outputs: RelationRecord;
}) => {
  const [filename, setFilename] = useState("raw");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileCode2 className="mr-2 h-4 w-4" /> View raw file
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>View raw file</DialogTitle>
          <DialogDescription>
            The Scallop code below contains both your program code and all
            relation table content. Feel free to download a copy of the Scallop
            (.scl) file.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg bg-muted p-4">
          <code className="cursor-default font-mono text-sm">{program}</code>
        </div>
        <DialogFooter>
          <Button onClick={() => download(program, filename)}>
            <FileDown className="mr-2 h-4 w-4" /> Download a copy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RawFileComponent;

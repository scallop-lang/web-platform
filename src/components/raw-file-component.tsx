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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RawFileComponent;

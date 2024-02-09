import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { ArrowDownToLine } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const DownloadFileDialog = ({
  cmRef,
  projectTitle,
  setMenuOpen,
  children,
}: {
  cmRef: React.RefObject<ReactCodeMirrorRef>;
  projectTitle: string;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}) => {
  const [filename, setFilename] = useState(projectTitle);
  const [open, setOpen] = useState(false);

  const download = (filename: string, program: string) => {
    const anchor = document.createElement("a");
    const url = URL.createObjectURL(
      new Blob([program], {
        type: "text/plain",
      }),
    );

    anchor.href = url;
    anchor.download = filename + ".scl";
    anchor.click();

    URL.revokeObjectURL(url);
    anchor.remove();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setMenuOpen(false);
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download as local file</DialogTitle>
          <DialogDescription>
            A copy of the program will be downloaded to your local disk as a
            Scallop (.scl) file.
          </DialogDescription>
        </DialogHeader>

        <div>
          <Label htmlFor="filename">Filename</Label>
          <Input
            id="filename"
            placeholder="Filename (required)"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            disabled={filename.length === 0}
            onClick={() => {
              download(filename, cmRef.current!.view!.state.doc.toString());
              setOpen(false);
              setMenuOpen(false);
            }}
            className="transition-opacity"
          >
            <ArrowDownToLine
              className="mr-1.5"
              size={16}
            />{" "}
            Download file
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { DownloadFileDialog };

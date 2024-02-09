import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { ChevronDown, FileDown, UploadCloud } from "lucide-react";
import { useState } from "react";

import { DownloadFileDialog } from "~/components/editor-menu/download-file-dialog";
import { SaveToDriveDialog } from "~/components/editor-menu/save-to-drive";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const ExportMenu = ({
  cmRef,
  projectTitle,
}: {
  cmRef: React.RefObject<ReactCodeMirrorRef>;
  projectTitle: string;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <DropdownMenu
      open={menuOpen}
      onOpenChange={setMenuOpen}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Export...{" "}
          <ChevronDown
            className="ml-1.5"
            size={15}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <SaveToDriveDialog
          cmRef={cmRef}
          projectTitle={projectTitle}
          setMenuOpen={setMenuOpen}
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <UploadCloud
              className="mr-1.5"
              size={16}
            />{" "}
            Save to Google Drive
          </DropdownMenuItem>
        </SaveToDriveDialog>

        <DownloadFileDialog
          cmRef={cmRef}
          projectTitle={projectTitle}
          setMenuOpen={setMenuOpen}
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <FileDown
              className="mr-1.5"
              size={16}
            />{" "}
            Download as file
          </DropdownMenuItem>
        </DownloadFileDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ExportMenu };

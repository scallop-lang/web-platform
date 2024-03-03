import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { ChevronDown, FileDown, UploadCloud } from "lucide-react";
import { useState } from "react";

import { DownloadFileDialog } from "~/components/editor-menu/download-file-dialog";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SaveToDriveDialog } from "./save-to-drive";
import { useSession } from "next-auth/react";

const ExportMenu = ({
  cmRef,
  projectTitle,
}: {
  cmRef: React.RefObject<ReactCodeMirrorRef>;
  projectTitle: string;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

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
        {session?.user.role === "ADMIN" ? <SaveToDriveDialog
          cmRef={cmRef}
          setMenuOpen={setMenuOpen}
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <UploadCloud
              className="mr-1.5"
              size={16}
            />{" "}
            Save to Google Drive
          </DropdownMenuItem>
        </SaveToDriveDialog> : null}

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

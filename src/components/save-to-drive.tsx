import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import useDrivePicker from "react-google-drive-picker";
import type { CallbackDoc } from "react-google-drive-picker/dist/typeDefs";
import { toast } from "sonner";

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

const SaveToDriveDialog = ({
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
  const [openPicker] = useDrivePicker();
  const [key, setKey] = useState<string | undefined>(undefined);
  const [filename, setFilename] = useState(projectTitle);
  const [open, setOpen] = useState(false);

  // ONLY SAVES TO A FOLDER
  // Will work on saving to a file later
  // you cannot switch emails tho hmmm
  const sendToDrive = async ({
    folder,
    content,
    filename,
    token,
  }: {
    folder: CallbackDoc;
    content: string;
    filename: string;
    token?: string;
  }) => {
    try {
      const accessToken = token;
      const folderId = folder.id;

      const file = new Blob([content], { type: "text/plain" });
      const metadata = {
        name: filename + ".scl",
        mimeType: "application/octet-stream",
        parents: [folderId],
      };

      const form = new FormData();
      form.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" }),
      );
      form.append("file", file);

      // use Google REST API instead of gapi
      await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true",
        {
          method: "POST",
          headers: new Headers({ Authorization: "Bearer " + accessToken }),
          body: form,
        },
      )
        .then((res) => {
          return res.json();
        })
        .then(() =>
          toast.success("Successfully saved project to Google Drive!"),
        );
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while saving to Drive. Try again.");
    }
  };

  const download = (content: string, filename: string) => {
    const client: google.accounts.oauth2.TokenClient =
      google.accounts.oauth2.initTokenClient({
        client_id:
          "494588134232-gvaumsid2ucu5ckfrh45oer4ku2ch1bf.apps.googleusercontent.com",
        scope: "https://www.googleapis.com/auth/drive.file",
        prompt: key ? "" : "select_account",
        callback: (response) => {
          setKey(response.expires_in);
          openPicker({
            clientId:
              "494588134232-gvaumsid2ucu5ckfrh45oer4ku2ch1bf.apps.googleusercontent.com",
            developerKey: "AIzaSyBDRsgSPlCLFUe6RZ6zNT12LaeA4ip7aa4",
            viewId: "FOLDERS",
            setIncludeFolders: true,
            setSelectFolderEnabled: true,
            token: response ? response.access_token : undefined,
            callbackFunction(data) {
              if (data.action === "picked") {
                // eslint-disable-next-line
                data.docs.map(async (item) => {
                  await sendToDrive({
                    folder: item,
                    content: content,
                    filename: filename,
                    token: response ? response.access_token : undefined,
                  });
                });
              }
            },
          });
        },
      });
    client.requestAccessToken();
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
          <DialogTitle>Save to Drive</DialogTitle>
          <DialogDescription>
            Save the editor as a Scallop (.scl) file to your Google Drive. You
            will be prompted to select a folder to save the file to.
          </DialogDescription>
        </DialogHeader>

        <div>
          <Label htmlFor="filename">Filename</Label>
          <Input
            type="text"
            placeholder="Filename (required)"
            id="filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            disabled={filename.length === 0}
            onClick={() => {
              download(cmRef.current!.view!.state.doc.toString(), filename);
              setOpen(false);
              setMenuOpen(false);
            }}
            className="transition-opacity"
          >
            <ExternalLink
              className="mr-1.5"
              size={16}
            />{" "}
            Open picker
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { SaveToDriveDialog };

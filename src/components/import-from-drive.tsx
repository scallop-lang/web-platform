import { Download } from "lucide-react";
import { useState } from "react";
import useDrivePicker from "react-google-drive-picker";
import type { CallbackDoc } from "react-google-drive-picker/dist/typeDefs";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";

const ImportFromDriveButton = ({
  changeEditorFunction,
}: {
  changeEditorFunction: (value: string) => void;
}) => {
  const [openPicker] = useDrivePicker();
  const [key, setKey] = useState<string | undefined>(undefined);

  const loadFile = async (file: CallbackDoc, token: string | undefined) => {
    try {
      await fetch(
        `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
        {
          headers: new Headers({ Authorization: "Bearer " + token }),
        },
      )
        .then((res) => {
          return res.text();
        })
        .then((val) => {
          changeEditorFunction(val);
        });
      toast.success("Successfully imported file!");
    } catch (err) {
      console.log(err);
      toast.error(
        "An error occurred while importing the file. Please try again.",
      );
    }
  };

  const handleOpenPicker = () => {
    const client: google.accounts.oauth2.TokenClient =
      google.accounts.oauth2.initTokenClient({
        client_id:
          "494588134232-gvaumsid2ucu5ckfrh45oer4ku2ch1bf.apps.googleusercontent.com",
        scope: "https://www.googleapis.com/auth/drive.file",
        prompt: key ? "" : "select_account",
        callback: (response) => {
          setKey(response ? response.access_token : undefined);
          openPicker({
            clientId:
              "494588134232-gvaumsid2ucu5ckfrh45oer4ku2ch1bf.apps.googleusercontent.com",
            developerKey: "AIzaSyBDRsgSPlCLFUe6RZ6zNT12LaeA4ip7aa4",
            token: response ? response.access_token : undefined,
            callbackFunction(data) {
              const elements = Array.from(
                document.getElementsByClassName(
                  "picker-dialog",
                ) as HTMLCollectionOf<HTMLElement>,
              );
              for (const element of elements) {
                element.style.zIndex = "2000";
              }
              if (data.action === "picked") {
                // eslint-disable-next-line
                data.docs.map(async (item) => {
                  if (item.name.endsWith(".scl")) {
                    await loadFile(
                      item,
                      response ? response.access_token : undefined,
                    );
                  } else {
                    toast.warning(
                      `"${item.name}" is not a valid file. Please pick a valid Scallop (.scl) file.`,
                    );
                  }
                });
              }
            },
          });
        },
      });
    client.requestAccessToken();
  };

  return (
    <Button
      variant="outline"
      onClick={() => handleOpenPicker()}
    >
      <Download
        className="mr-1.5"
        size={16}
      />{" "}
      Import from Google Drive
    </Button>
  );
};

export { ImportFromDriveButton };

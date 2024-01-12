import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import useDrivePicker from "react-google-drive-picker";
import type { CallbackDoc } from "react-google-drive-picker/dist/typeDefs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Label } from "./ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { FileDown } from "lucide-react";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

const SaveToDrive = ({
    program,
} : {
    program: string
}) => {
    const [openPicker] =  useDrivePicker();
    const [key, setKey] = useState<string | undefined>(undefined);
    const [filename, setFilename] = useState("raw");
    const {toast} = useToast();

    // ONLY SAVES TO A FOLDER
    // Will work on saving to a file later
    // you cannot switch emails tho hmmm
    const sendToDrive = async ({
        folder,
        content,
        filename,
        token,
    } : {
        folder: CallbackDoc,
        content: string,
        filename: string
        token?: string
    }) => {
        try {
            const accessToken = token;
            const folderId = folder.id;

            const file = new Blob([content], {type: 'text/plain'});
            const metadata = {
                "name": filename + '.scl',
                "mimeType": 'application/octet-stream',
                "parents": [folderId]
            }

            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
            form.append('file', file);
            
            console.log(content);
            
            // use Google REST API instead of gapi
            await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true", {
                method: 'POST',
                headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
                body: form,
            }).then((res) => {
                return res.json();
            }).then(function() {
                toast({
                    description: 'Successfully saved file!'
                });
            });
        } catch (error) {
            console.log(error);
            toast({
                description: 'Error - Could not save file.'
            });
        }
    }

    const download = (content: string, filename: string) => {
        const client: google.accounts.oauth2.TokenClient = google.accounts.oauth2.initTokenClient({
            client_id: '494588134232-gvaumsid2ucu5ckfrh45oer4ku2ch1bf.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/drive.file',
            prompt: key ? '' : 'select_account',
            callback: (response) => {
                setKey(response.expires_in);
                console.log(response);
                openPicker({
                    clientId: '494588134232-gvaumsid2ucu5ckfrh45oer4ku2ch1bf.apps.googleusercontent.com',
                    developerKey: 'AIzaSyBDRsgSPlCLFUe6RZ6zNT12LaeA4ip7aa4',
                    viewId: 'FOLDERS',
                    setIncludeFolders: true,
                    setSelectFolderEnabled: true,
                    token: response ? response.access_token : undefined,
                    callbackFunction(data) {
                        if(data.action === 'picked') {
                            data.docs.map(async (item) => {
                                await sendToDrive({folder: item, 
                                                   content: content, 
                                                   filename: filename,
                                                   token: response ? response.access_token : undefined});
                            });
                        }
                    }
                });
            }
        });
        client.requestAccessToken();
    };

    return (
        // grabbed this code from the raw file component
        <Dialog>
            <DialogTrigger asChild>
                <Button className="mx-2">
                Save to Drive Folder
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4">
                <DialogHeader>
                <DialogTitle>Save to Drive</DialogTitle>
                <DialogDescription>
                    Save a raw Scallop (.scl) file to your drive. After clicking the button 
                    below, you will be prompted to select a folder to save the file to.
                </DialogDescription>
                </DialogHeader>

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
                    <FileDown className="mr-2 h-4 w-4" /> Download file
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default SaveToDrive;
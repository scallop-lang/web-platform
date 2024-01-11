import React from "react";
import { Button } from "~/components/ui/button";
import useDrivePicker from "react-google-drive-picker";
import type { CallbackDoc } from "react-google-drive-picker/dist/typeDefs";

const SaveToDrive = ({
    program,
} : {
    program: string
}) => {

    const [openPicker] =  useDrivePicker();

    // ONLY SAVES TO A FOLDER
    // Will work on saving to a file later
    const sendToDrive = async ({
        folder,
        content,
        filename,
    } : {
        folder: CallbackDoc,
        content: string,
        filename: string
    }) => {
        try {
            const accessToken = gapi.auth.getToken().access_token;
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
            }).then(function(val) {
                console.log(val);
            });
        } catch {
            console.log('error');
        }
    }

    const download = (content: string, filename: string) => {
        const client: google.accounts.oauth2.TokenClient = google.accounts.oauth2.initTokenClient({
            client_id: '494588134232-gvaumsid2ucu5ckfrh45oer4ku2ch1bf.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/drive.file',
            callback: (response) => {
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
                                await sendToDrive({folder: item, content: content, filename: filename});
                            });
                        }
                    }
                });
            }
        });
        client.requestAccessToken();
    };

    return (
        <Button
            onClick = {() => {download(program, "test")}}
            className = "mx-2"
        >
            Save To Drive
        </Button>
    );
};

export default SaveToDrive;
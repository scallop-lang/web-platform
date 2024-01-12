import React, { useState } from "react";
import useDrivePicker from "react-google-drive-picker";
import type { CallbackDoc } from "react-google-drive-picker/dist/typeDefs";
import { useToast } from "~/components/ui/use-toast";
import { Button } from "~/components/ui/button";

const GooglePicker = ({
    changeEditorFunction,
} : {
    changeEditorFunction: (value: string) => void
}) => {
    const [openPicker] = useDrivePicker();
    const [key, setKey] = useState<string | undefined>(undefined);
    const {toast} = useToast();

    const loadFile = async (file : CallbackDoc, token: string | undefined) => {
        try {
            console.log(file);
            /*const response = await gapi.client.drive.files.get({
                fileId: file.id,
                alt:'media'
            });*/
            
            await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
                headers: new Headers({ 'Authorization': 'Bearer ' + token }),
            }).then((res) => {
                return res.text();
            }).then((val) => {
                changeEditorFunction(val);
            });
            toast({
                description: 'Successfully loaded file!'
            })
        } catch (error) {
            console.log(error);
            toast({
                description: 'Error: ' + !error
            })
        }
    }

    const handleOpenPicker = () => {
        const client: google.accounts.oauth2.TokenClient = google.accounts.oauth2.initTokenClient({
            client_id: '494588134232-gvaumsid2ucu5ckfrh45oer4ku2ch1bf.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/drive.file',
            prompt: key ? '' : 'select_account',
            callback: (response) => {
                setKey(response ? response.access_token : undefined);
                openPicker({
                    clientId: '494588134232-gvaumsid2ucu5ckfrh45oer4ku2ch1bf.apps.googleusercontent.com',
                    developerKey: 'AIzaSyBDRsgSPlCLFUe6RZ6zNT12LaeA4ip7aa4',
                    token: response ? response.access_token : undefined,
                    callbackFunction(data) {
                          const elements = Array.from(
                            document.getElementsByClassName(
                              'picker-dialog'
                            ) as HTMLCollectionOf<HTMLElement>
                          );
                          for (const element of elements) {
                            element.style.zIndex = '2000';
                          }
                          if (data.action === 'picked') {
                            data.docs.map(async (item) => {
                                if (item.name.endsWith('.scl')) {
                                    await loadFile(item, (response ? response.access_token : undefined));
                                } else {
                                    toast({
                                        description: `File is not a Scallop file! You must pick a .scl file.`,
                                    });
                                }
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
            onClick={() => handleOpenPicker()}
            className="mb-2"
        >
            Load From Drive
        </Button>
    );
};

export default GooglePicker;
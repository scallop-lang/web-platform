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
    const {toast} = useToast();

    const loadFile = async (file : CallbackDoc) => {
        try {
            console.log(file);
            const response = await gapi.client.drive.files.get({
                fileId: file.id,
                alt:'media'
            });
            changeEditorFunction(response.body);
            toast({
                description: 'Successfully loaded file!'
            })
        } catch (error) {
            toast({
                description: 'Error: ' + !error
            })
        }
    }

    const handleOpenPicker = () => {
        function start() {
            gapi.client.init({
                'apiKey' : 'AIzaSyCHJrogC4MIjl7sIWSjGvb9m515aeRXWOU',
                'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
            }).then(() => {
                const tokenInfo = gapi.auth.getToken();
                openPicker({
                    clientId: '494588134232-9k46v3kik6q4vbnleq3s5c62tau7obig.apps.googleusercontent.com',
                    developerKey: 'AIzaSyCHJrogC4MIjl7sIWSjGvb9m515aeRXWOU',
                    viewId: 'DOCS',
                    viewMimeTypes: 'application/octet-stream',
                    token: tokenInfo ? tokenInfo.access_token : undefined,
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
                                    await loadFile(item);
                                } else {
                                    toast({
                                        description: `File is not a Scallop file! You must pick a .scl file.`,
                                    });
                                }
                            });
                        }
                    },
                });
            }).then((response) => {
                console.log(response);
            }, function() {
                console.log('Error');
            });
        };
        gapi.load("client:auth2", start);
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
import useDrivePicker from "react-google-drive-picker";
import { CallbackDoc } from "react-google-drive-picker/dist/typeDefs";
import { Button } from "~/components/ui/button";

const GooglePicker = ({
    changeEditorFunction,
} : {
    changeEditorFunction: (value: string) => void
}) => {
    const [openPicker] = useDrivePicker();

    const parseURL = async (file : CallbackDoc) => {
        try {
            console.log(file);
            const response = await gapi.client.drive.files.get({
                fileId: file.id,
                alt:'media'
            });
            changeEditorFunction(response.body);
        } catch (error) {
            console.log(error);
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
                                await parseURL(item);
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
        >
            Load From Drive
        </Button>
    );
};

export default GooglePicker;
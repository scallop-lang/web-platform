import React, { useEffect } from "react";
import useDrivePicker from "react-google-drive-picker";
import { Button } from "~/components/ui/button";

const GooglePicker = ({}) => {
    const [openPicker] = useDrivePicker();

    const handleOpenPicker = () => {
        function start() {
            gapi.client.init({
                'apiKey' : 'AIzaSyCHJrogC4MIjl7sIWSjGvb9m515aeRXWOU'
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
                            data.docs.map((item) => {
                                console.log(item);
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
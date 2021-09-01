import React, { useState } from 'react';
import { View, Text, Button, Image } from 'react-native';

const Upload = () => {
    const [uploadUrl, setUploadUrl] = useState(false);
    const uploadyContext = useContext(UploadyContext);

    useItemFinishListener((item) => {
        const response = JSON.parse(item.uploadResponse.data);
        console.log(`item ${item.id} finished uploading, response was: `, response);
        setUploadUrl(response.url);
    });

    useItemErrorListener((item) => {
        console.log(`item ${item.id} upload error !!!! `, item);
    });

    useItemStartListener((item) => {
        console.log(`item ${item.id} starting to upload,name = ${item.file.name}`);
    });

    const pickFile = useCallback(async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });

            uploadyContext.upload(res);

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log("User cancelled the picker, exit any dialogs or menus and move on");
            } else {
                throw err;
            }
        }
    }, [uploadyContext]);

    return (
        <View>
            <Button title="Choose File" onPress={pickFile} />
            {uploadUrl && <Image source={{ uri: uploadUrl }} style={styles.uploadedImage} />}
        </View>
    );
};

export default Upload;
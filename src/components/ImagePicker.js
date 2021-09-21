import React, { useState } from "react";
import { View, TouchableOpacity, Button, Text, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import CameraIcon from '../../assets/images/icons/cameraicon.png';
import Colors from "../constants/Colors";

const ImgPicker = (props) => {

    const [pickedImage, setPickedImage] = useState();

    const launchCamera = async () => {
        console.log('[ImagePicker] launchCamera');
        const image = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5
        });
        setPickedImage(image.uri);
        props.onImagePicker(image.uri);
    }

    const launchGalery = async () => {
        console.log('[ImagePicker] launchGalery');
        let options = {
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5,
        };
        let image = await ImagePicker.launchImageLibraryAsync(options);
        setPickedImage(image.uri);
        props.onImagePicker(image.uri);
    }

    const takeImageHandler = async () => {
        Alert.alert(
            'Selecione de onde você gostaria de carregar o comprovante.',
            'Selecinando câmera é possível tirar uma foto do comprovante.',
            [
                {
                    text: 'Câmera',
                    onPress: () => launchCamera(),
                    style: 'default',
                },
                {
                    text: 'Galeria',
                    onPress: () => launchGalery(),
                    style: 'default',
                },
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ]
        );


        console.log('[ImagePicker]');
        let options = {
            title: 'Select Image',
            customButtons: [
                { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                // this.setState({
                //     filePath: response,
                //     fileData: response.data,
                //     fileUri: response.uri
                // });
            }
        });
    }

    return (
        <View style={styles.imagePicker}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.buttonImagePicker}
                    onPress={takeImageHandler}>
                    <Text style={styles.receiptText}>Comprovante</Text>
                    <View style={styles.imageIcon}>
                        <Image source={CameraIcon} />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.imagePreview}>
                {!pickedImage ? (
                    <Text>Nenhuma Imagem Selecionada.</Text>
                ) : (
                    < Image style={styles.image} source={{ uri: pickedImage }} />
                )}
            </View>
            {/* <Button
                title='Take Image'
                color={Colors.primary}
                onPress={takeImageHandler}
            /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    imagePicker: {
        alignItems: 'center',
    },
    buttonContainer: {
        alignContent: 'center',
        justifyContent: 'center',
        marginTop: 15,
        width: 343,
        height: 48,
    },
    buttonImagePicker: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        borderColor: 'black',
        borderWidth: 1,
        width: 343,
        height: 48,
        borderRadius: 5,
    },
    receiptText: {
        alignSelf: 'flex-start',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: '700',
        padding: 10,
    },
    imageIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginTop: 10,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1
    },
    image: {
        width: '100%',
        height: '100%'
    }
});

export default ImgPicker;
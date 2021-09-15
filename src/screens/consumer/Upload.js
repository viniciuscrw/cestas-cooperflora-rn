import React, { useState, useContext, useCallback } from 'react';
import { View, Text, Button, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import firebase from 'firebase';
import * as DocumentPicker from 'expo-document-picker';
// import storage from '@react-native-firebase/storage';
// import { ImagePicker } from 'expo';
import CameraIcon from '../../../assets/images/icons/cameraicon.png'

const Upload = ({ user, pickImage, receiptImage}) => {

    console.log(receiptImage);

    const uploadImage = async (uri) => {
        const now = new Date();
        const date = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            now.getHours(),
            now.getMinutes()
        );
        const imageName = date;
        let response = await fetch(uri);
        console.log('[response]', response);
        const blob = await response.blob();
        console.log('[blob]', blob);
        let ref = firebase.storage().ref().child(user.id + '/' + imageName);
        return ref.put(blob);
    };    

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={pickImage}>
                    <Text style={styles.receiptText}>Comprovante</Text>
                    <View style={styles.imageIcon}>
                        <Image source={CameraIcon} />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    source={{ uri: receiptImage }}
                />
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        marginLeft: 5,
        marginRight: 5,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 15,
        borderColor: 'black',
        borderWidth: 1,
        width: 343,
        height: 48,
        alignSelf: 'stretch',
        borderRadius: 5,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center'
    },
    receiptText: {
        alignSelf: 'flex-start',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: '700',
        paddingTop: 10,
        paddingBottom: 10,
    },
    imageIcon: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageContainer: {
        flexDirection: 'row',
        margin: 10,
        alignItems: 'center',
        height: 200,
        // borderColor: 'green',
        // borderWidth: 2
        // // backgroundColor: 'green'
    },
    image: {
        flex: 1,
        width: 200,
        height: 200,
        resizeMode: 'contain'
    }
});

export default Upload;
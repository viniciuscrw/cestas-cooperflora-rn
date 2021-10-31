import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import CameraIcon from '../../assets/images/icons/cameraicon.png';

const ImgPicker = (props) => {
  const [pickedImage, setPickedImage] = useState();

  const launchCamera = async () => {
    console.log('[ImagePicker] launchCamera');
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    setPickedImage(image.uri);
    props.onImagePicker(image.uri);
  };

  const launchGalery = async () => {
    console.log('[ImagePicker] launchGalery');
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    };
    const image = await ImagePicker.launchImageLibraryAsync(options);
    setPickedImage(image.uri);
    props.onImagePicker(image.uri);
  };

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
  };

  return (
    <View style={styles.imagePicker}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonImagePicker}
          onPress={takeImageHandler}
        >
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
          <Image style={styles.image} source={{ uri: pickedImage }} />
        )}
      </View>
    </View>
  );
};

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
    borderColor: '#8898AA',
    borderWidth: 1,
    width: 343,
    height: 48,
    borderRadius: 5,
  },
  receiptText: {
    alignSelf: 'flex-start',
    color: '#8898AA',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '700',
    padding: 10,
  },
  imageIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImgPicker;

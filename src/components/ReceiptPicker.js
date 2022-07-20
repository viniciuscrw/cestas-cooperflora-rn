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
import * as DocumentPicker from 'expo-document-picker';
import { accessibilityLabel } from '../utils';
import CameraIcon from '../../assets/images/icons/cameraicon.png';
import RenderImageReceipt from './RenderImageReceipt';
// import RenderPdfReceipt from './RenderPdfReceipt';
import PDFImage from '../../assets/images/pdfimage.jpg';

const ReceiptPicker = (props) => {
  const [pickedReceipt, setPickedReceipt] = useState({});

  const launchCamera = async () => {
    console.log('[ImagePicker] launchCamera');
    const image = await ImagePicker.launchCameraAsync({
      // allowsEditing: true,
      // aspect: [16, 9],
      quality: 0.5,
    });
    image.type = 'image';
    setPickedReceipt(image);
    props.onReceiptPicker(image);
  };

  const launchImageGalery = async () => {
    console.log('[ImagePicker] launchGalery');
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      // aspect: [16, 9],
      quality: 0.5,
    };
    const image = await ImagePicker.launchImageLibraryAsync(options);
    image.type = 'image';
    setPickedReceipt(image);
    props.onReceiptPicker(image);
  };

  const launchDocumentGalery = async () => {
    console.log('[DocumentPicker] launchGalery');
    const document = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: false,
    });
    document.type = 'pdf';
    setPickedReceipt(document);
    props.onReceiptPicker(document);
  };

  const takeReceiptHandler = async () => {
    Alert.alert(
      'Selecione o tipo de comprovante que você vai anexar.',
      'Selecionando imagem é possível tirar uma foto do comprovante.',
      [
        {
          text: 'Imagem',
          onPress: () => {
            Alert.alert(
              'Selecione de onde você gostaria de carregar o comprovante.',
              '.',
              [
                {
                  text: 'Câmera',
                  onPress: () => launchCamera(),
                  style: 'default',
                },
                {
                  text: 'Imagem da Galeria',
                  onPress: () => launchImageGalery(),
                  style: 'default',
                },
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
              ]
            );
          },
          style: 'default',
        },
        {
          text: 'Documento PDF',
          onPress: () => launchDocumentGalery(),
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

  const renderReceipt = () => {
    if (!pickedReceipt.uri) {
      return <Text>Nenhuma Imagem Selecionada.</Text>;
    }
    if (pickedReceipt.type === 'image') {
      return <RenderImageReceipt imageUrl={pickedReceipt.uri} />;
    }
    if (pickedReceipt.type === 'pdf') {
      return <Image style={styles.image} source={PDFImage} />;
      // return <RenderPdfReceipt documentUrl={pickedReceipt.uri} />;
    }
    return null;
  };

  return (
    <View style={styles.receiptPicker}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonReceiptPicker}
          onPress={takeReceiptHandler}
          {...accessibilityLabel('receiptButton')}
        >
          <Text style={styles.receiptText}>Comprovante</Text>
          <View style={styles.imageIcon}>
            <Image source={CameraIcon} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.receiptPreview}>{renderReceipt()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  receiptPicker: {
    alignItems: 'center',
  },
  buttonContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 15,
    width: 343,
    height: 48,
  },
  buttonReceiptPicker: {
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
  image: {
    width: '100%',
    height: '70%',
  },
  receiptPreview: {
    width: '100%',
    height: 200,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
});

export default ReceiptPicker;

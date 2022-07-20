import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as OpenAnything from 'react-native-openanything';
import Button from './Button';
import Colors from '../constants/Colors';

const RenderPdfReceipt = ({ documentUrl }) => {
  console.log('Document URI ->', documentUrl);
  return (
    <View>
      <Button
        style={styles.button}
        textColor="white"
        onPress={() => OpenAnything.Pdf(documentUrl)}
      >
        Abrir PDF
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  receiptDocumentContainer: {
    flexDirection: 'row',
    // margin: 10,
    // alignItems: 'center',
    height: 200,
  },
  button: {
    marginTop: 5,
    backgroundColor: Colors.secondary,
    alignSelf: 'center',
    marginBottom: 5,
  },
});

export default RenderPdfReceipt;

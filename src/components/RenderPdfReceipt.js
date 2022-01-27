import React from 'react';
import { View, StyleSheet } from 'react-native';
import PDFReader from 'rn-pdf-reader-js';

const RenderPdfReceipt = ({ documentUrl }) => {
  const handleError = () => {
    console.log('Erro ao exibir o pdf na tela.');
  };

  return (
    <View style={styles.receiptDocumentContainer}>
      <PDFReader
        source={{
          uri: documentUrl,
        }}
        onError={handleError()}
      />
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
});

export default RenderPdfReceipt;

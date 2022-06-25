import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const RenderPdfReceipt = ({ documentUrl }) => {
  const handleError = () => {
    console.log('Erro ao exibir o pdf na tela.');
  };

  const source = {
    uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf',
    cache: true,
  };

  const uri = 'http://www.africau.edu/images/default/sample.pdf';

  return (
    <WebView
      style={styles.container}
      source={{
        uri: 'http://docs.google.com/gview?embedded=true&url=http://www.africau.edu/images/default/sample.pdf',
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 200,
    marginTop: 20,
  },
});

export default RenderPdfReceipt;

import React, { useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const RenderImageReceipt = ({ imageUrl }) => {
  const [imageHeight, setImageHeight] = useState();
  const imageWidth = 350;

  Image.getSize(imageUrl, (width, height) => {
    setImageHeight((height * imageWidth) / width);
  });

  return (
    <ScrollView style={styles.receiptImageContainer}>
      <Image
        style={{
          flex: 1,
          width: imageWidth,
          height: imageHeight,
          resizeMode: 'contain',
        }}
        source={{ uri: imageUrl }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  receiptImageContainer: {
    height: 200,
  },
});

export default RenderImageReceipt;

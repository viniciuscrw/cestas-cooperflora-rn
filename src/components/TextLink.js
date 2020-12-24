import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const TextLink = ({ style, onPress, text, textStyle, size }) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Text style={[styles.text, textStyle, { fontSize: size ? size : 18 }]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#2d98d6',
    textDecorationLine: 'underline',
  },
});

export default TextLink;

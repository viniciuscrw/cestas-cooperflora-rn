import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

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
    color: Colors.secondary,
    textDecorationLine: 'underline',
  },
});

export default TextLink;

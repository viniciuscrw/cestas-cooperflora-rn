/* eslint-disable no-use-before-define */
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { accessibilityLabel } from '../utils';

const Button = ({ id, onPress, children, style, textColor, disabled }) => {
  const { button, text } = styles;
  return (
    <TouchableOpacity {...accessibilityLabel(id)} onPress={onPress} style={[button, style]} disabled={disabled} accessible>
      <Text style={[text, { color: textColor }]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    alignSelf: 'center',
    // color: 'white',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '700',
    paddingTop: 10,
    paddingBottom: 10,
  },
  button: {
    width: 343,
    height: 48,
    alignSelf: 'stretch',
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
  },
});

export default Button;

import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import Spinner from './Spinner';

const LoadingButton = ({ onPress, children, style, color, loading }) => {
  const { button, text } = styles;

  return loading ? (
    <Spinner onLayout={Keyboard.dismiss} size="small" />
  ) : (
    <TouchableOpacity
      onPress={onPress}
      style={[
        button,
        style,
        color ? { borderColor: color } : { borderColor: 'darkolivegreen' },
      ]}
    >
      <Text
        style={[text, color ? { color: color } : { color: 'darkolivegreen' }]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    alignSelf: 'center',
    // color: 'darkolivegreen',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10,
  },
  button: {
    alignSelf: 'stretch',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'darkolivegreen',
    marginLeft: 5,
    marginRight: 5,
  },
});

export default LoadingButton;

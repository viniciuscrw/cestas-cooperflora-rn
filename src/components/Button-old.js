import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const Button = ({ onPress, children, style }) => {
  const { button, text } = styles;
  console.log(button);
  console.log(style);
  return (
    <TouchableOpacity onPress={onPress} style={[button, style]}>
      <Text style={text}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    alignSelf: 'center',
    color: 'darkolivegreen',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10,
  },
  button: {
    // flex: 1,
    alignSelf: 'stretch',
    // backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'darkolivegreen',
    marginLeft: 5,
    marginRight: 5,
  },
});

export default Button;

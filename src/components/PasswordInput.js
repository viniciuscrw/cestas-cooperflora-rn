import React from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import Input from './Input';

const PasswordInput = ({ label, value, onChangeText, autoFocus, style }) => {
  return (
    <Input
      autoFocus={autoFocus}
      placeholder="••••••••"
      label={label}
      secureTextEntry
      value={value}
      onChangeText={onChangeText}
      style={style}
    />
  );
};

export default PasswordInput;

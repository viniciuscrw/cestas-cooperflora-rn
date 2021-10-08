import React from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  autoFocus,
  style,
}) => {
  return (
    <View style={styles.container}>
      <Text style={style ? [styles.label, style.label] : styles.label}>
        {label}
      </Text>
      <TextInput
        autoFocus={autoFocus}
        autoCapitalize="none"
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        autoCorrect={false}
        style={style ? [styles.input, style.input] : styles.input}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    lineHeight: 23,
    flex: 2,
  },
  label: {
    color: '#8898AA',
    fontSize: 18,
    paddingLeft: 20,
  },
  container: {
    height: 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Input;

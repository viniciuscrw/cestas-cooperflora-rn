import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Text } from 'react-native-elements';

const FormInput = ({
  label,
  value,
  placeholder,
  reference,
  rightIcon,
  returnKeyType,
  onChangeText,
  onEndEditing,
  onSubmitEditing,
  onTouchStart,
  autoCapitalize,
  autoCorrect,
  keyboardType,
  multiline,
  numberOfLines,
  editable,
  maxLength,
  disabled,
  secureTextEntry,
  fontSize,
  hasError,
  errorMessage,
  style,
}) => {
  return (
    <View>
      <Input
        label={label}
        value={value}
        placeholder={placeholder}
        ref={reference}
        rightIcon={rightIcon}
        returnKeyType={returnKeyType}
        onChangeText={onChangeText}
        onEndEditing={onEndEditing}
        onSubmitEditing={onSubmitEditing}
        onTouchStart={onTouchStart}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        maxLength={maxLength}
        disabled={disabled}
        secureTextEntry={secureTextEntry}
        style={{ flexGrow: 1, fontSize: fontSize ? fontSize : 18 }}
        inputContainerStyle={hasError ? [styles.error, style] : style}
        labelStyle={hasError ? styles.labelWithError : styles.label}
      />
      {hasError ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  error: {
    borderColor: 'red',
  },
  label: {
    fontWeight: 'normal',
  },
  labelWithError: {
    fontWeight: 'normal',
    color: 'red',
  },
  errorMessage: {
    fontSize: 12,
    color: 'red',
    marginLeft: 10,
    top: -7,
  },
});

export default FormInput;

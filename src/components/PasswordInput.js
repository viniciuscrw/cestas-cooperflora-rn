import React from 'react';
import Input from './Input';

const PasswordInput = ({
  id,
  label,
  value,
  onChangeText,
  autoFocus,
  style,
}) => {
  return (
    <Input
      id={id}
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

import { Alert } from 'react-native';

export const isBlank = (val) => !val || /^\s*$/.test(val);

export const isNotEmpty = (val) => {
  return val && val.length;
};

export const formatCurrency = (value) => {
  const splittedValue = value.toLocaleString().split(',');

  if (splittedValue.length === 1) {
    return value.toLocaleString();
  }
  if (splittedValue.length > 1 && splittedValue[1].length === 1) {
    return `${value.toLocaleString()}0`;
  }
  return value.toLocaleString();
};

export const showAlert = (text) => {
  Alert.alert('Aviso', text, [
    {
      text: 'OK',
    },
  ]);
};

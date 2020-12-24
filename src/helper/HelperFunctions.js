import { Alert } from 'react-native';

export const isNotEmpty = (val) => {
  return val && val.length;
};

export const formatCurrency = (value) => {
  let splittedValue = value.toLocaleString().split(',');

  if (splittedValue.length === 1) {
    return value.toLocaleString();
  } else if (splittedValue.length > 1 && splittedValue[1].length === 1) {
    return value.toLocaleString() + '0';
  } else {
    return value.toLocaleString();
  }
};

export const showAlert = (text) => {
  Alert.alert('Aviso', text, [
    {
      text: 'OK',
    },
  ]);
};

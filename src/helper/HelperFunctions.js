import { Alert } from 'react-native';
import GLOBALS from '../Globals';

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

export const resolveWeekDay = (weekDay) => {
  switch (weekDay) {
    case 0:
      return 'Domingo';
    case 1:
      return 'Segunda-feira';
    case 2:
      return 'Terça-feira';
    case 3:
      return 'Quarta-feira';
    case 4:
      return 'Quinta-feira';
    case 5:
      return 'Sexta-feira';
    case 6:
      return 'Sábado';
    default:
      return '';
  }
};

export const isConsumer = (user) => {
  return user && user.role && user.role === GLOBALS.USER.ROLE.CONSUMER;
};

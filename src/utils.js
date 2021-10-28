import { Platform } from 'react-native';

export const accessibilityLabel = (id) => {
  if (Platform.OS === 'android') {
    return { accessibilityLabel: id };
  }
  if (Platform.OS === 'ios') {
    return { testID: id };
  }
  return null;
};

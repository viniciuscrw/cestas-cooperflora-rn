import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Spinner = ({ size, onLayout }) => {
  return (
    <View style={styles.spinner}>
      <ActivityIndicator onLayout={onLayout} size={size || 'large'} />
    </View>
  );
};

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Spinner;

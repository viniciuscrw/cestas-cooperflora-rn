import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const Spinner = ({ size, onLayout, color }) => {
  return (
    <View style={styles.spinner}>
      <ActivityIndicator
        onLayout={onLayout}
        size={size || 'large'}
        color={color || Colors.primary}
      />
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

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ScreenTitle = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    alignSelf: 'flex-start',
  },
  title: {
    color: '#101010',
    fontSize: 22,
    fontWeight: 'bold',
  }
});

export default ScreenTitle;

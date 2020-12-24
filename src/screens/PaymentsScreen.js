import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

const PaymentsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pagamentos</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ebebeb',
  },
  text: {
    color: '#101010',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default PaymentsScreen;

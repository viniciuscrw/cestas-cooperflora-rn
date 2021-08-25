import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import HeaderTitle from '../components/HeaderTitle';

const OrdersByConsumerScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pedidos por consumidor</Text>
    </View>
  );
};

export const ordersManagementNavigationOptions = () => {
  return {
    headerTitle: 'Pedidos',
  };
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

export default OrdersByConsumerScreen;

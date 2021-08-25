import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

const OrdersQuantityByItemScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Quantidade de itens pedidos</Text>
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

export default OrdersQuantityByItemScreen;

import React, { useContext } from 'react';
import { withNavigation } from 'react-navigation';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import Divider from '../../components/Divider';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';
import { Context as OrderContext } from '../../context/OrderContext';

const ConsumerOrderPlacedScreen = (props) => {
  const {
    state: { loading, order },
  } = useContext(OrderContext);

  // TODO Resolver aqui pra quem nao tem pedido
  if (order && !order.id) {
    props.navigation.navigate('Deliveries');
  }

  return (
    <View style={styles.screen}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Pedido confirmado!</Text>
      </View>
      <Divider style={{ borderBottomColor: Colors.secondary }} />
      <ScrollView style={styles.orderItemsContainer}>
        <View>
          <View style={styles.orderItemContainer}>
            <View style={styles.box1}>
              <Text style={styles.itemText}>{order.baseProducts}</Text>
              <Text style={styles.itemText}>Cesta</Text>
            </View>
            <View style={styles.box2}>
              <Text style={styles.itemText}>37.00</Text>
            </View>
          </View>
          <FlatList
            data={order.extraProducts}
            keyExtractor={(item) => item.productTitle}
            renderItem={(itemData) => {
              const total = (
                itemData.item.productPrice * itemData.item.quantity
              ).toFixed(2);
              return (
                <View>
                  {total != 0 ? (
                    <View style={styles.orderItemContainer}>
                      <View style={styles.box1}>
                        <Text style={styles.itemText}>
                          {itemData.item.quantity}
                        </Text>
                        <Text style={styles.itemText}>
                          {itemData.item.productTitle}
                        </Text>
                      </View>
                      <View style={styles.box2}>
                        <Text style={styles.itemText}>{total}</Text>
                      </View>
                    </View>
                  ) : null}
                </View>
              );
            }}
          />
        </View>
      </ScrollView>
      <Divider style={{ borderBottomColor: Colors.tertiary }} />
      <View style={styles.totalAmountContainer}>
        <View style={styles.box1}>
          <Text style={styles.itemText}>Total</Text>
        </View>
        <View>
          <Text style={styles.itemText}>{order.totalAmount.toFixed(2)}</Text>
        </View>
      </View>
      <Divider style={{ borderBottomColor: Colors.secondary }} />
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          onPress={() => console.log('Button pressed!')}
        >
          Adicionar Pagamento
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 15,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '20%',
    padding: 10,
  },
  orderItemsContainer: {
    padding: 25,
    height: '50%',
  },
  orderItemContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  itemText: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
    color: '#505050',
    padding: 2,
  },
  box1: {
    flex: 1,
    flexDirection: 'row',
  },
  // box2:{
  //     alignContent: 'flex-end',
  //     justifyContent: 'space-between',

  // },
  totalAmountContainer: {
    height: '10%',
    paddingRight: 25,
    paddingLeft: 25,
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: 'grey'
  },
  buttonContainer: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: 10,
    paddingRight: 25,
    paddingLeft: 25,
    height: '10%',
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 24,
    color: '#505050',
  },
  button: {
    backgroundColor: Colors.primary,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

ConsumerOrderPlacedScreen.navigationOptions = () => {
  return {
    headerTitle: 'Pedidos do consumidor',
  };
};

export default withNavigation(ConsumerOrderPlacedScreen);

import React, { useContext, useEffect, useState } from 'react';
import { withNavigationFocus } from 'react-navigation';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { format } from 'date-fns';
import { Context as OrderContext } from '../../context/OrderContext';
import Colors from '../../constants/Colors';
import Divider from '../../components/Divider';
import Button from '../../components/Button';
import GLOBALS from '../../Globals';

const ConsumerOrderScreen = (props) => {
  const [baseProducts, setBaseProducts] = useState();
  const [orderProducts, setOrderProducts] = useState([]);
  const [limitDateToOrder, setLimitDateToOrder] = useState();

  const {
    state: { loading, order },
    addBaseProducts,
    removeBaseProducts,
    addProduct,
    removeProduct,
    addOrder,
    fetchUserOrder,
  } = useContext(OrderContext);

  const { user, delivery } = props.navigation.state.params;

  if (props.isFocused) {
    if (limitDateToOrder < new Date()) {
      Alert.alert('Aviso', 'Prazo para pedidos já foi encerrado!', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
      props.navigation.navigate('ConsumerOrderPlacedScreen', { delivery });
    }
  }

  const transformOrderProducts = () => {
    const deliveryExtraProducts = delivery.extraProducts;
    const orderExtraProducts = order.extraProducts ? order.extraProducts : [];

    deliveryExtraProducts
      .filter((deliveryProduct) => {
        const titles = orderExtraProducts.map(
          (orderProduct) => orderProduct.productTitle
        );
        return !titles.includes(deliveryProduct.name);
      })
      .forEach((product) => {
        orderExtraProducts.push({
          productPrice: product.price,
          productTitle: product.name,
          quantity: 0,
        });
      });

    const transformedOrderProducts = orderExtraProducts;
    transformedOrderProducts.sort((a, b) => {
      return a.productTitle > b.productTitle ? 1 : -1;
    });

    setOrderProducts(transformedOrderProducts);
  };

  useEffect(() => {
    console.log('[Consumer Order Product Screen - useEffect fetch orders');

    if (user && delivery) {
      setLimitDateToOrder(delivery.limitDate);
      console.log('[ConsumerOrderProduct] delivery', delivery.limitDate);
      fetchUserOrder(user.id, delivery.id, delivery.extraProducts);
      setBaseProducts(delivery.baseProducts);
    }
  }, [user, delivery]);

  useEffect(() => {
    transformOrderProducts();
  }, [order, delivery]);

  const hasAnyProduct = () => {
    return (
      order?.baseProducts > 0 ||
      (order?.extraProducts?.length > 0 &&
        order.extraProducts.some((prod) => prod.quantity > 0))
    );
  };

  const onHandleNewOrUpdatedOrder = () => {
    console.log('[Consumer Order Screen] Handle new or update order');
    addOrder(user.id, user.name, delivery.id, order);
    if (!loading) {
      if (user.role) {
        props.navigation.navigate('ConsumerOrderPlacedScreen', { delivery });
      } else {
        props.navigation.goBack(null);
      }
    }
  };

  return loading ? (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  ) : (
    <View style={styles.screen}>
      <View style={styles.baseProductsContainer}>
        <View style={styles.baseProducts}>
          <View style={styles.title}>
            <Text
              style={styles.textTitle}
            >{`Cesta (${delivery.baseProductsPrice?.toFixed(2)})`}</Text>
          </View>
          <View style={styles.controls}>
            <View style={styles.incDecButton}>
              <TouchableOpacity
                onPress={() =>
                  removeBaseProducts(
                    delivery.baseProductsPrice,
                    delivery.deliveryFee
                  )
                }
              >
                <Text style={styles.textControls}>{`-  `}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.quantity}>{order.baseProducts}</Text>
            <View style={styles.incDecButton}>
              <TouchableOpacity
                onPress={() =>
                  addBaseProducts(
                    delivery.baseProductsPrice,
                    delivery.deliveryFee
                  )
                }
              >
                <Text style={styles.textControls}>{`  +`}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.baseProductsItems}>
          <Text style={styles.textItens}>{baseProducts}</Text>
        </View>
      </View>
      <Divider
        style={{ borderBottomColor: Colors.secondary, marginBottom: 15 }}
      />
      <View style={styles.extraProductsContainer}>
        <View style={styles.title}>
          <Text style={styles.textTitle}>Extras</Text>
        </View>
        <ScrollView style={styles.extraProducts}>
          {orderProducts.map((item, index) => {
            return (
              <View key={index} style={styles.extraProductItems}>
                <View style={styles.item}>
                  <View style={styles.line}>
                    <Text style={styles.textItens}>{item.productTitle}</Text>
                    <Text style={styles.textItens}>
                      {' '}
                      (R${item.productPrice.toFixed(2)})
                    </Text>
                  </View>
                </View>
                <View style={styles.controls}>
                  <View style={styles.incDecButton}>
                    <TouchableOpacity
                      onPress={() =>
                        removeProduct(orderProducts, item, delivery.deliveryFee)
                      }
                    >
                      <Text style={styles.textControls}>{`-  `}</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <View style={styles.incDecButton}>
                    <TouchableOpacity
                      onPress={() =>
                        addProduct(orderProducts, item, delivery.deliveryFee)
                      }
                    >
                      <Text style={styles.textControls}>{`  +`}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <Divider style={{ borderBottomColor: Colors.tertiary }} />
      <View style={styles.totalAmountContainer}>
        <Text style={styles.textTitle}>Taxa de entrega</Text>
        <View>
          <Text style={styles.textTitle}>
            {hasAnyProduct()
              ? delivery.deliveryFee?.toFixed(2)
              : (0.0).toFixed(2)}
          </Text>
        </View>
      </View>
      <View style={styles.totalAmountContainer}>
        <Text style={styles.textTitle}>Total</Text>
        <View>
          <Text style={styles.textTitle}>{order.totalAmount.toFixed(2)}</Text>
        </View>
      </View>
      <Divider style={{ borderBottomColor: Colors.secondary }} />
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          onPress={() => {
            onHandleNewOrUpdatedOrder();
          }}
        >
          Confirmar
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: 22,
    borderTopColor: 'black',
  },
  baseProductsContainer: {
    height: '18%',
  },
  baseProducts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
  },
  baseProductsItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center'
  },
  extraProductsContainer: {
    height: '53%',
  },
  extraProducts: {
    // height: '60%'
  },
  extraProductItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  quantity: {
    fontSize: 20,
    paddingLeft: 5,
    paddingRight: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#8898AA',
  },
  controls: {
    flexDirection: 'row',
  },
  textControls: {
    fontFamily: 'Roboto',
    fontSize: 26,
    fontWeight: 'bold',
    color: '#8898AA',
  },
  title: {
    flex: 1,
    justifyContent: 'center',
    height: 40,
    paddingVertical: 15,
  },
  textTitle: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
    color: '#505050',
  },
  textItens: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 16,
    color: '#505050',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  button: {
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  totalAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const consumerOrderNavigationOptions = ({ navigation }) => {
  let headerTitle = `Pedido - ${
    navigation.state.params.user?.name?.split(' ')[0]
  }`;

  if (navigation.state.params.user?.role) {
    headerTitle = `Meu pedido - ${format(
      navigation.state.params.delivery.deliveryDate,
      GLOBALS.FORMAT.DEFAULT_DATE
    )}`;
  }
  return {
    headerTitle,
  };
};

export default withNavigationFocus(ConsumerOrderScreen);

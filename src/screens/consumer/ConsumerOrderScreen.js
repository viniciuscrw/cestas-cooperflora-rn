import React, { useContext, useEffect, useState } from 'react';
import { withNavigationFocus } from 'react-navigation';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { format } from 'date-fns';
import GLOBALS from '../../Globals';
import { Context as OrderContext } from '../../context/OrderContext';
import Colors from '../../constants/Colors';
import Divider from '../../components/Divider';
import Button from '../../components/Button';
import HeaderTitle from '../../components/HeaderTitle';
import BackArrow from '../../components/BackArrow';
import VegetableImage from '../../../assets/images/vegetable2.png';
import Spinner from '../../components/Spinner';

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
      // console.log('[ConsumerOrderProduct] delivery', delivery.limitDate);
      fetchUserOrder(user.id, delivery.id, delivery.extraProducts);
      setBaseProducts(delivery.baseProducts);
      props.navigation.setParams({ deliveryDate: delivery.deliveryDate });
    }
  }, [user, delivery]);

  useEffect(() => {
    transformOrderProducts();
  }, [order, delivery]);

  const onHandleNewOrUpdatedOrder = () => {
    console.log('[Consumer Order Screen] Handle new or update order');

    addOrder(user.id, user.name, delivery.id, delivery.deliveryFee, order).then(
      () => {
        if (user.role) {
          props.navigation.navigate('ConsumerOrderPlacedScreen', { delivery });
        } else {
          props.navigation.goBack(null);
        }
      }
    );
  };

  return loading ? (
    <Spinner />
  ) : (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.baseProductsContainer}>
          <View style={styles.baseProducts}>
            <View style={styles.title}>
              <Text
                style={styles.textTitle}
              >{`Cesta (${delivery.baseProductsPrice?.toFixed(2)})`}</Text>
            </View>
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.incDecButton}
                onPress={() => removeBaseProducts(delivery.baseProductsPrice)}
              >
                <Text style={styles.textControls}>{`-  `}</Text>
              </TouchableOpacity>
              <View style={styles.quantityContainer}>
                <Text style={styles.quantity}>{order.baseProducts}</Text>
              </View>
              <TouchableOpacity
                style={styles.incDecButton}
                onPress={() => addBaseProducts(delivery.baseProductsPrice)}
              >
                <Text style={styles.textControls}>{`  +`}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.baseProductsItems}>
            <Text style={styles.textItens}>{baseProducts}</Text>
          </View>
        </View>
        <Divider style={{ borderBottomColor: Colors.secondary }} />
        <View style={styles.extraProductsContainer}>
          <View style={styles.title}>
            <Text style={styles.textTitle}>Extras</Text>
          </View>
          <ScrollView style={styles.extraProducts}>
            {orderProducts.map((item, index) => {
              return (
                <View key={index} style={styles.extraProductItems}>
                  <View style={styles.line}>
                    <View style={styles.itemContainer}>
                      <Text style={styles.textItens}>
                        {item.productTitle} (R${item.productPrice.toFixed(2)})
                      </Text>
                    </View>
                  </View>
                  <View style={styles.controls}>
                    <View style={styles.incDecButton}>
                      <TouchableOpacity
                        onPress={() => removeProduct(orderProducts, item)}
                      >
                        <Text style={styles.textControls}>-</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <View style={styles.incDecButton}>
                      <TouchableOpacity
                        onPress={() => addProduct(orderProducts, item)}
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
        <View style={styles.buttonContainer}>
          <Divider style={{ borderBottomColor: Colors.secondary }} />
          <Button
            style={styles.confirmButton}
            textColor="white"
            onPress={onHandleNewOrUpdatedOrder}
          >
            Confirmar R$ {order.productsPriceSum?.toFixed(2)}
          </Button>
        </View>
      </View>
    </View>
  );
};

ConsumerOrderScreen.navigationOptions = (navData) => {
  const deliveryDate = format(
    navData.navigation.state.params.delivery.deliveryDate,
    GLOBALS.FORMAT.DD_MM
  );

  return {
    headerTitle: () => (
      <View>
        <View style={styles.header}>
          <HeaderTitle title="Entrega da Cesta" />
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={VegetableImage} />
          </View>
        </View>
        <Text>{deliveryDate}</Text>
      </View>
    ),
    headerBackImage: () => <BackArrow />,
    headerStyle: {
      backgroundColor: 'transparent',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop: 4,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 4, height: -3 },
    shadowRadius: 8,
    elevation: 25,
    // backgroundColor: 'red',
  },
  container: {
    flex: 1,
    margin: 25,
  },
  baseProductsContainer: {
    height: '18%',
  },
  baseProducts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  baseProductsItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    justifyContent: 'center',
    height: 40,
  },
  textTitle: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
    color: '#505050',
  },
  controls: {
    flexDirection: 'row',
  },
  incDecButton: {
    width: 35,
    height: 35,
    alignItems: 'center',
  },
  textControls: {
    fontFamily: 'Roboto',
    fontSize: 25,
    fontWeight: 'bold',
    color: '#8898AA',
  },
  quantityContainer: {
    justifyContent: 'center',
  },
  quantity: {
    fontSize: 20,
    paddingLeft: 5,
    paddingRight: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#8898AA',
    color: '#8898AA',
  },
  extraProductsContainer: {
    marginTop: 20,
    marginBottom: 20,
    height: '60%',
  },
  line: {
    flex: 1,
    flexDirection: 'row',
  },
  itemContainer: {
    justifyContent: 'center',
  },
  extraProducts: {
    marginTop: 10,
  },
  extraProductItems: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  textItens: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 16,
    color: '#505050',
  },
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  confirmButton: {
    marginTop: 5,
    backgroundColor: Colors.primary,
    justifyContent: 'space-between',
  },
  imageContainer: {
    position: 'absolute',
    right: -100,
    width: 80,
    height: 55,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default withNavigationFocus(ConsumerOrderScreen);

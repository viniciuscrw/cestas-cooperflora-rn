import React, { useContext, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { format } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import GLOBALS from '../../Globals';
import { Context as OrderContext } from '../../context/OrderContext';
import { Context as PaymentContext } from '../../context/PaymentContext';
import { Context as UserContext } from '../../context/UserContext';
import Colors from '../../constants/Colors';
import Divider from '../../components/Divider';
import Button from '../../components/Button';
import HeaderTitle from '../../components/HeaderTitle';
import BackArrow from '../../components/BackArrow';
import VegetableImage from '../../../assets/images/vegetable2.png';
import Spinner from '../../components/Spinner';
import { isConsumer, showAlert } from '../../helper/HelperFunctions';
import { Context as DeliveryContext } from '../../context/DeliveryContext';

const ConsumerOrderScreen = ({ route, navigation }) => {
  const { user, delivery } = route.params;
  // const [baseProducts, setBaseProducts] = useState();
  const [orderProducts, setOrderProducts] = useState([]);

  const {
    state: { loading, order, initialProducts },
    addBaseProducts,
    removeBaseProducts,
    addProduct,
    removeProduct,
    addOrder,
    fetchUserOrder,
    completeOrderDelivery,
  } = useContext(OrderContext);

  const {
    state: { loading: userLoading },
    findUserById,
  } = useContext(UserContext);

  const {
    state: { loading: paymentLoading },
    createPaymentForUser,
  } = useContext(PaymentContext);

  const {
    state: { loading: deliveryLoading },
  } = useContext(DeliveryContext);

  const formatBaseProducts = (baseProducts) => {
    return baseProducts.toLowerCase().replace(/\n/g, ', ');
  };

  const resolveProductAvailableQuantity = (product, initialQuantity) => {
    initialQuantity = initialQuantity != null ? initialQuantity : 0;

    if (product.maxOrderQuantity != null && product.availableQuantity != null) {
      const availableQuantity =
        product.availableQuantity - product.orderedQuantity;
      return Math.min(
        product.maxOrderQuantity,
        availableQuantity + initialQuantity
      );
    }

    if (product.maxOrderQuantity != null && product.availableQuantity == null) {
      return product.maxOrderQuantity;
    }

    if (product.availableQuantity != null) {
      return (
        product.availableQuantity - product.orderedQuantity + initialQuantity
      );
    }

    return null;
  };

  const transformOrderProducts = () => {
    const deliveryExtraProducts = delivery.extraProducts;
    const orderExtraProducts = order.extraProducts ? order.extraProducts : [];

    orderExtraProducts.forEach((orderProduct) => {
      deliveryExtraProducts.forEach((deliveryProduct) => {
        const initialIndex = initialProducts.findIndex(
          (prod) => prod.productId === orderProduct.productId
        );

        if (orderProduct.productId === deliveryProduct.id) {
          orderProduct.maxQuantity =
            initialProducts.length > 0 && initialProducts[initialIndex] != null
              ? resolveProductAvailableQuantity(
                  deliveryProduct,
                  initialProducts[initialIndex].quantity
                )
              : resolveProductAvailableQuantity(deliveryProduct, 0);
        }
      });
    });

    deliveryExtraProducts
      .filter((deliveryProduct) => {
        const ids = orderExtraProducts.map(
          (orderProduct) => orderProduct.productId
        );
        return !ids.includes(deliveryProduct.id);
      })
      .forEach((product) => {
        orderExtraProducts.push({
          productId: product.id,
          productPrice: product.price,
          productTitle: product.name,
          quantity: 0,
          maxQuantity: resolveProductAvailableQuantity(product),
        });
      });

    const transformedOrderProducts = orderExtraProducts;
    transformedOrderProducts.sort((a, b) => {
      return a.productTitle > b.productTitle ? 1 : -1;
    });

    setOrderProducts(transformedOrderProducts);
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('[Consumer Order Product Screen - useEffect fetch orders');
      if (user && delivery) {
        if (!user.role || order == null) {
          console.log(`[Consumer Order Screen] Fetching order...`);
          // Quando não tem role, é porque está vindo da tela de gerenciamento, então é uma pessoa organizadora que está manipulando o pedido
          fetchUserOrder(user.id, delivery.id, delivery.extraProducts);
        }

        // setBaseProducts(delivery.baseProducts);
        navigation.setParams({
          deliveryDate: format(delivery.deliveryDate, GLOBALS.FORMAT.DD_MM),
        });
      }
    }, [user, delivery])
  );

  useEffect(() => {
    transformOrderProducts();
  }, [order, delivery]);

  const onHandleNewOrUpdatedOrder = () => {
    console.log('[Consumer Order Screen] Handle new or update order');

    addOrder(
      user.id,
      user.name,
      delivery.id,
      delivery.deliveryFee,
      order,
      initialProducts
    )
      .then(() => {
        if (order.productsPriceSum === 0) {
          showAlert('Seu pedido para esta entrega foi cancelado.');
          navigation.navigate('DeliveriesScreen');
          return;
        }

        if (user.role && user.role === GLOBALS.USER.ROLE.CONSUMER) {
          navigation.navigate('ConsumerOrderPlacedScreen', {
            delivery,
            user,
          });
        } else {
          navigation.goBack();
        }
      })
      .catch((error) => {
        showAlert(error);
        fetchUserOrder(user.id, delivery.id, delivery.extraProducts);
      });
  };

  const renderConfirmButton = () => {
    const buttonDisabled = false;
    if (order.productsPriceSum === 0) {
      if (
        order.deliveryId &&
        order.userId &&
        order.status !== GLOBALS.ORDER.STATUS.CANCELED
      ) {
        return (
          <Button
            id="confirmOrderButton"
            style={styles.confirmButton}
            textColor="white"
            onPress={onHandleNewOrUpdatedOrder}
          >
            Cancelar pedido
          </Button>
        );
      }
      return (
        <Button
          id="confirmOrderButton"
          style={styles.disabledButton}
          textColor="white"
          onPress={onHandleNewOrUpdatedOrder}
          disabled
        >
          Confirmar R$ {order.productsPriceSum?.toFixed(2)}
        </Button>
      );
    }

    return (
      <Button
        id="confirmOrderButton"
        style={styles.confirmButton}
        textColor="white"
        onPress={onHandleNewOrUpdatedOrder}
        disabled={buttonDisabled}
      >
        Confirmar R$ {order.productsPriceSum?.toFixed(2)}
      </Button>
    );
  };

  const completeDelivery = async () => {
    if (order.id && order.deliveryId && order.userId) {
      const completedOrder = await completeOrderDelivery(
        user.id,
        user.name,
        delivery.id,
        delivery.deliveryFee,
        order
      );
      const orderUser = await findUserById(order.userId);
      await createPaymentForUser(orderUser, completedOrder);
      navigation.goBack(null);
    }
  };

  const renderCompleteDeliveryButton = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    delivery.deliveryDate?.setHours(0, 0, 0, 0);

    if (
      order.status != null &&
      order.status === GLOBALS.ORDER.STATUS.COMPLETED
    ) {
      return (
        <Button style={styles.disabledButton} textColor="white" disabled>
          Entrega concluída
        </Button>
      );
    }

    if (
      today >= delivery.deliveryDate &&
      !user.role &&
      order.productsPriceSum > 0 &&
      order.id
    ) {
      return (
        <Button
          style={styles.completeDeliveryButton}
          textColor="white"
          onPress={() => completeDelivery()}
        >
          Concluir entrega
        </Button>
      );
    }

    return null;
  };

  const isLoading = () => {
    return (
      !order ||
      !delivery ||
      loading ||
      deliveryLoading ||
      userLoading ||
      paymentLoading
    );
  };

  return isLoading() ? (
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
          <ScrollView style={styles.baseProductsItems}>
            <Text style={styles.textItens}>
              {formatBaseProducts(delivery.baseProducts)}
            </Text>
          </ScrollView>
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
                        onPress={() =>
                          addProduct(orderProducts, item, initialProducts)
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
        <View style={styles.buttonContainer}>
          <Divider style={{ borderBottomColor: Colors.secondary }} />
          {renderConfirmButton()}
          {renderCompleteDeliveryButton()}
        </View>
      </View>
    </View>
  );
};

export const consumerOrderScreenOptions = (navData) => {
  const { deliveryDate, user } = navData.route.params;
  const headerTitle = isConsumer(user)
    ? 'Fazer pedido'
    : `Fazer pedido - ${user?.name}`;
  // console.log(`navDataa${JSON.stringify(navData.route.params)}`);

  return {
    headerTitle: () => (
      <View>
        <View style={styles.header}>
          <HeaderTitle title={headerTitle} />
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={VegetableImage} />
          </View>
        </View>
        <Text>Entrega da cesta - {deliveryDate}</Text>
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
  },
  container: {
    flex: 1,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  baseProductsContainer: {
    marginBottom: 10,
    height: '20%',
  },
  baseProducts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  baseProductsItems: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
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
    marginTop: 10,
    marginBottom: 10,
    height: '63%',
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
  completeDeliveryButton: {
    marginTop: 5,
    backgroundColor: Colors.secondary,
    justifyContent: 'space-between',
  },
  disabledButton: {
    marginTop: 5,
    backgroundColor: Colors.tertiary,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'flex-start',
  },
  imageContainer: {
    position: 'absolute',
    right: -10,
    width: 80,
    height: 55,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ConsumerOrderScreen;

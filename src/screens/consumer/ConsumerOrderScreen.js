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
import { Entypo } from '@expo/vector-icons';
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
import { TextContent, TextLabel } from '../../components/StandardStyles';

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
    // Sort the products list based on the quantity to facilitate the local delivery.
    transformedOrderProducts.sort((a, b) => {
      // return a.productTitle > b.productTitle ? 1 : -1;
      return a.quantity < b.quantity || a.productTitle > b.productTitle
        ? 1
        : -1;
    });

    setOrderProducts(transformedOrderProducts);
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('[Consumer Order Product Screen - useEffect fetch orders');
      if (user && delivery) {
        if (!user.role || order == null) {
          console.log(`[Consumer Order Screen] Fetching order...`);
          // When there is no role the the administrator (Organizador) is managing the order

          fetchUserOrder(user.id, delivery.id, delivery.extraProducts);
        }
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
              <TextLabel>
                {`Cesta (${delivery.baseProductsPrice?.toFixed(2)})`}
              </TextLabel>
            </View>
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.incDecButton}
                onPress={() => removeBaseProducts(delivery.baseProductsPrice)}
              >
                {/* <Text style={styles.textControls}>{`-  `}</Text> */}
                <Entypo name="minus" size={24} color="#8898AA" />
              </TouchableOpacity>
              <View style={styles.quantityContainer}>
                <Text style={styles.quantity}>{order.baseProducts}</Text>
              </View>
              <TouchableOpacity
                style={styles.incDecButton}
                onPress={() => addBaseProducts(delivery.baseProductsPrice)}
              >
                {/* <Text style={styles.textControls}>{`  +`}</Text> */}
                <Entypo name="plus" size={24} color="#8898AA" />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView style={styles.baseProductsItems}>
            <TextContent>
              {formatBaseProducts(delivery.baseProducts)}
            </TextContent>
          </ScrollView>
        </View>
        <Divider style={{ borderBottomColor: Colors.secondary }} />
        <TextLabel>Extras</TextLabel>
        <View style={styles.extraProductsContainer}>
          <ScrollView style={styles.extraProducts}>
            {orderProducts.map((item, index) => {
              return (
                <View key={index} style={styles.extraProductItems}>
                  <View style={styles.itemContainer}>
                    <TextContent>
                      {item.productTitle} (R${item.productPrice.toFixed(2)})
                    </TextContent>
                  </View>
                  <View style={styles.controls}>
                    <View style={styles.incDecButton}>
                      <TouchableOpacity
                        onPress={() => removeProduct(orderProducts, item)}
                      >
                        <Entypo name="minus" size={24} color="#8898AA" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <View style={styles.incDecButton}>
                      <TouchableOpacity
                        onPress={() =>
                          addProduct(orderProducts, item, initialProducts)
                        }
                      >
                        <Entypo name="plus" size={24} color="#8898AA" />
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
          {order.paymentStatus === GLOBALS.PAYMENT.STATUS.COMPLETED ? (
            <TextLabel>
              Pagamento já foi efetuado. Não é possível fazer alterações.
            </TextLabel>
          ) : (
            renderConfirmButton()
          )}
          {renderCompleteDeliveryButton()}
        </View>
      </View>
    </View>
  );
};

export const consumerOrderScreenOptions = (navData) => {
  const { deliveryDate, user } = navData.route.params;
  const firstName = user.name.split(' ')[0];
  const headerTitle = isConsumer(user)
    ? 'Fazer pedido'
    : `Fazer pedido - ${firstName}`;
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
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  baseProductsContainer: {
    marginBottom: 10,
    // height: '20%',
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
  // title: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   height: 40,
  // },
  controls: {
    flexDirection: 'row',
  },
  incDecButton: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // textControls: {
  //   fontFamily: 'Roboto',
  //   fontSize: 25,
  //   fontWeight: 'bold',
  //   color: '#8898AA',
  // },
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
    height: '59%',
    borderWidth: 1,
    borderColor: Colors.tertiary,
    paddingLeft: 2,
    paddingRight: 2,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  // extraProducts: {
  //   marginTop: 10,
  // },
  extraProductItems: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  buttonContainer: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  confirmButton: {
    marginTop: 5,
    backgroundColor: Colors.primary,
    width: '100%',
  },
  completeDeliveryButton: {
    marginTop: 5,
    backgroundColor: Colors.secondary,
    width: '100%',
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

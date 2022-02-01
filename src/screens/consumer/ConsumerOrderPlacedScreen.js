import React, { useContext } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { format, isAfter } from 'date-fns';
import Divider from '../../components/Divider';
import Colors from '../../constants/Colors';
import { Context as OrderContext } from '../../context/OrderContext';
import HeaderTitle from '../../components/HeaderTitle';
import BackArrow from '../../components/BackArrow';
import VegetableImage from '../../../assets/images/vegetable1.png';
import Spinner from '../../components/Spinner';
import Button from '../../components/Button';
import GLOBALS from '../../Globals';
import { Context as DeliveryContext } from '../../context/DeliveryContext';

const ConsumerOrderPlacedScreen = ({ navigation, route }) => {
  const {
    state: { order, loading },
  } = useContext(OrderContext);

  const {
    state: { loading: deliveryLoading },
    fetchDelivery,
  } = useContext(DeliveryContext);

  const { user, delivery } = route.params;

  const hasAnyProduct = () => {
    return (
      order?.baseProducts > 0 ||
      (order?.extraProducts?.length > 0 &&
        order.extraProducts.some((prod) => prod.quantity > 0))
    );
  };

  const handleUpdateOrder = () => {
    fetchDelivery(delivery.id).then((deliveryFound) => {
      console.log(
        `[ConsumerOrderPlaced] Updating order for delivery: ${JSON.stringify(
          deliveryFound.id
        )} and user ${user?.id}`
      );
      navigation.navigate('ConsumerOrderScreen', {
        user,
        delivery: deliveryFound,
      });
    });
  };

  const renderEditOrderButton = () => {
    const currentDate = new Date();

    const { limitDate } = delivery;
    const isOrderCompleted =
      order && order.status && order.status === GLOBALS.ORDER.STATUS.COMPLETED;

    return isAfter(currentDate, limitDate) || isOrderCompleted ? null : (
      <>
        <Divider style={{ borderBottomColor: Colors.secondary }} />
        <Button
          style={styles.confirmButton}
          textColor="white"
          onPress={() => handleUpdateOrder()}
        >
          Editar Pedido
        </Button>
      </>
    );
  };

  return loading || deliveryLoading ? (
    <Spinner />
  ) : (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Pedido realizado!</Text>
        </View>
        <Divider style={{ borderBottomColor: Colors.secondary }} />
        <ScrollView style={styles.orderedItemsContainer}>
          <View>
            <View style={styles.orderItemContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.itemText}>{order.baseProducts}</Text>
                <Text style={styles.itemText}>Cesta(s)</Text>
              </View>
              <Text style={styles.itemValue}>
                R${' '}
                {(order.baseProducts * delivery.baseProductsPrice).toFixed(2)}
              </Text>
            </View>
            <View>
              {order.extraProducts.map((extraProduct) => {
                const total = extraProduct.productPrice * extraProduct.quantity;
                return (
                  <View>
                    {total !== 0 ? (
                      <View style={styles.orderItemContainer}>
                        <View style={styles.textContainer}>
                          <Text style={styles.itemText}>
                            {extraProduct.quantity}
                          </Text>
                          <Text style={styles.itemText}>
                            {extraProduct.productTitle}
                          </Text>
                        </View>
                        <View style={styles.box2}>
                          <Text style={styles.itemValue}>
                            R$ {total.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
            {/* <FlatList
              data={order.extraProducts}
              keyExtractor={(item) => item.productTitle}
              renderItem={(itemData) => {
                const total =
                  itemData.item.productPrice * itemData.item.quantity;
                return (
                  <View>
                    {total !== 0 ? (
                      <View style={styles.orderItemContainer}>
                        <View style={styles.textContainer}>
                          <Text style={styles.itemText}>
                            {itemData.item.quantity}
                          </Text>
                          <Text style={styles.itemText}>
                            {itemData.item.productTitle}
                          </Text>
                        </View>
                        <View style={styles.box2}>
                          <Text style={styles.itemValue}>
                            R$ {total.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    ) : null}
                  </View>
                );
              }}
            /> */}
          </View>
        </ScrollView>
        <Divider style={{ borderBottomColor: Colors.tertiary }} />
        <View style={styles.totalAmountContainer}>
          <View style={styles.totalAmountText}>
            <Text style={styles.itemText}>Taxa de entrega</Text>
            <Text style={styles.itemValue}>
              R${' '}
              {hasAnyProduct()
                ? delivery.deliveryFee?.toFixed(2)
                : (0.0).toFixed(2)}
            </Text>
          </View>
          <View style={styles.totalAmountText}>
            <Text style={styles.itemText}>Total</Text>
            <Text style={styles.itemValue}>
              R$ {order.totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>{renderEditOrderButton()}</View>
      </View>
    </View>
  );
};

export const consumerOrderPlacedScreenOptions = (navData) => {
  const deliveryDate = format(
    navData.route.params.delivery.deliveryDate,
    GLOBALS.FORMAT.DD_MM
  );
  return {
    headerTitle: () => (
      <View style={styles.header}>
        <HeaderTitle title="Seu pedido" />
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={VegetableImage} />
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
    margin: 25,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // height: '20%',
    padding: 10,
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 24,
    color: '#505050',
  },
  orderedItemsContainer: {
    height: '30%',
  },
  orderItemContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
  },
  itemText: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
    color: '#505050',
    padding: 2,
  },
  itemValue: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
    color: '#8898AA',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  totalAmountText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  totalAmountContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  confirmButton: {
    marginTop: 5,
    backgroundColor: Colors.primary,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'flex-start',
  },
  imageContainer: {
    position: 'absolute',
    right: -100,
    width: 80,
    height: 50,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ConsumerOrderPlacedScreen;

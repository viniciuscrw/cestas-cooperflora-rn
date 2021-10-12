import React, { useContext } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { format } from 'date-fns';
import Divider from '../../components/Divider';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';
import { Context as OrderContext } from '../../context/OrderContext';
import HeaderTitle from '../../components/HeaderTitle';
import BackArrow from '../../components/BackArrow';
import VegetableImage from '../../../assets/images/vegetable1.png';
import GLOBALS from '../../Globals';

const ConsumerOrderPlacedScreen = (props) => {
  console.log('[ConsumerOrderPlacedScreen]');
  const {
    state: { order },
  } = useContext(OrderContext);
  // const { delivery } = props.navigation.state.params;
  const { delivery } = props.route.params;

  // console.log('[ConsumerOrderPlacedScreen]', order);

  // TODO Resolver aqui pra quem nao tem pedido
  if (order && !order.id) {
    props.navigation.navigate('Deliveries');
  }

  const hasAnyProduct = () => {
    return (
      order?.baseProducts > 0 ||
      (order?.extraProducts?.length > 0 &&
        order.extraProducts.some((prod) => prod.quantity > 0))
    );
  };

  const handleOnConfirmPayment = () => {
    props.navigation.navigate('ConsumerAddPaymentScreen', {
      orderTotalAmount: order.totalAmount,
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Pedido Realizado!</Text>
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
                        <View style={styles.textContainer}>
                          <Text style={styles.itemText}>
                            {itemData.item.quantity}
                          </Text>
                          <Text style={styles.itemText}>
                            {itemData.item.productTitle}
                          </Text>
                        </View>
                        <View style={styles.box2}>
                          <Text style={styles.itemValue}>R$ {total}</Text>
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
          <Text style={styles.itemText}>Taxa de entrega</Text>
          <Text style={styles.itemValue}>
            R${' '}
            {hasAnyProduct()
              ? delivery.deliveryFee?.toFixed(2)
              : (0.0).toFixed(2)}
          </Text>
        </View>
        <View style={styles.totalAmountContainer}>
          <Text style={styles.itemText}>Total</Text>
          <Text style={styles.itemValue}>
            R$ {order.totalAmount.toFixed(2)}
          </Text>
        </View>
        {/* <View style={styles.buttonContainer}>
          <Divider style={{ borderBottomColor: Colors.secondary }} />
          <Button
            style={styles.confirmButton}
            textColor="white"
            onPress={handleOnConfirmPayment}
          >
            Adicionar Pagamento
          </Button>
        </View> */}
      </View>
    </View>
  );
};

export const consumerOrderPlacedScreenOptions = (navData) => {
  console.log(`navData:`);
  const deliveryDate = format(
    // navData.navigation.state.params.delivery.deliveryDate,
    navData.route.params.delivery.deliveryDate,

    GLOBALS.FORMAT.DD_MM
  );
  return {
    headerTitle: () => (
      <View style={styles.header}>
        <HeaderTitle title="Entrega da Cesta" />
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={VegetableImage} />
        </View>
        <Text>{deliveryDate}</Text>
      </View>
    ),
    headerBackImage: () => <BackArrow />,
    headerStyle: {
      headerTitleAlign: 'left',
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
    // padding: 25,
    // height: '50%',
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
  totalAmountContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    alignItems: 'flex-start'
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

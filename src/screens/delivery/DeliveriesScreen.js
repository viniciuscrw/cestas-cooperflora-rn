import React, { useContext, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { Divider } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { isAfter } from 'date-fns';
import Spinner from '../../components/Spinner';
import ConsumerGroupDetails from '../../components/ConsumerGroupDetails';
import MainHeader from '../../components/MainHeader';
import Button from '../../components/Button';
import { Context as DeliveryContext } from '../../context/DeliveryContext';
import { Context as OrderContext } from '../../context/OrderContext';
import useUser from '../../hooks/useUser';
import DeliveryCard from '../../components/DeliveryCard';
import GLOBALS from '../../Globals';
import BasketProductsImage from '../../../assets/images/basketproducts.png';
import Colors from '../../constants/Colors';
import { stardardScreenStyle as screen } from '../screenstyles/ScreenStyles';
import { showAlert } from '../../helper/HelperFunctions';

const DeliveriesScreen = ({ navigation }) => {
  console.log('[Delivery Screen] started...');
  const [refreshing, setRefreshing] = useState(false);
  const user = useUser();
  const {
    state: { nextDelivery, lastDeliveries, loading },
    fetchDeliveries,
  } = useContext(DeliveryContext);
  const {
    state: { loading: orderLoading },
    getUserOrder,
    startOrder,
  } = useContext(OrderContext);

  useFocusEffect(
    React.useCallback(() => {
      fetchDeliveries();
    }, [])
  );

  const renderButtonOrMessage = () => {
    if (user && user.role === GLOBALS.USER.ROLE.ORGANIZER) {
      return (
        <View style={styles.buttonContainer}>
          <Button
            id="addNextDeliveryButton"
            style={styles.button}
            textColor="white"
            onPress={() =>
              navigation.navigate('DeliveryManagement', {
                screen: 'CreateDeliveryScreen',
              })
            }
          >
            Adicionar próxima entrega
          </Button>
        </View>
      );
    }
    return (
      <Text style={styles.nextDeliveryButton}>
        A próxima entrega ainda não foi agendada.
      </Text>
    );
  };

  const editDelivery = (delivery) => {
    navigation.navigate('DeliveryManagement', {
      params: { delivery },
      screen: 'CreateDeliveryScreen',
    });
  };

  const onNextDeliveryCardClick = async (delivery) => {
    if (user.role === GLOBALS.USER.ROLE.ORGANIZER) {
      navigation.navigate('OrdersManagement', { delivery });
    } else {
      const order = await getUserOrder(user.id, delivery.id);

      if (order != null && order.id != null && order.totalAmount > 0) {
        navigation.navigate('ConsumerOrderPlacedScreen', { user, delivery });
      } else {
        const currentDate = new Date();

        if (isAfter(currentDate, delivery.limitDate)) {
          showAlert('Os pedidos para essa entrega já foram encerrados.');
        } else {
          if (order == null || order.id == null) {
            startOrder(delivery.extraProducts);
          }
          navigation.navigate('ConsumerOrderScreen', { user, delivery });
        }
      }
    }
  };

  const onPastDeliveryCardClick = async (delivery) => {
    if (user.role === GLOBALS.USER.ROLE.ORGANIZER) {
      navigation.navigate('OrdersManagement', { delivery });
    } else {
      const order = await getUserOrder(user.id, delivery.id);

      if (order != null && order.id != null && order.totalAmount > 0) {
        navigation.navigate('ConsumerOrderPlacedScreen', { user, delivery });
      } else {
        showAlert('Pedido não realizado para esta entrega.');
      }
    }
  };

  const renderNextDelivery = () => {
    return (
      <View style={styles.deliveriesListHeader}>
        <Text style={styles.text}>Próxima entrega</Text>
        {nextDelivery ? (
          <View style={styles.nextDeliveryItem}>
            <DeliveryCard
              delivery={nextDelivery}
              ordersDateText="Pedidos até:"
              onPress={() => onNextDeliveryCardClick(nextDelivery)}
              showEditButton={user.role === GLOBALS.USER.ROLE.ORGANIZER}
              onEditButtonPress={() => editDelivery(nextDelivery)}
            />
          </View>
        ) : (
          renderButtonOrMessage()
        )}
        {lastDeliveries && lastDeliveries.length ? (
          <View>
            <Divider style={styles.divider} />
            <Text style={styles.text}>Últimas entregas</Text>
          </View>
        ) : null}
      </View>
    );
  };

  const renderLastDeliveriesItem = ({ item }) => {
    return (
      <View style={styles.lastDeliveriesItem}>
        <DeliveryCard
          delivery={item}
          ordersDateText="Pedidos encerrados em:"
          borderColor="darkorange"
          onPress={() => onPastDeliveryCardClick(item)}
        />
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        {!loading && !orderLoading && user ? (
          <FlatList
            data={lastDeliveries}
            ListHeaderComponent={renderNextDelivery}
            renderItem={renderLastDeliveriesItem}
            keyExtractor={(item) => item.id}
            onRefresh={() => {
              setRefreshing(true);
              fetchDeliveries();
              setRefreshing(false);
            }}
            refreshing={refreshing}
          />
        ) : (
          <Spinner />
        )}
      </View>
    </View>
  );
};

export const deliveriesNavigationOptions = (navigation) => {
  return {
    headerTitle: () => (
      <View>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={BasketProductsImage} />
        </View>
        <View style={{ marginLeft: 50 }}>
          <MainHeader />
        </View>
      </View>
    ),
    headerRight: () => (
      <ConsumerGroupDetails navigation={navigation.navigation} />
    ),
    headerShown: true,
    headerStyle: {
      backgroundColor: 'transparent',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
  };
};

const styles = StyleSheet.create({
  screen,
  container: {
    flex: 1,
    margin: 5,
  },
  deliveriesListHeader: {
    flex: 1,
    padding: 10,
    marginTop: 10,
  },
  lastDeliveriesItem: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  text: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
    color: '#505050',
  },
  nextDeliveryItem: {
    marginTop: 10,
    marginBottom: 10,
  },
  nextDeliveryButton: {
    marginTop: 20,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    marginVertical: 20,
    marginHorizontal: -10,
  },
  imageContainer: {
    position: 'absolute',
    left: -15,
    width: 80,
    height: 65,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    // position: 'absolute',
    width: '100%',
    // bottom: 0,
  },
  button: {
    marginTop: 5,
    backgroundColor: Colors.secondary,
    alignSelf: 'center',
  },
});

export default DeliveriesScreen;

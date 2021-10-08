import React, { useContext, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { Divider } from 'react-native-elements';
import Spinner from '../../components/Spinner';
import ConsumerGroupDetails from '../../components/ConsumerGroupDetails';
import MainHeader from '../../components/MainHeader';
import Button from '../../components/Button';
import { Context as DeliveryContext } from '../../context/DeliveryContext';
import useUser from '../../hooks/useUser';
import DeliveryCard from '../../components/DeliveryCard';
import GLOBALS from '../../Globals';
import HeaderTitle from '../../components/HeaderTitle';
import BackArrow from '../../components/BackArrow';
import BasketProductsImage from '../../../assets/images/basketproducts.png';

const DeliveriesScreen = ({ navigation }) => {
  const user = useUser();
  const { state, fetchDeliveries } = useContext(DeliveryContext);

  useEffect(() => {
    fetchDeliveries();
  }, [])

  const renderButtonOrMessage = () => {
    if (user && user.role === GLOBALS.USER.ROLE.ORGANIZER) {
      return (
        <Button
          style={styles.nextDeliveryButton}
          onPress={() => navigation.navigate('CreateDeliveryScreen')}
        >
          Adicionar próxima entrega
        </Button>
      );
    }
    return (
      <Text style={styles.nextDeliveryButton}>
        A próxima entrega ainda não foi agendada.
      </Text>
    );
  };

  const editDelivery = (delivery) => {
    navigation.navigate('CreateDelivery', { delivery });
  };

  const onCardClick = (delivery) => {
    if (user.role === GLOBALS.USER.ROLE.ORGANIZER) {
      navigation.navigate('OrdersManagement', { delivery });
    } else {
      navigation.navigate('ConsumerOrderScreen', { user, delivery });
    }
  };

  const renderNextDelivery = () => {
    const { nextDelivery, lastDeliveries } = state;

    return (
      <View style={styles.deliveriesListHeader}>
        <Text style={styles.text}>Próxima entrega</Text>
        {nextDelivery ? (
          <View style={styles.nextDeliveryItem}>
            <DeliveryCard
              delivery={nextDelivery}
              ordersDateText="Pedidos até:"
              borderColor="darkolivegreen"
              onPress={() => onCardClick(nextDelivery)}
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
          onPress={() => onCardClick(item)}
        />
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        {/* <NavigationEvents onWillFocus={fetchDeliveries} /> */}
        {!state.loading && user ? (
          <FlatList
            data={state.lastDeliveries}
            ListHeaderComponent={renderNextDelivery}
            renderItem={renderLastDeliveriesItem}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <Spinner />
        )}
      </View>
    </View>
  );
};

export const deliveriesNavigationOptions = ( navigation ) => {
  // console.log('Deliveries Screen', navigation.navigate);
  return {
    headerTitle: () => (
      <View>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={BasketProductsImage} />
        </View>
        <MainHeader />
      </View>
    ),
    // headerBackImage: () => (<BackArrow />),
    headerRight: () => <ConsumerGroupDetails navigation={navigation.navigation}/>,
    headerStyle: {
      backgroundColor: 'transparent',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    }
  };
  // return {
  //   headerTitle: () => <MainHeader />,
  //   headerRight: () => <ConsumerGroupDetails />,
  // };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop: 4,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 25
  },
  container: {
    flex: 1,
    margin: 5
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
    left: -100,
    width: 80,
    height: 65,
  },
  image: {
    width: '100%',
    height: '100%'
  }
});

export default DeliveriesScreen;

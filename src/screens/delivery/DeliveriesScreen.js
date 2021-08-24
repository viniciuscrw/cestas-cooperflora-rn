import React, { useContext } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { Divider } from 'react-native-elements';
import Spinner from '../../components/Spinner';
import ConsumerGroupDetails from '../../components/ConsumerGroupDetails';
import MainHeader from '../../components/MainHeader';
import Button from '../../components/Button';
import { Context as DeliveryContext } from '../../context/DeliveryContext';
import useUser from '../../hooks/useUser';
import DeliveryCard from '../../components/DeliveryCard';

const DeliveriesScreen = ({ navigation }) => {
  const user = useUser();
  const { state, fetchDeliveries } = useContext(DeliveryContext);

  const renderButtonOrMessage = () => {
    if (user && user.role === 'organizer') {
      return (
        <Button
          style={styles.nextDeliveryButton}
          onPress={() => navigation.navigate('CreateDelivery')}
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
              onPress={() => navigation.navigate('OrdersManagement')}
              showEditButton
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
          onPress={() => navigation.navigate('OrdersManagement')}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <NavigationEvents onWillFocus={fetchDeliveries} />
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
  );
};

export const deliveriesNavigationOptions = () => {
  return {
    headerTitle: () => <MainHeader />,
    headerRight: () => <ConsumerGroupDetails />,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb',
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
    color: '#101010',
    fontSize: 22,
    fontWeight: 'bold',
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
});

export default withNavigation(DeliveriesScreen);

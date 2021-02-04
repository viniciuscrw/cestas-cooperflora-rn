import React, { useContext } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Spinner from '../../components/Spinner';
import ConsumerGroupDetails from '../../components/ConsumerGroupDetails';
import MainHeader from '../../components/MainHeader';
import Button from '../../components/Button';
import { Context as DeliveryContext } from '../../context/DeliveryContext';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { Card, Divider } from 'react-native-elements';
import { format } from 'date-fns';
import GLOBALS from '../../Globals';
import useUser from '../../hooks/useUser';

const DeliveriesScreen = ({ navigation }) => {
  const user = useUser();
  const { state, fetchDeliveries } = useContext(DeliveryContext);

  const formatBaseProducts = (delivery) => {
    return delivery.baseProducts.toLowerCase().replace(/\n/g, ', ');
  };

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
    } else {
      return (
        <Text style={styles.nextDeliveryButton}>
          A próxima entrega ainda não foi agendada.
        </Text>
      );
    }
  };

  const renderNextDelivery = () => {
    let nextDelivery = state.nextDelivery;
    let lastDeliveries = state.lastDeliveries;

    return (
      <View style={styles.deliveriesListHeader}>
        <Text style={styles.text}>Próxima entrega</Text>
        {nextDelivery ? (
          <View style={styles.nextDeliveryItem}>
            <TouchableOpacity>
              <Card
                containerStyle={{
                  borderWidth: 0.25,
                  borderRadius: 5,
                  borderColor: 'darkolivegreen',
                  backgroundColor: '#ebebeb',
                }}
                title={format(nextDelivery.deliveryDate, 'dd/MM/yyyy')}
                dividerStyle={{ backgroundColor: 'darkolivegreen' }}
              >
                <Text>
                  <Text style={styles.cardTextStrong}>Pedidos até: </Text>
                  <Text style={styles.cardText}>
                    {format(
                      nextDelivery.limitDate,
                      GLOBALS.FORMAT.DEFAULT_DATE
                    )}{' '}
                    às {format(nextDelivery.limitDate, 'HH:mm')}
                  </Text>
                </Text>
                <Text numberOfLines={3} style={styles.cardTextContainer}>
                  <Text style={styles.cardTextStrong}>
                    Composição da cesta:{' '}
                  </Text>
                  <Text style={styles.cardText}>
                    {formatBaseProducts(nextDelivery)}
                  </Text>
                </Text>
              </Card>
            </TouchableOpacity>
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
        <TouchableOpacity>
          <Card
            containerStyle={{
              borderWidth: 0.25,
              borderRadius: 5,
              borderColor: 'darkorange',
              backgroundColor: '#ebebeb',
            }}
            title={format(item.deliveryDate, GLOBALS.FORMAT.DEFAULT_DATE)}
            dividerStyle={{ backgroundColor: 'darkorange' }}
          >
            <Text>
              <Text style={styles.cardTextStrong}>Pedidos encerrados em: </Text>
              <Text style={styles.cardText}>
                {format(item.limitDate, 'dd/MM/yyyy')} às{' '}
                {format(item.limitDate, 'HH:mm')}
              </Text>
            </Text>
            <Text numberOfLines={3} style={styles.cardTextContainer}>
              <Text style={styles.cardTextStrong}>Composição da cesta: </Text>
              <Text style={styles.cardText}>{formatBaseProducts(item)}</Text>
            </Text>
          </Card>
        </TouchableOpacity>
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
  cardTextStrong: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardText: {
    fontSize: 15,
  },
  cardTextContainer: {
    marginTop: 5,
  },
});

export default withNavigation(DeliveriesScreen);

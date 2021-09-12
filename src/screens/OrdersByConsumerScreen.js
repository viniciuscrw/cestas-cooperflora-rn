import React, { useContext, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { format } from 'date-fns';
import { NavigationEvents } from 'react-navigation';
import { Input, ListItem } from 'react-native-elements';
import GLOBALS from '../Globals';
import { Context as OrdersContext } from '../context/OrdersContext';
import { Context as UserContext } from '../context/UserContext';
import Spinner from '../components/Spinner';

const OrdersByConsumerScreen = ({ navigation }) => {
  const {
    state: { loading: userLoading },
    findUserById,
  } = useContext(UserContext);
  const {
    state: { loading: orderLoading, orders },
    fetchOrdersByDelivery,
  } = useContext(OrdersContext);
  const deliveryId = navigation.state.params.delivery.id;
  // console.log(`nav: ${JSON.stringify(navigation)}`);
  const [filteredOrdersByConsumer, setFilteredOrdersByConsumer] = useState(
    null
  );
  const [filterText, setFilterText] = useState('');

  const renderSearchIcon = () => {
    return !filterText.length
      ? {
          type: 'ionicons',
          name: 'search',
          size: 25,
          color: 'lightgrey',
        }
      : {
          type: 'material',
          name: 'clear',
          size: 25,
          color: 'lightgrey',
          onPress: () => {
            setFilterText('');
            setFilteredOrdersByConsumer(null);
          },
        };
  };

  const searchConsumersByFilter = () => {
    setFilteredOrdersByConsumer(
      orders.filter((order) =>
        order.userName.toLowerCase().includes(filterText.toLowerCase())
      )
    );
  };

  const renderSubtitle = (order) => {
    const hasBaseProducts =
      order.baseProducts != null && order.baseProducts > 0;
    const hasExtraProducts =
      order.extraProducts != null && order.extraProducts.length > 0;

    if (hasBaseProducts && hasExtraProducts) {
      return <Text>Total: R$ {order.totalAmount} (Cesta + Extras)</Text>;
    }

    if (hasBaseProducts && !hasExtraProducts) {
      return <Text>Total: R$ {order.totalAmount} (Cesta)</Text>;
    }

    if (!hasBaseProducts && hasExtraProducts) {
      return <Text>Total: R$ {order.totalAmount} (Extras)</Text>;
    }
  };

  const renderItem = ({ item: order }) => {
    return (
      <TouchableOpacity onPress={() => console.log('')}>
        <ListItem
          containerStyle={styles.listItemContainer}
          title={`${order.userName}`}
          titleStyle={styles.listItemTitle}
          subtitle={renderSubtitle(order)}
          bottomDivider
          chevron
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <NavigationEvents
        onWillFocus={() => fetchOrdersByDelivery({ deliveryId })}
      />
      <Input
        containerStyle={styles.searchInput}
        placeholder="Buscar pessoa consumidora"
        value={filterText}
        onChangeText={setFilterText}
        onEndEditing={searchConsumersByFilter}
        returnKeyType="done"
        autoCorrect={false}
        rightIcon={renderSearchIcon()}
      />
      {!orderLoading ? (
        <FlatList
          data={
            filteredOrdersByConsumer && filteredOrdersByConsumer.length
              ? filteredOrdersByConsumer
              : orders
          }
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.productsList}
        />
      ) : (
        <Spinner />
      )}
    </View>
  );
};

export const ordersManagementNavigationOptions = ({ navigation }) => {
  return {
    headerTitle: `Pedidos - ${format(
      navigation.state.params.delivery.deliveryDate,
      GLOBALS.FORMAT.DEFAULT_DATE
    )}`,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ebebeb',
  },
  text: {
    color: '#101010',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchInput: {
    width: 300,
  },
  productsList: {
    marginTop: -10,
  },
  listItemContainer: {
    backgroundColor: 'transparent',
    padding: 10,
    minHeight: 60,
  },
  listItemTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 20,
  },
});

export default OrdersByConsumerScreen;

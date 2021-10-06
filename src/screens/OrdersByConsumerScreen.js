import React, { useContext, useEffect, useState } from 'react';
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
import { Context as OrderContext } from '../context/OrderContext';
import { Context as UserContext } from '../context/UserContext';
import Spinner from '../components/Spinner';

const OrdersByConsumerScreen = ({ navigation }) => {
  const {
    state: { loading: orderLoading, orders },
    fetchOrdersByDelivery,
  } = useContext(OrderContext);

  const {
    state: { loading: userLoading, users },
    fetchUsers,
  } = useContext(UserContext);

  const { delivery } = navigation.state.params;
  const [usersOrders, setUsersOrders] = useState([]);
  const [filteredOrdersByConsumer, setFilteredOrdersByConsumer] = useState(
    null
  );
  const [filterText, setFilterText] = useState('');

  const resolveUserOrderItemSubtitle = (order) => {
    const hasBaseProducts =
      order.baseProducts != null && order.baseProducts > 0;
    const hasExtraProducts =
      order.extraProducts != null && order.extraProducts.length > 0;

    if (hasBaseProducts && !hasExtraProducts) {
      return `Total: R$ ${order.totalAmount} (Cesta)`;
    }

    if (!hasBaseProducts && hasExtraProducts) {
      return `Total: R$ ${order.totalAmount} (Extras)`;
    }

    return `Total: R$ ${order.totalAmount} (Cesta + Extras)`;
  };

  const matchUsersWithOrders = () => {
    const userOrderItems = [];
    let userOrderItem;
    users.forEach((user) => {
      const userOrdersResult = orders.filter((order) => {
        return order.userId === user.id;
      });
      const userOrder =
        userOrdersResult.length > 0 ? userOrdersResult[0] : null;
      if (userOrder && userOrder.totalAmount > 0) {
        userOrderItem = {
          userId: user.id,
          userName: user.name,
          orderId: userOrder.id,
          subtitle: resolveUserOrderItemSubtitle(userOrder),
        };
      } else {
        userOrderItem = {
          userId: user.id,
          userName: user.name,
          subtitle: 'Pedido não realizado para esta entrega',
        };
      }

      userOrderItems.push(userOrderItem);
    });

    userOrderItems.sort((a, b) => {
      if (a.orderId != null && b.orderId == null) {
        return -1;
      }
      if (a.orderId == null && b.orderId != null) {
        return 1;
      }
      return a.userName.toLowerCase() < b.userName.toLowerCase() ? -1 : 1;
    });
    setUsersOrders(userOrderItems);
  };

  // ENTENDER PQ NAO ATUALIZA LOGO QUE MUDA A PARADA
  useEffect(() => {
    matchUsersWithOrders();
  }, [users, orders]);

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
      usersOrders.filter((order) =>
        order.userName.toLowerCase().includes(filterText.toLowerCase())
      )
    );
  };

  const renderItem = ({ item: userOrderItem }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ConsumerOrderScreen', {
            user: { id: userOrderItem.userId, name: userOrderItem.userName },
            delivery,
          })
        }
      >
        <ListItem
          containerStyle={styles.listItemContainer}
          title={`${userOrderItem.userName}`}
          titleStyle={styles.listItemTitle}
          subtitle={`${userOrderItem.subtitle}`}
          // subtitle={<Text>{userOrderItem.subtitle}</Text>}
          bottomDivider
          chevron
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <NavigationEvents
        onWillFocus={() => {
          fetchOrdersByDelivery(delivery.id);
          fetchUsers();
        }}
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
      {!orderLoading && !userLoading ? (
        <FlatList
          data={
            filteredOrdersByConsumer && filteredOrdersByConsumer.length
              ? filteredOrdersByConsumer
              : usersOrders
          }
          renderItem={renderItem}
          keyExtractor={(item) => item.userId}
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

import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { format } from 'date-fns';
import { Input, ListItem } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import GLOBALS from '../Globals';
import { Context as OrderContext } from '../context/OrderContext';
import { Context as UserContext } from '../context/UserContext';
import Spinner from '../components/Spinner';
import HeaderTitle from '../components/HeaderTitle';
import BackArrow from '../components/BackArrow';
import Colors from '../constants/Colors';
import { Context as DeliveryContext } from '../context/DeliveryContext';

const OrdersByConsumerScreen = (props) => {
  const {
    state: { loading: orderLoading, orders },
    fetchOrdersByDelivery,
  } = useContext(OrderContext);

  const {
    state: { loading: userLoading, users },
    fetchUsers,
  } = useContext(UserContext);

  const {
    state: { delivery: stateDelivery, loading: deliveryLoading },
    fetchDelivery,
  } = useContext(DeliveryContext);

  const delivery = props.route.params ? props.route.params.delivery : null;

  const [usersOrders, setUsersOrders] = useState([]);
  const [filteredOrdersByConsumer, setFilteredOrdersByConsumer] = useState([]);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    matchUsersWithOrders();
  }, [users, orders]);

  useFocusEffect(
    React.useCallback(() => {
      if (delivery) {
        fetchDelivery(delivery.id).then((deliveryFound) => {
          fetchOrdersByDelivery(deliveryFound.id);
          fetchUsers();
          props.navigation.setParams({
            deliveryDate: format(delivery.deliveryDate, GLOBALS.FORMAT.DD_MM),
          });
        });
      } else {
        console.log('delivery ainda não existe');
      }
    }, [])
  );

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
    users?.forEach((user) => {
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
          orderStatus: userOrder.status,
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
            setFilteredOrdersByConsumer([]);
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
          props.navigation.navigate('ConsumerOrderScreen', {
            user: { id: userOrderItem.userId, name: userOrderItem.userName },
            delivery: stateDelivery,
          })
        }
      >
        <View style={styles.itemContainer}>
          <ListItem
            containerStyle={styles.listItemContainer}
            title={`${userOrderItem.userName}`}
            titleStyle={styles.listItemTitle}
            subtitle={`${userOrderItem.subtitle}`}
            rightSubtitle={
              userOrderItem.orderStatus &&
              userOrderItem.orderStatus === GLOBALS.ORDER.STATUS.COMPLETED
                ? `Entrega concluída`
                : null
            }
            bottomDivider
            chevron
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
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
        {!orderLoading && !userLoading && !deliveryLoading ? (
          <FlatList
            data={
              filteredOrdersByConsumer != null &&
              filteredOrdersByConsumer.length > 0
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
    </View>
  );
};

export const ordersManagementScreenOptions = (props) => {
  const deliveryDate = format(
    props.route.params.delivery.deliveryDate,
    GLOBALS.FORMAT.DEFAULT_DATE
  );
  return {
    headerTitle: () => (
      <View style={styles.header}>
        <HeaderTitle title={`Pedidos - ${deliveryDate}`} />
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
    backgroundColor: Colors.backGroundColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 25,
  },
  container: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 5,
  },
  text: {
    color: '#101010',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchInput: {
    width: 300,
  },
  itemContainer: {
    marginBottom: 5,
    // flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
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
  header: {
    alignItems: 'flex-start',
  },
});

export default OrdersByConsumerScreen;

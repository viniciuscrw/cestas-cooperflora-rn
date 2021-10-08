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
import Spinner from '../components/Spinner';
import HeaderTitle from '../components/HeaderTitle';
import BackArrow from '../components/BackArrow';

const OrdersByConsumerScreen = (props) => {
  const {
    state: { loading: orderLoading, orders },
    fetchOrdersByDelivery,
  } = useContext(OrderContext);
  let delivery = {id: 1}; // ATENÇAO alterar
  if (props.route.params) {
    delivery = props.route.params.delivery;
  }
  const [filteredOrdersByConsumer, setFilteredOrdersByConsumer] = useState(
    null
  );
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    fetchOrdersByDelivery(delivery.id);
  }, [])

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

    if (hasBaseProducts && !hasExtraProducts) {
      return <Text>Total: R$ {order.totalAmount} (Cesta)</Text>;
    }

    if (!hasBaseProducts && hasExtraProducts) {
      return <Text>Total: R$ {order.totalAmount} (Extras)</Text>;
    }

    return <Text>Total: R$ {order.totalAmount} (Cesta + Extras)</Text>;
  };

  const renderItem = ({ item: order }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ConsumerOrderScreen', {
            user: { id: order.userId, name: order.userName },
            delivery,
          })
        }
      >
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
      {/* <NavigationEvents
        onWillFocus={() => fetchOrdersByDelivery(delivery.id)}
      /> */}
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

export const ordersManagementNavigationOptions = ({route}) => {
  // console.log(route.params.delivery.deliveryDate);
  // let deliveryDate = '2021-10-08T02:59:59.999Z'.toDate();
  // if(route.params.delivery){
  //   deliveryDate = route.params.delivery.deliveryDate;
  // }

  // return {
  //   headerTitle: `Pedidos - ${format(
  //     deliveryDate,
  //     GLOBALS.FORMAT.DEFAULT_DATE
  //   )}`,
  // };

  return {
    headerTitle: () => (
        <HeaderTitle title="Pedidos" />
    ),
    headerBackImage: () => (<BackArrow />),
    headerStyle: {
        backgroundColor: 'transparent',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
    }
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

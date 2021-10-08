import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Input, ListItem } from 'react-native-elements';
import { Context as OrderContext } from '../context/OrderContext';
import Spinner from '../components/Spinner';

const OrdersItemsQuantity = (props) => {
  const {
    state: { loading: orderLoading, orders },
    fetchOrdersByDelivery,
  } = useContext(OrderContext);
  let deliveryId;
  if (props.route.params) {
    deliveryId = props.route.params.delivery.id;
  }


  // console.log(`nav: ${JSON.stringify(navigation)}`);
  const [productsToQuantity, setProductsToQuantity] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [filterText, setFilterText] = useState('');

  const mapProductsToQuantity = () => {
    const productsToQuantityMap = new Map();
    orders.forEach((order) => {
      if (order.baseProducts && order.baseProducts > 0) {
        productsToQuantityMap.Cesta =
          productsToQuantityMap.Cesta + order.baseProducts ||
          order.baseProducts;
      }

      order.extraProducts.forEach((product) => {
        if (product.productTitle && product.quantity && product.quantity > 0) {
          productsToQuantityMap[`${product.productTitle}`] =
            productsToQuantityMap[`${product.productTitle}`] +
            product.quantity || product.quantity;
        }
      });
    });

    const productsArray = [];
    for (const [key, value] of Object.entries(productsToQuantityMap)) {
      productsArray.push({ name: key, quantity: value });
    }

    setProductsToQuantity(productsArray);
  };

  useEffect(() => {
    fetchOrdersByDelivery(deliveryId);
    mapProductsToQuantity();
  }, [orders]);

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
          setFilteredProducts(null);
        },
      };
  };

  const searchProductsByFilter = () => {
    console.log('filtrando?');
    setFilteredProducts(
      productsToQuantity.filter((product) =>
        product.name.toLowerCase().includes(filterText.toLowerCase())
      )
    );
  };

  const renderItem = ({ item }) => {
    return (
      <ListItem
        containerStyle={styles.listItemContainer}
        title={`${item.name} (${item.quantity})`}
        titleStyle={styles.listItemTitle}
        bottomDivider
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* <NavigationEvents onWillFocus={() => fetchOrdersByDelivery(deliveryId)} /> */}
      <Input
        containerStyle={styles.searchInput}
        placeholder="Buscar produto"
        value={filterText}
        onChangeText={setFilterText}
        onEndEditing={searchProductsByFilter}
        returnKeyType="done"
        autoCorrect={false}
        rightIcon={renderSearchIcon()}
      />
      {!orderLoading ? (
        <FlatList
          data={
            filteredProducts && filteredProducts.length
              ? filteredProducts
              : productsToQuantity
          }
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          style={styles.productsList}
        />
      ) : (
        <Spinner />
      )}
    </View>
  );
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
    width: 250,
  },
  productsList: {
    marginTop: -10,
  },
  listItemContainer: {
    backgroundColor: 'transparent',
    padding: 10,
    minHeight: 40,
  },
  listItemTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 20,
  },
});

export default OrdersItemsQuantity;

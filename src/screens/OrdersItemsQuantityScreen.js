import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Input, ListItem } from '@rneui/themed';
import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Context as OrderContext } from '../context/OrderContext';
import Spinner from '../components/Spinner';
import Colors from '../constants/Colors';
import { TextContent, TextLabel } from '../components/StandardStyles';
import Globals from '../Globals';

const OrdersItemsQuantity = (props) => {
  const {
    state: { orders, loading },
  } = useContext(OrderContext);

  const [productsToQuantity, setProductsToQuantity] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const mapProductsToQuantity = () => {
    // const productsToQuantityMap = new Map();
    const productsToQuantityAux = [];
    // console.log(
    //   `[Orders Items Quantity Screen] products ${JSON.stringify(
    //     productsToQuantityAux,
    //     null,
    //     2
    //   )}`
    // );
    orders.forEach((order) => {
      // console.log(`Order: ${JSON.stringify(order, null, 2)}`);
      if (order.baseProducts && order.baseProducts > 0) {
        let productIndex = productsToQuantityAux.findIndex(
          (obj) => obj.name === 'Cesta'
        );
        if (productIndex > -1) {
          console.log('BaseProduct Found');
          // eslint-disable-next-line operator-assignment
          productsToQuantityAux[productIndex].quantityOrdered =
            productsToQuantityAux[productIndex].quantityOrdered +
            order.baseProducts;
        } else {
          const productAux = {
            name: 'Cesta',
            quantityOrdered: order.baseProducts,
            quantityDelivered: 0,
          };
          productsToQuantityAux.push(productAux);
          productIndex = productsToQuantityAux.length - 1;
        }
        if (order.status === Globals.ORDER.STATUS.COMPLETED) {
          productsToQuantityAux[productIndex].quantityDelivered =
            productsToQuantityAux[productIndex].quantityDelivered +
              order.baseProducts || order.baseProducts;
        }
      }

      order.extraProducts.forEach((product) => {
        if (product.productTitle && product.quantity && product.quantity > 0) {
          let productIndex = productsToQuantityAux.findIndex(
            (obj) => obj.name === product.productTitle
          );
          if (productIndex > -1) {
            // eslint-disable-next-line operator-assignment
            productsToQuantityAux[productIndex].quantityOrdered =
              productsToQuantityAux[productIndex].quantityOrdered +
              product.quantity;
          } else {
            const productAux = {
              name: product.productTitle,
              quantityOrdered: product.quantity,
              quantityDelivered: 0,
            };
            productsToQuantityAux.push(productAux);
            productIndex = productsToQuantityAux.length - 1;
          }
          if (order.status === Globals.ORDER.STATUS.COMPLETED) {
            // eslint-disable-next-line operator-assignment
            productsToQuantityAux[productIndex].quantityDelivered =
              productsToQuantityAux[productIndex].quantityDelivered +
              product.quantity;
          }
        }
      });
    });

    // console.log(
    //   `[Orders Items Quantity Screen] products ${JSON.stringify(
    //     productsToQuantityAux,
    //     null,
    //     2
    //   )}`
    // );

    // const productsArray = [];
    // for (const [key, value] of Object.entries(productsToQuantityMap)) {
    //   productsArray.push({ name: key, quantityOrdered: value });
    // }

    productsToQuantityAux.sort((a, b) =>
      // eslint-disable-next-line no-nested-ternary
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );

    setProductsToQuantity(productsToQuantityAux);
  };

  useEffect(() => {
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
    setFilteredProducts(
      productsToQuantity.filter((product) =>
        product.name.toLowerCase().includes(filterText.toLowerCase())
      )
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View>
        <View style={styles.listItem}>
          <TextContent
            style={{ fontSize: 18 }}
          >{`${item.quantityOrdered} ${item.name}`}</TextContent>
          <TextContent
            style={{ fontSize: 18 }}
          >{`${item.quantityDelivered}`}</TextContent>
        </View>
      </View>
    );
  };

  const copyToClipboard = () => {
    if (productsToQuantity != null && productsToQuantity.length > 0) {
      let quantitiesText = '';
      productsToQuantity.forEach((product, index) => {
        quantitiesText += `${product.quantityOrdered} ${product.name}`;
        if (index !== productsToQuantity.length - 1) {
          quantitiesText += '\n';
        }
      });
      Clipboard.setString(quantitiesText);
      showModal();
    }
  };

  const showModal = () => {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
    }, 2000);
  };

  const renderModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Copiado!</Text>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.controlsContainer}>
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
          <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
            <Feather name="copy" size={30} color="darkgrey" />
          </TouchableOpacity>
        </View>
        {!loading ? (
          <View>
            <View style={styles.title}>
              <TextLabel style={styles.listItemTitle}>Pedidos</TextLabel>
              <TextLabel style={styles.listItemTitle}>Entregues</TextLabel>
            </View>
            <FlatList
              style={styles.listItemContainer}
              data={
                filteredProducts && filteredProducts.length
                  ? filteredProducts
                  : productsToQuantity
              }
              renderItem={renderItem}
              keyExtractor={(item) => item.name}
            />
          </View>
        ) : (
          <Spinner />
        )}
      </View>
      {renderModal()}
    </View>
  );
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
  productsList: {
    marginTop: -10,
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 5,
  },
  listItemContainer: {
    marginBottom: 115,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 5,
  },
  listItemTitle: {
    marginBottom: 8,
    fontSize: 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  copyButton: {
    marginTop: 12,
    marginRight: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 30,
    backgroundColor: Colors.backGroundColor,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
  },
});

export default OrdersItemsQuantity;

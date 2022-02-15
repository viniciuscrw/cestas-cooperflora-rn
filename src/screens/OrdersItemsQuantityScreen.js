import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Input, ListItem } from 'react-native-elements';
import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Context as OrderContext } from '../context/OrderContext';
import Spinner from '../components/Spinner';
import Colors from '../constants/Colors';

const OrdersItemsQuantity = (props) => {
  const {
    state: { orders, loading },
  } = useContext(OrderContext);

  // console.log(`nav: ${JSON.stringify(navigation)}`);
  const [productsToQuantity, setProductsToQuantity] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

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
      <ListItem
        containerStyle={styles.listItemContainer}
        title={`${item.quantity} ${item.name}`}
        titleStyle={styles.listItemTitle}
        bottomDivider
      />
    );
  };

  const copyToClipboard = () => {
    if (productsToQuantity != null && productsToQuantity.length > 0) {
      let quantitiesText = '';
      productsToQuantity.forEach((product, index) => {
        quantitiesText += `${product.quantity} ${product.name}`;
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

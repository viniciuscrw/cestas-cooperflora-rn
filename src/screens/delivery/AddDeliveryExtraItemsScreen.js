import React, { useContext, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { AntDesign } from '@expo/vector-icons';
import endOfDay from 'date-fns/endOfDay';
import { Input } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { Context as UserContext } from '../../context/UserContext';
import { Context as ProductContext } from '../../context/ProductContext';
import { Context as DeliveryContext } from '../../context/DeliveryContext';
import Spinner from '../../components/Spinner';
import {
  formatCurrency,
  isBlank,
  showAlert,
} from '../../helper/HelperFunctions';
import useConsumerGroup from '../../hooks/useConsumerGroup';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';
import { sendPushNotification } from '../../utils';

const AddDeliveryExtraItemsScreen = ({ navigation }) => {
  console.log('[Add delivery Extra Item Screen started...]');
  const {
    state: { loading, products },
    fetchProducts,
  } = useContext(ProductContext);
  const { state, createDelivery, updateDelivery, deleteDelivery } =
    useContext(DeliveryContext);
  const { fetchConsumers } = useContext(UserContext);

  const [checkedItems, setCheckedItems] = useState(
    state.nextDelivery && state.nextDelivery.extraProducts
      ? state.nextDelivery.extraProducts.map((product) => product.id)
      : []
  );
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const groupInfo = useConsumerGroup();

  useFocusEffect(
    React.useCallback(() => {
      fetchProducts();

      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
          setKeyboardVisible(true);
        }
      );
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          setKeyboardVisible(false);
        }
      );

      return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
      };
    }, [])
  );

  const searchProductsByFilter = () => {
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(filterText.toLowerCase())
      )
    );
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
            setFilteredProducts(products);
          },
        };
  };

  const handleItemCheck = (item) => {
    if (!checkedItems.includes(item.id)) {
      setCheckedItems([...checkedItems, item.id]);
    } else {
      setCheckedItems(checkedItems.filter((id) => id !== item.id));
    }
  };

  const validateAndCreateOrUpdateDelivery = () => {
    if (!state.deliveryDate) {
      showAlert('A data da entrega deve ser informada.');
      return;
    }

    if (isBlank(state.baseProducts)) {
      showAlert('A composição da cesta deve ser informada.');
      return;
    }

    const extraProducts = products.filter((product) =>
      checkedItems.includes(product.id)
    );

    extraProducts.forEach((product) => {
      if (state.nextDelivery) {
        const deliveryProducts = state.nextDelivery.extraProducts;
        const deliveryProductIndex = deliveryProducts.findIndex(
          (deliveryProduct) => deliveryProduct.id === product.id
        );

        product.orderedQuantity =
          deliveryProductIndex >= 0
            ? deliveryProducts[deliveryProductIndex].orderedQuantity
            : 0;
      } else {
        product.orderedQuantity = 0;
      }
    });

    const delivery = {
      date: endOfDay(state.deliveryDate),
      ordersLimitDate: state.ordersLimitDate,
      baseProducts: state.baseProducts,
      extraProducts,
      baseProductsPrice: groupInfo.baseProductsPrice,
      deliveryFee: groupInfo.deliveryFee,
    };

    // console.log(
    //   '[Add Delivery Item Screen] delivery',
    //   JSON.stringify(delivery, null, 2)
    // );

    if (state.nextDelivery) {
      updateDelivery({ deliveryId: state.nextDelivery.id, delivery });
      navigation.navigate('DeliveriesScreen');
    } else {
      createDelivery({ delivery });
      fetchConsumers()
        .then((consumers) => {
          sendPushNotification(consumers);
        })
        .catch((error) => {
          console.log(error);
        });
      navigation.navigate('DeliveriesScreen');
    }
  };

  const deleteCurrentDelivery = () => {
    Alert.alert(
      'Excluir entrega',
      'Você tem certeza que deseja excluir esta próxima entrega?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => {
            deleteDelivery({ deliveryId: state.nextDelivery.id }).then(() => {
              navigation.navigate('DeliveriesScreen');
            });
          },
        },
      ]
    );
  };

  const renderQuantityInfoText = (item) => {
    if (item.availableQuantity && item.maxOrderQuantity) {
      return (
        <Text>
          {item.availableQuantity.toLocaleString()} disponíveis - Máx.{' '}
          {item.maxOrderQuantity.toLocaleString()} por pedido
        </Text>
      );
    }

    if (item.availableQuantity && !item.maxOrderQuantity) {
      return <Text>{item.availableQuantity.toLocaleString()} disponíveis</Text>;
    }

    if (!item.availableQuantity && item.maxOrderQuantity) {
      return (
        <Text>Máx. {item.maxOrderQuantity.toLocaleString()} por pedido</Text>
      );
    }

    return null;
  };

  const renderItem = ({ item }) => {
    const priceDisplay = formatCurrency(item.price);

    return (
      <View style={styles.productContainer}>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate('CreateExtraItemScreen', {
              product: item,
              selectedProducts: checkedItems,
            })
          }
        >
          <View style={styles.itemContainer}>
            <View style={{ width: '85%' }}>
              <Text
                style={{
                  fontFamily: 'Roboto',
                  fontWeight: '700',
                  marginBottom: 5,
                  fontSize: 16,
                }}
              >
                {item.name} - R$ {priceDisplay}
              </Text>
              {renderQuantityInfoText(item)}
            </View>
            <Checkbox
              style={styles.checkbox}
              value={checkedItems.includes(item.id)}
              onValueChange={() => handleItemCheck(item)}
              color={
                checkedItems.includes(item.id)
                  ? Colors.secondary
                  : Colors.tertiary
              }
            />
          </View>
          {/* <ListItem
            containerStyle={styles.listItemContainer}
            title={
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CreateExtraItemScreen', {
                    product: item,
                    selectedProducts: checkedItems,
                  })
                }
              >
                <Text
                  style={{
                    fontFamily: 'Roboto',
                    fontWeight: '700',
                    marginBottom: 5,
                    fontSize: 16,
                  }}
                >
                  {item.name} - R$ {priceDisplay}
                </Text>
                {renderQuantityInfoText(item)}
              </TouchableOpacity>
            }
            checkBox={{
              checkedIcon: 'check-square-o',
              uncheckedIcon: 'square-o',
              checkedColor: Colors.secondary,
              onPress: () => handleItemCheck(item),
              checked: checkedItems.includes(item.id),
              containerStyle: {
                marginRight: 7,
              },
            }}
          /> */}
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const renderConfirmButton = () => {
    return (filterText.length &&
      filteredProducts &&
      !filteredProducts.length) ||
      isKeyboardVisible ? null : (
      <View style={styles.buttonContainer}>
        <Button
          id="createOrUpdateDeliveryButton"
          style={styles.button}
          textColor="white"
          onPress={validateAndCreateOrUpdateDelivery}
        >
          {state.nextDelivery ? 'Atualizar entrega' : 'Criar entrega'}
        </Button>
      </View>
    );
  };

  const renderDeleteButton = () => {
    if (
      (filterText.length && filteredProducts && !filteredProducts.length) ||
      isKeyboardVisible ||
      !state.nextDelivery
    ) {
      return null;
    }

    return (
      <View style={styles.buttonContainer}>
        <Button
          id="deleteDeliveryButton"
          style={styles.button}
          textColor="white"
          onPress={deleteCurrentDelivery}
        >
          Excluir entrega
        </Button>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        {!loading ? (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <Input
                containerStyle={styles.searchInput}
                placeholder="Nome do produto"
                value={filterText}
                onChangeText={setFilterText}
                onEndEditing={searchProductsByFilter}
                returnKeyType="done"
                autoCorrect={false}
                rightIcon={renderSearchIcon()}
              />
              <TouchableOpacity
                style={styles.newProductButton}
                onPress={() =>
                  navigation.navigate('CreateExtraItemScreen', { products })
                }
              >
                <AntDesign
                  name="pluscircle"
                  size={24}
                  color={Colors.tertiary}
                />
              </TouchableOpacity>
              {filterText.length &&
              filteredProducts &&
              !filteredProducts.length ? (
                <Text style={styles.productNotFoundText}>
                  Nenhum produto encontrado por este nome.
                </Text>
              ) : (
                <View style={{ flex: 1.2 }}>
                  <FlatList
                    data={
                      filteredProducts && filteredProducts.length
                        ? filteredProducts
                        : products
                    }
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                  />
                </View>
              )}
              {renderConfirmButton()}
              {renderDeleteButton()}
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <Spinner />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop: 4,
    // paddingLeft: 25,
    // paddingRight: 25,
    // borderRadius: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#F0F5F9',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 25,
  },
  container: {
    flex: 1,
    margin: 10,
  },
  productContainer: {
    marginTop: 3,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  itemInformation: {
    // flex: 1,
    // flexDirection: 'column',
    // // width: '20%',
    // backgroundColor: 'green',
    // // color: 'green',
    // // height: 100,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 10,
    minHeight: 50,
  },
  checkbox: {
    borderRadius: 5,
  },
  searchInput: {
    width: 250,
  },
  newProductButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: 15,
    right: 15,
  },
  productNotFoundText: {
    margin: 10,
    fontSize: 16,
  },

  buttonContainer: {
    // position: 'absolute',
    width: '100%',
    // bottom: 0,
  },
  button: {
    marginTop: 5,
    backgroundColor: Colors.secondary,
    alignSelf: 'center',
    width: '100%',
  },
});

export default AddDeliveryExtraItemsScreen;

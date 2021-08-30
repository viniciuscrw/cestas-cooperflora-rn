import React, { useContext, useEffect, useState } from 'react';
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
import endOfDay from 'date-fns/endOfDay';
import { Input, ListItem } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import { Context as ProductContext } from '../../context/ProductContext';
import { Context as DeliveryContext } from '../../context/DeliveryContext';
import Spinner from '../../components/Spinner';
import TextLink from '../../components/TextLink';
import { formatCurrency, showAlert } from '../../helper/HelperFunctions';
import LoadingButton from '../../components/LoadingButton';

const AddDeliveryExtraItemsScreen = ({ navigation }) => {
  const {
    state: { loading, products },
    fetchProducts,
  } = useContext(ProductContext);
  const { state, createDelivery, updateDelivery, deleteDelivery } = useContext(
    DeliveryContext
  );

  const [checkedItems, setCheckedItems] = useState(
    state.nextDelivery && state.nextDelivery.extraProducts
      ? state.nextDelivery.extraProducts.map((product) => product.id)
      : []
  );
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
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
  }, []);

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
    } else {
      const extraProducts = products.filter((product) =>
        checkedItems.includes(product.id)
      );
      const delivery = {
        date: endOfDay(state.deliveryDate),
        ordersLimitDate: state.ordersLimitDate,
        baseProducts: state.baseProducts,
        extraProducts,
      };

      if (state.nextDelivery) {
        updateDelivery({ deliveryId: state.nextDelivery.id, delivery });
      } else {
        createDelivery({ delivery });
      }
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
            deleteDelivery({ deliveryId: state.nextDelivery.id });
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
  };

  const renderItem = ({ item }) => {
    const priceDisplay = formatCurrency(item.price);

    return (
      <TouchableWithoutFeedback>
        <ListItem
          containerStyle={styles.listItemContainer}
          title={
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('CreateExtraItem', {
                  product: item,
                  selectedProducts: checkedItems,
                })
              }
            >
              <Text
                style={{ fontWeight: 'bold', marginBottom: 5, fontSize: 16 }}
              >
                {item.name} - R$ {priceDisplay}
              </Text>
              {renderQuantityInfoText(item)}
            </TouchableOpacity>
          }
          checkBox={{
            checkedIcon: 'check-square-o',
            uncheckedIcon: 'square-o',
            checkedColor: 'grey',
            onPress: () => handleItemCheck(item),
            checked: checkedItems.includes(item.id),
            containerStyle: {
              marginRight: 7,
            },
          }}
          bottomDivider
        />
      </TouchableWithoutFeedback>
    );
  };

  const renderConfirmButton = () => {
    return (filterText.length &&
      filteredProducts &&
      !filteredProducts.length) ||
      isKeyboardVisible ? null : (
      <View style={styles.mainButtonContainer}>
        <LoadingButton
          loading={state.loading}
          onPress={validateAndCreateOrUpdateDelivery}
        >
          {state.nextDelivery ? 'Atualizar entrega' : 'Criar entrega'}
        </LoadingButton>
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
      <View style={styles.mainButtonContainer}>
        <LoadingButton
          loading={state.loading}
          color="darkorange"
          onPress={deleteCurrentDelivery}
        >
          Excluir entrega
        </LoadingButton>
      </View>
    );
  };

  return !loading ? (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <NavigationEvents onWillFocus={fetchProducts} />
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
        <TextLink
          text="Novo item"
          onPress={() => navigation.navigate('CreateExtraItem', { products })}
          style={styles.newProductButton}
        />
        {filterText.length && filteredProducts && !filteredProducts.length ? (
          <Text style={styles.productNotFoundText}>
            Nenhum produto encontrado por este nome.
          </Text>
        ) : (
          <View style={{ flex: 0.88 }}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  listItemContainer: {
    backgroundColor: 'transparent',
    padding: 10,
    minHeight: 60,
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
  mainButtonContainer: {
    flex: 0.15,
    justifyContent: 'center',
  },
});

export default AddDeliveryExtraItemsScreen;

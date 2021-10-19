import React, { useContext, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FormInput from '../../components/FormInput';
import Spacer from '../../components/Spacer';
import TextLink from '../../components/TextLink';
import LoadingButton from '../../components/LoadingButton';
import { Context as ProductContext } from '../../context/ProductContext';
import {
  formatCurrency,
  isNotEmpty,
  showAlert,
} from '../../helper/HelperFunctions';

const CreateExtraItemScreen = (props) => {
  const products = props.route.params.products;
  const product = props.route.params.product;
  const selectedProducts = props.route.params.selectedProducts;

  // const products = navigation.getParam('products');
  // const product = navigation.getParam('product');
  // const selectedProducts = navigation.getParam('selectedProducts');

  const { state, createProduct, updateProduct, deleteProduct } = useContext(
    ProductContext
  );
  const [name, setName] = useState(product ? product.name : '');
  const [itemPrice, setPrice] = useState(
    product ? formatCurrency(product.price) : ''
  );
  const [itemAvailableQuantity, setAvailableQuantity] = useState(
    product && product.availableQuantity
      ? product.availableQuantity.toString()
      : ''
  );
  const [itemMaxOrderQuantity, setMaxOrderQuantity] = useState(
    product && product.maxOrderQuantity
      ? product.maxOrderQuantity.toString()
      : ''
  );

  const resolveIntValueOf = (text) => {
    const intValue = parseInt(text);
    return isNaN(intValue) ? null : intValue;
  };

  const resolvePriceValueIfValid = () => {
    const numericPrice = parseFloat(itemPrice.replace(',', '.'));
    if (isNaN(numericPrice)) {
      showAlert('Valor inválido para o preço.');
      return null;
    }
    return numericPrice;
  };

  const productExists = () => {
    if (
      products &&
      products.filter(
        (product) => product.name.toLowerCase() === name.toLowerCase()
      ).length
    ) {
      showAlert('Já existe um produto cadastrado com o mesmo nome.');
      return true;
    }
    return false;
  };

  const createItem = () => {
    const availableQuantity = resolveIntValueOf(itemAvailableQuantity);
    const maxOrderQuantity = resolveIntValueOf(itemMaxOrderQuantity);
    const price = resolvePriceValueIfValid();

    if (price == null || productExists()) {
      return;
    }

    const product = {
      name,
      price,
      availableQuantity,
      maxOrderQuantity,
    };

    createProduct({ product }).then(() => props.navigation.goBack(null));
  };

  const productDidNotChange = (updatedProduct) => {
    return (
      product.name === updatedProduct.name &&
      product.price === updatedProduct.price &&
      product.availableQuantity === updatedProduct.availableQuantity &&
      product.maxOrderQuantity === updatedProduct.maxOrderQuantity
    );
  };

  const updateItem = () => {
    const availableQuantity = resolveIntValueOf(itemAvailableQuantity);
    const maxOrderQuantity = resolveIntValueOf(itemMaxOrderQuantity);
    const price = resolvePriceValueIfValid();

    if (price == null || productExists()) {
      return;
    }

    const updatedProduct = {
      name,
      price,
      availableQuantity,
      maxOrderQuantity,
    };

    if (productDidNotChange(updatedProduct)) {
      props.navigation.goBack(null);
    } else {
      updateProduct({ productId: product.id, updatedProduct }).then(() =>
        props.navigation.goBack(null)
      );
    }
  };

  const removeItem = () => {
    if (selectedProducts && selectedProducts.includes(product.id)) {
      Alert.alert(
        'Excluir item',
        'Este item está incluído na entrega atual. Deseja excluí-lo mesmo assim?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Confirmar',
            onPress: () => {
              deleteProduct({ productId: product.id }).then(() =>
                props.navigation.goBack(null)
              );
            },
          },
        ]
      );
    } else {
      deleteProduct({ productId: product.id }).then(() =>
        props.navigation.goBack(null)
      );
    }
  };

  const renderConfirmButton = () => {
    if (isNotEmpty(name) && isNotEmpty(itemPrice)) {
      return product ? (
        <LoadingButton
          style={styles.createItemButton}
          loading={state.loading}
          onPress={updateItem}
        >
          Atualizar item
        </LoadingButton>
      ) : (
        <LoadingButton
          style={styles.createItemButton}
          loading={state.loading}
          onPress={createItem}
        >
          Criar item
        </LoadingButton>
      );
    }

    return null;
  };

  const renderRemoveButton = () => {
    return product && !state.loading ? (
      <LoadingButton
        style={styles.removeItemButton}
        color="darkorange"
        onPress={removeItem}
      >
        Excluir item
      </LoadingButton>
    ) : null;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -50 : 100}
        behavior={Platform.OS === 'ios' ? 'position' : 'height'}
      >
        <View style={{ flex: 1 }}>
          <ScrollView>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {product ? 'Editar' : 'Novo'} item extra
              </Text>
              <TextLink
                text="Cancelar"
                onPress={() => props.navigation.goBack(null)}
                style={styles.cancelButton}
              />
            </View>
            <Spacer />
            <FormInput
              label="Nome"
              value={name}
              onChangeText={setName}
              maxLength={150}
              returnKeyType="done"
              autoCapitalize="sentences"
            />
            <FormInput
              label="Preço"
              value={itemPrice}
              onChangeText={setPrice}
              returnKeyType="done"
              keyboardType="numeric"
              maxLength={7}
            />
            <FormInput
              label="Quantidade disponível"
              value={itemAvailableQuantity}
              onChangeText={setAvailableQuantity}
              returnKeyType="done"
              keyboardType="number-pad"
              maxLength={7}
            />
            <FormInput
              label="Quantidade máxima por pedido"
              value={itemMaxOrderQuantity}
              onChangeText={setMaxOrderQuantity}
              returnKeyType="done"
              keyboardType="number-pad"
              maxLength={7}
            />
            {renderConfirmButton()}
            {renderRemoveButton()}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 7,
    marginHorizontal: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 10,
  },
  title: {
    color: '#101010',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 3,
    marginLeft: 5,
  },
  cancelButton: {
    marginRight: 15,
  },
  numericInput: {
    width: 120,
  },
  createItemButton: {
    marginTop: 10,
  },
  removeItemButton: {
    marginTop: 20,
  },
});

export default CreateExtraItemScreen;
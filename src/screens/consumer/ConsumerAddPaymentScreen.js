import React, { useEffect, useState, useContext } from 'react';
import { format } from 'date-fns';
import { StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import firebase from 'firebase';
import HeaderTitle from '../../components/HeaderTitle';
import BackArrow from '../../components/BackArrow';
import Divider from '../../components/Divider';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';
import useUser from '../../hooks/useUser';
import { Context as userContext } from '../../context/UserContext';
import {
  insertIntoSubcollection,
  updateDocAttribute,
} from '../../api/firebase';
import GLOBALS from '../../Globals';
import ImagePicker from '../../components/ImagePicker';
import screen from '../screenstyles/ScreenStyles';
import { TextLabel, Number } from '../../components/StandardStyles';

const ConsumerAddPaymentScreen = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [amountToPay, setAmountToPay] = useState(0.0);
  const [userData, setUserData] = useState();
  const [receiptImage, setReceiptImage] = useState(null);

  // console.log('[ConsumerAddPaymentScreen] amount to pay',amountToPay);

  const user = useUser();
  // console.log('[Consumer Payments Screen] user', user);
  // console.log('[ConsumerAddPaymentScreen] started');
  // const orderTotalAmount = props.navigation.state.params.orderTotalAmount;
  const { orderId, orderTotalAmount } = route.params;

  const { getUserById } = useContext(userContext);

  useEffect(() => {
    console.log('[ConsumerAddPaymentScreen] amount to pay', amountToPay);
    setIsLoading(true);
    if (user) {
      getUserById(user.id).then((data) => {
        setUserData(data);
        setIsLoading(false);
        setAmountToPay(orderTotalAmount);
      });
    }
  }, [user]);

  const imageSelectedHandler = (uri) => {
    console.log('[ConsumerAddPayment Screen] imageSelectedHandler');
    setReceiptImage(uri);
  };

  const updateUserBalance = () => {
    const newBalance = amountToPay - orderTotalAmount + userData.balance;
    console.log('[ConsumerAddPayment Screen] New balance', newBalance);
    updateDocAttribute('users', user.id, 'balance', newBalance);
    // return;
  };

  const handlePayment = async () => {
    console.log('[Consumer Payment Screen] Handle payment');
    // console.log('[Consumer Payment Screen] payment', amountToPay);
    // console.log('[Consumer Payment Screen] receipt', receiptImage);
    if (amountToPay <= 0) {
      Alert.alert('Por favor inclua um valor para o pagamento!');
      return;
    }
    if (!receiptImage) {
      Alert.alert('Por favor inclua o comprovante!');
      return;
    }
    const date = new Date();
    let imageName = format(date, 'yyyyMMddHHMMSS');
    let response = await fetch(receiptImage);
    const blob = await response.blob();
    let ref = firebase
      .storage()
      .ref()
      .child(user.id + '/' + imageName);
    setIsLoading(true);
    ref
      .put(blob)
      .then((response) => {
        console.log('Resposta do storage', response);
        ref
          .getDownloadURL()
          .then(function (url) {
            const newPayment = {
              userId: user.id,
              paymentValue: amountToPay,
              date: date.toISOString(),
              receiptImage: url,
            };
            const idPayment = user.id + 'pay';
            insertIntoSubcollection(
              GLOBALS.COLLECTION.USERS,
              idPayment,
              GLOBALS.SUB_COLLECTION.PAYMENTS,
              newPayment
            )
              .then((data) => {
                console.log(
                  '[Consumer Payment Screen] addPayment - Payment  included',
                  data
                );
                updateUserBalance();
                setIsLoading(false);
                navigation.navigate('ConsumerPaymentsScreen', {
                  userId: user.id,
                });
              })
              .catch((error) => {
                // console.log('[Consumer Add payment Screen - Add payment] - ERRO', error);
                Alert.alert(
                  'Erro ao armazenar o pagamento no banco de dados!',
                  error
                );
              });
          })
          .catch((error) => {
            console.log('Erro =>', error);
            Alert.alert(
              'Erro ao recuperar o endereço da imagem do comprovante do banco de dados!',
              error
            );
          });
      })
      .catch((error) => {
        Alert.alert('Erro ao armazenar a imagem do comprovante!', error);
      });
  };

  if (isLoading) {
    console.log('[Consumer Payments Screen] isLoading', isLoading);
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.valuesContainer}>
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Valor do Pedido</Text>
            <View style={styles.itemBox}>
              <Text style={styles.itemValue}>{`R$ ${orderTotalAmount.toFixed(
                2
              )}`}</Text>
            </View>
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Saldo atual</Text>
            <View style={styles.itemBox}>
              <Text style={styles.itemValue}>{`R$ ${userData.balance.toFixed(
                2
              )}`}</Text>
            </View>
          </View>
        </View>
        <Divider style={{ borderBottomColor: Colors.tertiary }} />
        <View style={styles.addContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.itemText}>Saldo a Pagar</Text>
            <CurrencyInput
              style={styles.input}
              value={amountToPay}
              onChangeValue={setAmountToPay}
              prefix="R$ "
              delimiter=","
              separator="."
              precision={2}
              onChangeText={(formattedValue) => {
                console.log(formattedValue); // $2,310.46
              }}
            />
          </View>
          <ImagePicker onImagePicker={imageSelectedHandler} />
        </View>
        <View style={styles.confirmContainer}>
          <Divider style={{ borderBottomColor: Colors.secondary }} />
          <Button
            id="confirmPaymentButton"
            style={styles.confirmButton}
            textColor="white"
            onPress={handlePayment}
          >
            Confirmar Pagamento
          </Button>
        </View>
      </View>
    </View>
  );
};

export const consumerAddPaymentScreenOptions = (navData) => {
  return {
    headerTitle: () => <HeaderTitle title="Adicionar Pagamento" />,
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
    backgroundColor: 'white',
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
    margin: 25,
  },
  valuesContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: '15%',
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  itemText: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
    color: '#505050',
  },
  itemValue: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
    color: '#8898AA',
  },
  addContainer: {
    marginTop: 10,
    // height: '50%',
    paddingTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
    color: '#8898AA',
    textAlign: 'right',
    width: 80,
    // backgroundColor: 'green'
  },
  button1: {
    marginTop: 15,
    backgroundColor: '#f2f2f2',
    color: 'black',
  },
  textButton: {
    color: 'black',
  },
  receiptButtonInt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  confirmContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  confirmButton: {
    marginTop: 5,
    backgroundColor: Colors.primary,
    alignSelf: 'center',
  },
});

export default ConsumerAddPaymentScreen;

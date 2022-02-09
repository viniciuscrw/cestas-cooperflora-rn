import React, { useEffect, useState, useContext } from 'react';
import { format } from 'date-fns';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import firebase from 'firebase';
import HeaderTitle from '../../components/HeaderTitle';
import BackArrow from '../../components/BackArrow';
import Divider from '../../components/Divider';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';
import { Context as userContext } from '../../context/UserContext';
import {
  updateDocInSubcollection,
  updateDocAttribute,
} from '../../api/firebase';
import GLOBALS from '../../Globals';
import ReceiptPicker from '../../components/ReceiptPicker';
import { Number, TextLabel } from '../../components/StandardStyles';
import FormInput from '../../components/FormInput';

const ConsumerAddPaymentScreen = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState();
  const [receiptDocument, setReceiptDocument] = useState(null);
  const [paymentNote, setPaymentNote] = useState('');

  const { userPayment } = route.params;
  const { userId } = userPayment;
  const { getUserById } = useContext(userContext);

  useEffect(() => {
    setIsLoading(true);
    if (userId) {
      getUserById(userId).then((data) => {
        setUserData(data);
        setIsLoading(false);
      });
    }
  }, [userId]);

  const receiptSelectedHandler = async (receipt) => {
    setReceiptDocument(receipt);
  };

  const updateUserBalance = (paidValue) => {
    const newBalance = paidValue + userData.balance;
    updateDocAttribute('users', userId, 'balance', newBalance);
  };

  const updatePayment = (receiptUrl, receiptMetadata) => {
    const formatedDate = new Date(userPayment.date);
    const payment = {
      currentBalance: userPayment.currentBalance,
      date: formatedDate.toISOString(),
      orderId: userPayment.orderId,
      orderTotalAmount: userPayment.orderTotalAmount,
      status: GLOBALS.PAYMENT.STATUS.COMPLETED,
      totalToBePaid: userPayment.totalToBePaid,
      userId: userPayment.userId,
      paymentNote,
      receipt: {
        url: receiptUrl,
        type: receiptMetadata.contentType,
      },
      paymentDate: new Date().toISOString(),
    };
    updateDocInSubcollection(
      GLOBALS.COLLECTION.USERS,
      userPayment.userId,
      GLOBALS.SUB_COLLECTION.PAYMENTS,
      userPayment.paymentId,
      payment
    )
      .then((data) => {
        // console.log(
        //   '[Consumer Payment Screen] addPayment - Payment  included',
        //   data
        // );
        updateUserBalance(userPayment.totalToBePaid);
        // update order with payment completed.
        updateDocAttribute(
          GLOBALS.COLLECTION.ORDERS,
          userPayment.orderId,
          GLOBALS.ORDER.ATTRIBUTE.PAYMENT_STATUS,
          GLOBALS.PAYMENT.STATUS.COMPLETED
        );
        //
        setIsLoading(false);
        navigation.navigate('ConsumerPaymentsScreen', {
          userId,
        });
      })
      .catch((error) => {
        Alert.alert('Erro ao armazenar o pagamento no banco de dados!', error);
      });
  };

  const handlePayment = async () => {
    if (userPayment.totalToBePaid <= 0) {
      Alert.alert('O valor para o pagamento está com o valor 0!');
      return;
    }
    if (!receiptDocument) {
      Alert.alert('Por favor inclua o comprovante!');
      return;
    }
    if (receiptDocument.size > GLOBALS.RECEIPTFILE.SIZE) {
      Alert.alert(
        `Arquivo muito grande! Tamanho do arquivo deve ser menor que ${GLOBALS.RECEIPTFILE.SIZE} Bytes`
      );
      return;
    }
    const date = new Date();
    const documentName = format(date, 'yyyyMMddHHMMSS');
    const response = await fetch(receiptDocument.uri);
    const blob = await response.blob();
    const receiptRef = firebase
      .storage()
      .ref()
      .child(`${userId}/${documentName}`);
    setIsLoading(true);
    receiptRef
      .put(blob)
      .then((response) => {
        receiptRef
          .getMetadata()
          .then((receiptMetadata) => {
            receiptRef
              .getDownloadURL()
              .then((receiptUrl) => {
                updatePayment(receiptUrl, receiptMetadata);
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
            Alert.alert(
              'Erro ao recuperar os metadados do comprovante de pagamento!',
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
            <TextLabel>Valor do Pedido</TextLabel>
            <View style={styles.itemBox}>
              <Number>{`R$ ${userPayment.orderTotalAmount.toFixed(2)}`}</Number>
            </View>
          </View>
          <View style={styles.itemContainer}>
            <TextLabel>Saldo atual</TextLabel>
            <View style={styles.itemBox}>
              <Number>{`R$ ${userData.balance.toFixed(2)}`}</Number>
            </View>
          </View>
        </View>
        <Divider style={{ borderBottomColor: Colors.tertiary }} />
        <View style={styles.receiptContainer}>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <KeyboardAvoidingView
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                marginBottom: 30,
              }}
              behavior={Platform.OS === 'ios' ? 'padding' : null}
              enabled
              keyboardVerticalOffset={200}
            >
              <ScrollView>
                <View style={styles.addContainer}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.itemText}>Saldo a Pagar</Text>
                    <Number>{`R$ ${userPayment.totalToBePaid.toFixed(
                      2
                    )}`}</Number>
                  </View>
                  <View>
                    <ReceiptPicker onReceiptPicker={receiptSelectedHandler} />
                  </View>
                </View>
                <View>
                  <FormInput
                    id="paymentNote"
                    style={styles.paymentNote}
                    label="Observação (Opcional máx. 250 caracteres)"
                    value={paymentNote}
                    onChangeText={setPaymentNote}
                    editable
                    multiline
                    maxLength={250}
                  />
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
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

export const consumerAddPaymentScreenOptions = () => {
  return {
    headerTitle: () => (
      <View style={styles.header}>
        <HeaderTitle title="Adicionar Pagamento" />
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
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  valuesContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: '10%',
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
  receiptContainer: {
    height: '80%',
  },
  addContainer: {
    marginTop: 5,
    paddingTop: 5,
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
  paymentNote: {
    borderBottomWidth: 2,
    borderColor: Colors.tertiary,
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
  header: {
    alignItems: 'flex-start',
  },
});

export default ConsumerAddPaymentScreen;

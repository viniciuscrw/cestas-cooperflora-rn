import React, { useEffect, useState, useContext } from 'react';
import { format } from 'date-fns';
import { StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
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
import { Number } from '../../components/StandardStyles';

const ConsumerAddPaymentScreen = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState();
  const [receiptDocument, setReceiptDocument] = useState(null);

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
    console.log('[ConsumerAddPayment Screen] imageSelectedHandler');
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
        console.log(
          '[Consumer Payment Screen] addPayment - Payment  included',
          data
        );
        updateUserBalance(userPayment.totalToBePaid);
        setIsLoading(false);
        navigation.navigate('ConsumerPaymentsScreen', {
          userId,
        });
      })
      .catch((error) => {
        // console.log('[Consumer Add payment Screen - Add payment] - ERRO', error);
        Alert.alert('Erro ao armazenar o pagamento no banco de dados!', error);
      });
  };

  const handlePayment = async () => {
    // console.log('[Consumer Payment Screen] Handle payment', receiptDocument);
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
          .catch(() => {
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
            <Text style={styles.itemText}>Valor do Pedido</Text>
            <View style={styles.itemBox}>
              <Number>{`R$ ${userPayment.orderTotalAmount.toFixed(2)}`}</Number>
            </View>
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Saldo atual</Text>
            <View style={styles.itemBox}>
              <Number>{`R$ ${userData.balance.toFixed(2)}`}</Number>
            </View>
          </View>
        </View>
        <Divider style={{ borderBottomColor: Colors.tertiary }} />
        <View style={styles.addContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.itemText}>Saldo a Pagar</Text>
            <Number>{`R$ ${userPayment.totalToBePaid.toFixed(2)}`}</Number>
          </View>
          <View>
            <ReceiptPicker onReceiptPicker={receiptSelectedHandler} />
          </View>
        </View>
        {/* <PDFReader
          source={{
            uri: "content://com.android.providers.downloads.documents/document/msf%3A24",
          }}
        /> */}
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
  // itemValue: {
  //   fontFamily: 'Roboto',
  //   fontWeight: '700',
  //   fontSize: 16,
  //   color: '#8898AA',
  // },
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

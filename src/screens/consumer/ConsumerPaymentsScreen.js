import React, { useEffect, useState, useContext } from 'react';
import { format } from 'date-fns';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  TouchableHighlight,
  Alert,
} from 'react-native';
import HeaderTitle from '../../components/HeaderTitle';
import BackArrow from '../../components/BackArrow';
import Divider from '../../components/Divider';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';
import useUser from '../../hooks/useUser';

import { Context as userContext } from '../../context/UserContext';
import firebase from 'firebase';
import GLOBALS from '../../Globals';
import ClipIcon from '../../../assets/images/icons/clipicon.png';
import { stardardScreenStyle as screen } from '../screenstyles/ScreenStyles';
import { TextContent, TextLabel } from '../../components/StandardStyles';

const ConsumerPaymentsScreen = ({ route, navigation }) => {
  console.log('[ConsumerPaymentScreen started]');
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState();
  const [userPayments, setUserPayments] = useState([]);

  let userId;
  if (route.params.userId) {
    userId = route.params.userId;
  } else {
    userId = useUser().id;
  }
  const { getUserById } = useContext(userContext);

  const fetchPayments = async () => {
    const collection = GLOBALS.COLLECTION.USERS;
    const subcollection = GLOBALS.SUB_COLLECTION.PAYMENTS;
    // Mover para api firebase
    const db = firebase.firestore();
    const ref = db.collection(collection);
    // const doc = userId + 'pay';
    const doc = userId;
    setIsLoading(true);
    await ref
      .doc(doc)
      .collection(subcollection)
      .orderBy('date')
      .get()
      .then((snapshot) => {
        const newUserPayments = [];
        snapshot.forEach((payment) => {
          const date = new Date(payment.data().date);
          newUserPayments.push({
            currentBalance: payment.data().currentBalance,
            date: date,
            orderId: payment.data().orderId,
            orderTotalAmount: payment.data().orderTotalAmount,
            status: payment.data().status,
            amount: payment.data().totalToBePaid,
            receiptImage: payment.data().receiptImage
              ? payment.data().receiptImage
              : '',
            showReceiptImage: false,
          });
        });
        newUserPayments.sort((a, b) => {
          return a.date < b.date ? 1 : -1;
        });
        console.log(newUserPayments);
        setUserPayments(newUserPayments);
        setIsLoading(false);
      })
      .catch((err) => {
        Alert.alert('Erro ao carregar os seus pagamentos!', err);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    if (userId) {
      getUserById(userId).then((data) => {
        setUserData(data);
        fetchPayments();
        setIsLoading(false);
      });
    }
  }, [userId]);

  const showImage = (index) => {
    // console.log('[show Receipt Image]' , receiptImage);
    const newUserPayments = [...userPayments];
    newUserPayments[index].showReceiptImage =
      !newUserPayments[index].showReceiptImage;
    setUserPayments(newUserPayments);

    // setUserPayments([...userPayments, userPayments[index].showReceiptImage = true])
  };

  const renderClosedPayments = () => {
    return userPayments.map((userPayment, index) => (
      <TouchableOpacity>
        <TextLabel>Closed Payments</TextLabel>
        {userPayment.status === 'opened' ? (
          <View key={userPayment.date}>
            <View style={styles.paymentContainer}>
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>
                  {format(userPayment.date, GLOBALS.FORMAT.DEFAULT_DATE_TIME)}
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => showImage(index)}
                >
                  <View style={styles.imageIcon}>
                    <Image source={ClipIcon} />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.payLine}>
                <Text>Pagamento Realizado</Text>
                <Text style={styles.amountText}>
                  R$ {userPayment.amount.toFixed(2)}
                </Text>
              </View>
            </View>
            {userPayment.showReceiptImage ? (
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={{ uri: userPayment.receiptImage }}
                />
              </View>
            ) : null}
            <Divider style={{ borderBottomColor: Colors.tertiary }} />
          </View>
        ) : null}
      </TouchableOpacity>
    ));
  };

  const renderOpenedPayments = () => {
    return userPayments.map((userPayment) => {
      return (
        <TouchableOpacity
          key={userPayment.date}
          onPress={() => {
            navigation.navigate('ConsumerAddPaymentScreen', {
              orderTotalAmount: userPayment.orderTotalAmount,
              orderId: userPayment.orderId,
            });
          }}
        >
          {userPayment.status === 'opened' ? (
            <View key={userPayment.date}>
              <View style={styles.paymentContainer}>
                <View style={styles.dateContainer}>
                  <TextLabel>
                    {format(userPayment.date, GLOBALS.FORMAT.DEFAULT_DATE_TIME)}
                  </TextLabel>
                </View>
                <View style={styles.payLine}>
                  <TextContent>Valor a ser pago</TextContent>
                  <Text style={styles.amountText}>
                    R$ {userPayment.amount.toFixed(2)}
                  </Text>
                </View>
              </View>
              {userPayment.showReceiptImage ? (
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.image}
                    source={{ uri: userPayment.receiptImage }}
                  />
                </View>
              ) : null}
              <Divider style={{ borderBottomColor: Colors.tertiary }} />
            </View>
          ) : null}
        </TouchableOpacity>
      );
    });
  };

  if (isLoading) {
    // console.log('[Consumer Payments Screen] isLoading', isLoading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Saldo: {userData.balance.toFixed(2)}{' '}
          </Text>
          <Text>{userData.name}</Text>
        </View>
        <Divider style={{ borderBottomColor: Colors.secondary }} />
        <View style={styles.paymentsContainer}>
          <ScrollView style={styles.paymentsContainer}>
            <TextLabel>
              Pagamentos em aberto. Clique sobre o item para fazer o pagamento
            </TextLabel>
            {!userPayments.length === 0 ? (
              <TextLabel>Não existe nenhum pagamento ainda!</TextLabel>
            ) : (
              renderOpenedPayments()
            )}
          </ScrollView>
        </View>
        {/* <View style={styles.buttonContainer}>
          <Divider style={{ borderBottomColor: Colors.secondary }} />
          <Button
            id="addPaymentButton"
            style={styles.addPaymentButton}
            textColor="white"
            onPress={() => {
              navigation.navigate('ConsumerAddPaymentScreen', {
                orderTotalAmount: 0,
                orderId: 0,
              });
            }}
          >
            Adicionar Pagamento
          </Button>
        </View> */}
      </View>
    </View>
  );
};

export const consumerPaymentsScreenOptions = (navData) => {
  return {
    headerTitle: () => (
      <View style={styles.header}>
        <HeaderTitle title="Pagamentos" />
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
  screen,
  container: {
    flex: 1,
    margin: 20,
  },
  titleContainer: {
    alignItems: 'center',
    alignContent: 'center',
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 24,
    color: '#BB2525',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: -1, height: 3 },
    textShadowRadius: 10,
  },
  paymentsContainer: {
    marginTop: 5,
    height: '75%',
    // backgroundColor: 'red',
  },
  paymentContainer: {
    marginTop: 15,
    marginBottom: 15,
  },
  dateContainer: {
    flexDirection: 'row',
  },
  imageIcon: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountText: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
    color: '#505050',
  },
  payLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 10,
  },
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  addPaymentButton: {
    marginTop: 5,
    backgroundColor: Colors.primary,
    alignSelf: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center',
    height: 200,
  },
  image: {
    flex: 1,
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  header: {
    alignItems: 'flex-start',
  },
});

export default ConsumerPaymentsScreen;

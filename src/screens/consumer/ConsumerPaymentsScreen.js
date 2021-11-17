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
  RefreshControl,
  Alert,
} from 'react-native';
import firebase from 'firebase';
import PDFReader from 'rn-pdf-reader-js';
import HeaderTitle from '../../components/HeaderTitle';
import BackArrow from '../../components/BackArrow';
import Divider from '../../components/Divider';
import Colors from '../../constants/Colors';
import useUser from '../../hooks/useUser';

import { Context as userContext } from '../../context/UserContext';
import GLOBALS from '../../Globals';
import ClipIcon from '../../../assets/images/icons/clipicon.png';
import { stardardScreenStyle as screen } from '../screenstyles/ScreenStyles';
import { TextContent, TextLabel } from '../../components/StandardStyles';
import { accessibilityLabel } from '../../utils';

const ConsumerPaymentsScreen = ({ route, navigation }) => {
  // console.log('[ConsumerPaymentScreen started]');
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState();
  const [userPayments, setUserPayments] = useState([]);
  const [paymentsOpened, setPaymentsOpened] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
    setPaymentsOpened(false);
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
            paymentId: payment.id,
            userId: payment.data().userId,
            currentBalance: payment.data().currentBalance,
            date,
            orderId: payment.data().orderId,
            orderTotalAmount: payment.data().orderTotalAmount,
            status: payment.data().status,
            totalToBePaid: payment.data().totalToBePaid,
            receipt: payment.data().receipt ? payment.data().receipt : {},
            showReceiptImage: false,
          });
          payment.data().status === GLOBALS.PAYMENT.STATUS.OPENED
            ? setPaymentsOpened(true)
            : null;
        });
        newUserPayments.sort((a, b) => {
          return a.date < b.date ? 1 : -1;
        });
        setUserPayments(newUserPayments);
        setIsLoading(false);
      })
      .catch((err) => {
        Alert.alert('Erro ao carregar os seus pagamentos!', err);
      });
  };



  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsLoading(true);
      if (userId) {
        getUserById(userId).then((data) => {
          setUserData(data);
          fetchPayments();
          setIsLoading(false);
        });
      }
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation, userId]);

  const showImage = (index) => {
    const newUserPayments = [...userPayments];
    newUserPayments[index].showReceiptImage =
      !newUserPayments[index].showReceiptImage;
    setUserPayments(newUserPayments);
  };

  const renderReceipt = (userPayment) => {
    if (userPayment.showReceiptImage) {
      if (userPayment.receipt.type === 'image/jpeg') {
        return (
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri: userPayment.receipt.url }}
            />
          </View>
        );
      }
      if (userPayment.receipt.type === 'application/pdf') {
        return (
          <View style={styles.imageContainer}>
            <PDFReader
              style={styles.receipt}
              source={{
                uri: userPayment.receipt.url,
              }}
            />
          </View>
        );
      }
    }
    return null;
  };

  const renderClosedPayments = () => {
    return (
      <View style={styles.closedPayments}>
        <TextLabel style={{ alignSelf: 'center', color: '#BB2525' }}>
          Pagamentos Concluídos
        </TextLabel>
        {userPayments.map((userPayment, index) => (
          <View key={userPayment.date}>
            {userPayment.status === GLOBALS.PAYMENT.STATUS.COMPLETED ? (
              <View key={userPayment.date}>
                <View style={styles.paymentContainer}>
                  <View style={styles.dateContainer}>
                    <TextLabel style={styles.dateText}>
                      {format(
                        userPayment.date,
                        GLOBALS.FORMAT.DEFAULT_DATE_TIME
                      )}
                    </TextLabel>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => showImage(index)}
                      {...accessibilityLabel(`showImageClosedPayment${index}`)}
                    >
                      <View style={styles.imageIcon}>
                        <Image source={ClipIcon} />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.payLine}>
                    <TextContent>Pagamento Realizado</TextContent>
                    <Text style={styles.amountText}>
                      R$ {userPayment.totalToBePaid.toFixed(2)}
                    </Text>
                  </View>
                </View>
                {renderReceipt(userPayment)}
                {/* {userPayment.showReceiptImage ? (
                  <View style={styles.imageContainer}>
                    <Image
                      style={styles.image}
                      source={{ uri: userPayment.receipt.url }}
                    />
                  </View>
                ) : null} */}
                <Divider style={{ borderBottomColor: Colors.tertiary }} />
              </View>
            ) : null}
          </View>
        ))}
      </View>
    );
  };

  const renderOpenedPayments = () => {
    return (
      <View style={styles.openedPayments}>
        {!paymentsOpened ? (
          <TextLabel style={{ alignSelf: 'center' }}>
            Não existem pagamentos a serem feitos!
          </TextLabel>
        ) : (
          <View>
            <TextLabel style={{ alignSelf: 'center', color: '#BB2525' }}>
              Pagamentos abertos.
            </TextLabel>
            <TextLabel style={{ alignSelf: 'center', color: '#BB2525' }}>
              Clique sobre o item para pagar.
            </TextLabel>
            {userPayments.map((userPayment, index) => {
              return (
                <TouchableOpacity
                  key={userPayment.date}
                  onPress={() => {
                    navigation.navigate('ConsumerAddPaymentScreen', {
                      // eslint-disable-next-line object-shorthand
                      userPayment: userPayment,
                    });
                  }}
                  {...accessibilityLabel(`showImageOpenedPayment${index}`)}
                >
                  {userPayment.status === GLOBALS.PAYMENT.STATUS.OPENED ? (
                    <View key={userPayment.date}>
                      <View style={styles.paymentContainer}>
                        <View style={styles.dateContainer}>
                          <TextLabel>
                            {format(
                              userPayment.date,
                              GLOBALS.FORMAT.DEFAULT_DATE_TIME
                            )}
                          </TextLabel>
                        </View>
                        <View style={styles.payLine}>
                          <TextContent>Valor a ser pago</TextContent>
                          <Text style={styles.amountText}>
                            R$ {userPayment.totalToBePaid.toFixed(2)}
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
            })}
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchPayments();
                setRefreshing(false);
              }}
            />
          }
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              Saldo: {userData.balance.toFixed(2)}{' '}
            </Text>
            <Text>{userData.name}</Text>
          </View>
          <Divider style={{ borderBottomColor: Colors.secondary }} />
          <View style={styles.paymentsContainer}>
            <ScrollView style={styles.paymentsContainer}>
              {renderOpenedPayments()}
            </ScrollView>
            <View>{renderClosedPayments()}</View>
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
        </ScrollView>
      </View>
    </View>
  );
};

export const consumerPaymentsScreenOptions = () => {
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
  openedPayments: {
    marginBottom: 10,
  },
  paymentsContainer: {
    marginTop: 5,
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

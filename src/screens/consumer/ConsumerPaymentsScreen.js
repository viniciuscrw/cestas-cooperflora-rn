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
import { Entypo } from '@expo/vector-icons';
import HeaderTitle from '../../components/HeaderTitle';
import BackArrow from '../../components/BackArrow';
import Divider from '../../components/Divider';
import Colors from '../../constants/Colors';
import { Context as userContext } from '../../context/UserContext';
import GLOBALS from '../../Globals';
import { stardardScreenStyle as screen } from '../screenstyles/ScreenStyles';
import {
  TextContent,
  TextLabel,
  Number,
} from '../../components/StandardStyles';
import { accessibilityLabel } from '../../utils';
import { fetchPayments } from '../../api/firebase';
import RenderImageReceipt from '../../components/RenderImageReceipt';
import RenderPdfReceipt from '../../components/RenderPdfReceipt';

const ConsumerPaymentsScreen = ({ route, navigation }) => {
  console.log('[ConsumerPaymentsScreen started] specific user');
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState();
  const [userPayments, setUserPayments] = useState([]);
  const [paymentsOpened, setPaymentsOpened] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { userId } = route.params;

  const { getUserById } = useContext(userContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsLoading(true);
      if (userId) {
        getUserById(userId).then((data) => {
          setUserData(data);
          // fetchPayments();
          handleFetchPayments();
          setIsLoading(false);
        });
      }
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation, userId]);

  const handleFetchPayments = () => {
    setPaymentsOpened(false);
    setIsLoading(false);
    fetchPayments(
      GLOBALS.COLLECTION.USERS,
      GLOBALS.SUB_COLLECTION.PAYMENTS,
      userId
    )
      .then((data) => {
        const openedPayments = data.filter(
          (payment) => payment.status === GLOBALS.PAYMENT.STATUS.OPENED
        );
        // eslint-disable-next-line no-unused-expressions
        openedPayments.length > 0 ? setPaymentsOpened(true) : null;
        setUserPayments(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log('Erro dentro do catch do Consumer Payments Screen', error);
        Alert.alert('Erro ao carregar os seus pagamentos!', error);
      });
  };

  const showImage = (index) => {
    const newUserPayments = [...userPayments];
    newUserPayments[index].showReceiptImage =
      !newUserPayments[index].showReceiptImage;
    setUserPayments(newUserPayments);
  };

  const renderReceipt = (userPayment) => {
    if (userPayment.showReceiptImage) {
      if (
        userPayment.receipt.type === 'image/jpeg' ||
        userPayment.receipt.type === 'image/png'
      ) {
        console.log(userPayment.receipt.url);
        return (
          <View style={styles.imageContainer}>
            <RenderImageReceipt imageUrl={userPayment.receipt.url} />
          </View>
        );
      }
      if (userPayment.receipt.type === 'application/pdf') {
        return <RenderPdfReceipt documentUrl={userPayment.receipt.url} />;
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
                        <Entypo
                          name="attachment"
                          size={24}
                          color={Colors.primary}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.payLine}>
                    <TextContent>Pagamento Realizado</TextContent>
                    <Number>R$ {userPayment.totalToBePaid.toFixed(2)}</Number>
                  </View>
                  <View>
                    {userPayment.paymentNote ? (
                      <Text style={styles.paymentNote}>
                        Obs: {userPayment.paymentNote}
                      </Text>
                    ) : null}
                  </View>
                </View>
                {renderReceipt(userPayment)}
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
                          <Number>
                            R$ {userPayment.totalToBePaid.toFixed(2)}
                          </Number>
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
                handleFetchPayments();
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
        </ScrollView>
      </View>
    </View>
  );
};

export const consumerPaymentsScreenOptions = ({ navigation, route }) => {
  return {
    headerTitle: () => (
      <View style={styles.header}>
        <HeaderTitle title="Pagamentos" />
      </View>
    ),
    headerLeft: () => {
      if (route.params.userRole === GLOBALS.USER.ROLE.CONSUMER) {
        return null;
      }
      return (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerLeft}
        >
          <Text>
            <BackArrow />
          </Text>
        </TouchableOpacity>
      );
    },
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
  payLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 10,
  },
  paymentNote: {
    color: Colors.tertiary,
    marginLeft: 10,
  },
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  imageContainer: {
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center',
    // height: 200,
  },
  image: {
    flex: 1,
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  documentContainer: {
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center',
    height: 200,
  },
  header: {
    alignItems: 'flex-start',
  },
  headerLeft: {
    padding: 10,
  },
});

export default ConsumerPaymentsScreen;

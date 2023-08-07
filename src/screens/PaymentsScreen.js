import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import HeaderTitle from '../components/HeaderTitle';
import { Context as UserContext } from '../context/UserContext';
import useUser from '../hooks/useUser';
import GLOBALS from '../Globals';
import Colors from '../constants/Colors';
import { stardardScreenStyle as screen } from './screenstyles/ScreenStyles';
import { TextLabel } from '../components/StandardStyles';
import { updateDocAttribute } from '../api/firebase';

const PaymentsScreen = ({ navigation }) => {
  console.log('[PaymentsScreen] started');
  const [isLoading, setIsLoading] = useState(false);
  const [consumers, setConsumers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  console.log('[PaymentsScreen started]');
  const { fetchConsumers } = useContext(UserContext);

  const user = useUser();

  const getConsumers = () => {
    setIsLoading(true);
    fetchConsumers()
      .then((consumers) => {
        consumers.sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });
        setConsumers(consumers);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(
          'Erro ao ler as pessoas consumidoras do Firestore !',
          error
        );
        setIsLoading(false);
        throw new Error(
          'Erro ao ler as pessoas consumidoras do Firestore !',
          error
        );
      });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getConsumers();
    });
    return unsubscribe;
  }, []);

  if (user) {
    console.log('[PaymentsScreen] consumer');
    if (user.role === GLOBALS.USER.ROLE.CONSUMER) {
      navigation.navigate('ConsumerPaymentsScreen', {
        userId: user.id,
        userRole: user.role,
      });
    }
  }

  const handleFetchConsumers = () => {
    console.log('Fetching consumers');
  };

  const handleOnConsumerSelected = (consumerId) => {
    navigation.navigate('ConsumerPaymentsScreen', {
      userId: consumerId,
      userRole: GLOBALS.USER.ROLE.ORGANIZER,
    });
  };

  const handleCheckBalanceBox = (consumerIndex) => {
    setIsLoading(true);
    updateDocAttribute(
      GLOBALS.COLLECTION.USERS,
      consumers[consumerIndex].id,
      GLOBALS.USER.ATTRIBUTE.CHECKBALANCE,
      !consumers[consumerIndex].checkBalance
    )
      .then(() => {
        const newConsumers = [...consumers];
        newConsumers[consumerIndex].checkBalance =
          !newConsumers[consumerIndex].checkBalance;
        setConsumers(newConsumers);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(
          'Erro ao atualizar checkbalance da pessoa consumidora!',
          error
        );
        throw new Error(
          'Erro ao atualizar o atributo checkBalance no Firestore !',
          error
        );
      });
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
      <View sytle={styles.container}>
        <ScrollView
          style={styles.consumersContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setIsLoading(true);
                handleFetchConsumers();
                setIsLoading(false);
              }}
            />
          }
        >
          {consumers.map((consumer, index) => {
            // console.log(consumer.name + consumer.checkBalance);
            return (
              <TouchableOpacity
                key={consumer.id}
                style={styles.consumerContainer}
                onPress={() => handleOnConsumerSelected(consumer.id)}
              >
                <Checkbox
                  value={consumer.checkBalance}
                  onValueChange={() => handleCheckBalanceBox(index)}
                  color={Colors.secondary}
                  style={{ marginRight: 3 }}
                />
                <TextLabel style={styles.text}>{consumer.name}</TextLabel>
                {/* <View style={styles.textBox}> */}
                {/* <TextLabel
                  style={{
                    justifyContent: 'center',
                    textAlign: 'right',
                    flex: 1,
                  }}
                >
                  R$ {consumer.balance.toFixed(2)}
                </TextLabel> */}
                {/* </View> */}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export const paymentsScreenOptions = () => {
  return {
    headerTitle: () => (
      <HeaderTitle title="Pagamentos das Pessoas Consumidoras" />
    ),
    headerLeft: () => {
      return null;
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
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  consumersContainer: {
    paddingTop: 10,
  },
  consumerContainer: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 30,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 5,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.87,
    shadowRadius: 4.65,
    elevation: 4,
  },
});

export default PaymentsScreen;

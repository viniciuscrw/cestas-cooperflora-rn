import React, { useContext, useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import HeaderTitle from '../components/HeaderTitle';
import { Context as UserContext } from '../context/UserContext';
import useUser from '../hooks/useUser';
import GLOBALS from '../Globals';
import Colors from '../constants/Colors';
import { stardardScreenStyle as screen } from './screenstyles/ScreenStyles';

const PaymentsScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [consumers, setConsumers] = useState([]);

  console.log('[PaymentsScreen started]');
  const { fetchConsumers } = useContext(UserContext);

  const user = useUser();

  useEffect(() => {
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
        console.log(error);
      });
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

  const handleOnConsumerSelected = (consumerId) => {
    navigation.navigate('ConsumerPaymentsScreen', {
      userId: consumerId,
      userRole: GLOBALS.USER.ROLE.ORGANIZER,
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
        <ScrollView style={styles.consumersContainer}>
          {consumers.map((consumer) => {
            return (
              <TouchableOpacity
                key={consumer.id}
                style={styles.consumerContainer}
                onPress={() => handleOnConsumerSelected(consumer.id)}
              >
                <Text style={styles.text}>{consumer.name}</Text>
                <Text style={styles.text}>
                  R$ {consumer.balance.toFixed(2)}
                </Text>
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
    headerTitle: () => <HeaderTitle title="Saldo dos Consumidores(as)" />,
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
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 30,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 5,
    backgroundColor: '#F0F5F9',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.87,
    shadowRadius: 4.65,
    elevation: 2,
  },
  text: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 17,
    color: 'black',
  },
});

export default PaymentsScreen;

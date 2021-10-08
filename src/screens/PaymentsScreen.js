import React, { useContext, useEffect, useState } from 'react';
import { withNavigation } from 'react-navigation';
import { Text, StyleSheet, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import HeaderTitle from '../components/HeaderTitle';
import BackArrow from '../components/BackArrow';
import { Context as UserContext } from '../context/UserContext';
import useUser from '../hooks/useUser';
import GLOBALS from '../Globals';
import Colors from '../constants/Colors';

const PaymentsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [consumers, setConsumers] = useState([]);

  console.log('[PaymentsScreen started]');
  const { fetchConsumers } = useContext(
    UserContext
  );

  const user = useUser();

  useEffect(() => {
    setIsLoading(true);
    fetchConsumers().then((consumers) => {
      consumers.sort((a, b) => {
        return (a.name > b.name ? 1 : -1)
      });
      setConsumers(consumers)
      setIsLoading(false);
    }).catch((error) => {
      console.log(error);
    });

  }, []);

  if (user) {
    console.log('[PaymentsScreen] consumer');
    if (user.role === GLOBALS.USER.ROLE.CONSUMER) {
      props.navigation.navigate('ConsumerPaymentsScreen',{ userId: user.id });
    }
  }

  const handleOnConsumerSelected = (consumerId) => {
    props.navigation.navigate('ConsumerPaymentsScreen', { userId: consumerId });
  }

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
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Pagamentos Realizados</Text>
          <Text style={styles.text}>23/05/2021</Text>
        </View>
        <View style={styles.internalContainer}>
          <ScrollView>
            {consumers.map((consumer) => {
              return (
                <TouchableOpacity
                  key={consumer.id}
                  style={styles.consumerContainer}
                  onPress={() => handleOnConsumerSelected(consumer.id)}
                >
                  <Text style={styles.text}>{consumer.name}</Text>
                  <Text style={styles.text}>R$ {consumer.balance.toFixed(2)}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View >

      </View>
    </View>
  );
};

export const paymentsScreenOptions = (navData) => {
  return {
    headerTitle: () => (
      <HeaderTitle title="Pagamentos" />
    ),
    headerBackImage: () => (<BackArrow />),
    headerStyle: {
      backgroundColor: 'white',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    }
  };
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: 'white'
  },
  container: {
    // backgroundColor: '#F0F5F9',
    backgroundColor: 'red',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  internalContainer: {
    backgroundColor: 'white',
    height: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    marginTop: -15,
    paddingTop: 30
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F0F5F9',
    paddingTop: 30,
    paddingRight: 30,
    paddingLeft: 35,
    paddingBottom: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  headerText: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
    color: '#505050',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: -1, height: 2 },
    textShadowRadius: 10
  },
  consumerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 30,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 3,
    backgroundColor: 'white',
    shadowColor: "#000",
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
    fontSize: 16,
    color: '#505050',
  }
});

export default withNavigation(PaymentsScreen);

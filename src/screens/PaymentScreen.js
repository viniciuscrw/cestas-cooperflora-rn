import React, { useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import useUser from '../hooks/useUser';
import GLOBALS from '../Globals';
import HeaderTitle from '../components/HeaderTitle';
import BackArrow from '../components/BackArrow';
import Colors from '../constants/Colors';

const PaymentScreen = ({ navigation }) => {
  console.log('[Aux PaymentScreen started] ');
  const user = useUser();

  useFocusEffect(
    useCallback(() => {
      if (user) {
        console.log('[PaymentsScreen] consumer');
        if (user.role === GLOBALS.USER.ROLE.CONSUMER) {
          navigation.navigate('ConsumerPaymentsScreen', {
            userId: user.id,
            userRole: user.role,
          });
        }
        if (user.role === GLOBALS.USER.ROLE.ORGANIZER) {
          navigation.navigate('PaymentsScreen', {
            userId: user.id,
            userRole: user.role,
          });
        }
      }
    }, [user])
  );

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    </View>
  );
};

export const paymentScreenOptions = () => {
  return {
    headerTitle: () => <HeaderTitle title="Pagamentos" />,
    headerBackImage: () => <BackArrow />,
  };
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: 'white',
  },
  container: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
});

export default PaymentScreen;

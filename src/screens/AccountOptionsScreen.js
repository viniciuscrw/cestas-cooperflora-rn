import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  RefreshControl,
  ScrollView,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { Divider } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import HeaderTitle from '../components/HeaderTitle';
import FrontArrow from '../../assets/images/icons/frontarrow.png';
import { stardardScreenStyle as screen } from './screenstyles/ScreenStyles';
import { TextLabel } from '../components/StandardStyles';
import Colors from '../constants/Colors';
import { setPushNotificationToken } from '../utils';
import { updateDocAttribute } from '../api/firebase';

const AccountOptionsScreen = ({ navigation }) => {
  const [isPushToken, setIsPushToken] = useState(false);
  const { state, signout, fetchLoggedUser } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  console.log('[AccountOptionScreen started]');

  useEffect(() => {
    fetchLoggedUser();
  }, []);

  useEffect(() => {
    if (state) {
      if (state.loggedUser) {
        if (
          state.loggedUser.pushNotificationToken === null ||
          !state.loggedUser.pushNotificationToken
        ) {
          setIsPushToken(false);
        } else {
          setIsPushToken(true);
        }
      }
    }
  }, [state]);

  const handleCheckBox = () => {
    if (!isPushToken) {
      setPushNotificationToken().then((pushNotificationToken) => {
        console.log('Token', pushNotificationToken);
        if (!pushNotificationToken) {
          setIsPushToken(false);
          updateDocAttribute(
            'users',
            state.loggedUser.id,
            'pushNotificationToken',
            null
          );
        } else {
          setIsPushToken(true);
          updateDocAttribute(
            'users',
            state.loggedUser.id,
            'pushNotificationToken',
            pushNotificationToken
          );
        }
      });
    } else {
      setIsPushToken(false);
      updateDocAttribute(
        'users',
        state.loggedUser.id,
        'pushNotificationToken',
        null
      );
    }
  };

  return (
    <View style={styles.screen}>
      {state.loading ? (
        <Spinner />
      ) : (
        <View style={styles.container}>
          {state.loggedUser ? (
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    setRefreshing(true);
                    fetchLoggedUser();
                    setRefreshing(false);
                  }}
                />
              }
            >
              <View style={styles.headerContainer}>
                <Text style={styles.listItemTitle}>
                  {state.loggedUser.name}
                </Text>
                <Text style={styles.listItemText}>
                  {state.loggedUser.email}
                </Text>
                <Text>{state.loggedUser.phoneNumber}</Text>
              </View>
              <Divider />
              <TouchableOpacity onPress={() => navigation.navigate('Payments')}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listItem}>
                    <Text style={styles.listItemTitle}>Meu Saldo</Text>
                    <Text>{`R$ ${state.loggedUser.balance}`}</Text>
                  </View>
                  <Image source={FrontArrow} />
                </View>
                <Divider />
              </TouchableOpacity>
            </ScrollView>
          ) : null}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('UpdateAccountInfoScreen', {
                user: state.loggedUser,
              })
            }
          >
            <View style={styles.listItemContainer}>
              <View style={styles.listItem}>
                <Text style={styles.listItemTitle}>Alterar informações</Text>
              </View>
              <Image source={FrontArrow} />
            </View>
            <Divider />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              // navigation.navigate('UpdatePasswordScreen', {
              //   userEmail: state.loggedUser.email,
              //   navigation,
              // })
              navigation.navigate('UpdatePasswordScreen', {
                userEmail: state.loggedUser.email,
              })
            }
          >
            <View style={styles.listItemContainer}>
              <View style={styles.listItem}>
                <Text style={styles.listItemTitle}>Alterar senha</Text>
              </View>
              <Image source={FrontArrow} />
            </View>
            <Divider />
          </TouchableOpacity>
          <View style={styles.listItemContainer}>
            <TextLabel style={styles.paragraph}>
              Permitir notificação das entregas
            </TextLabel>
            <Checkbox
              value={isPushToken}
              onValueChange={handleCheckBox}
              color={isPushToken ? Colors.primary : 'undefined'}
            />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('AboutScreen')}>
            <View style={styles.listItemContainer}>
              <View style={styles.listItem}>
                <Text style={styles.listItemTitle}>Sobre </Text>
              </View>
              <Image source={FrontArrow} />
            </View>
            <Divider />
          </TouchableOpacity>
          <TouchableOpacity onPress={signout}>
            <View style={styles.listItemContainer}>
              <View style={styles.listItem}>
                <Text style={styles.listItemTitle}>Sair</Text>
              </View>
              <Image source={FrontArrow} />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export const AccountOptionsScreenOptions = () => {
  return {
    headerTitle: () => (
      <View style={styles.header}>
        <HeaderTitle title="Minha Conta" />
      </View>
    ),
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
    margin: 25,
  },
  headerContainer: {
    padding: 10,
    minHeight: 60,
    marginTop: 5,
  },
  listItem: {
    // flexDirection: 'row',
    // alignContent: 'space-between'
  },
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    minHeight: 60,
    marginTop: 5,
  },
  listItemTitle: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
    color: '#505050',
  },
  listItemText: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 16,
    color: '#505050',
  },
  header: {
    alignItems: 'flex-start',
  },
});

export default AccountOptionsScreen;

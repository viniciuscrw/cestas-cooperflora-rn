import React, { useEffect, useContext } from 'react';
import { Context as AuthContext } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Divider, ListItem } from 'react-native-elements';
import { NavigationEvents, withNavigation } from 'react-navigation';
import HeaderTitle from '../components/HeaderTitle';
import FrontArrow from '../../assets/images/icons/frontarrow.png';

const AccountOptionsScreen = ({ navigation }) => {
  const { state, signout, fetchLoggedUser } = useContext(AuthContext);
  console.log('AccountOptionScreen');

  useEffect(() => {
    fetchLoggedUser();
    console.log('AccountOptionScreen] fetchLoggedUser');
  }, []);

  return (
    <View style={styles.screen}>
      {state.loading ? (
        <Spinner />
      ) : (
        <View style={styles.container}>
          {state.loggedUser ? (
            <View>
              <View style={styles.headerContainer}>
                <Text style={styles.listItemTitle}>{state.loggedUser.name}</Text>
                <Text style={styles.listItemText}>{state.loggedUser.email}</Text>
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
            </View>
          ) : null}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('UpdateAccountInfoScreen', { user: state.loggedUser })
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
              navigation.navigate('UpdatePasswordScreen', {
                userEmail: state.loggedUser.email,
                navigation,
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

export const AccountOptionsScreenOptions = (navData) => {
  return {
    headerTitle: () => (
      <HeaderTitle title="Minha Conta" />
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
  screen: {
    flex: 1,
    marginTop: 4,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 4, height: -3 },
    shadowRadius: 8,
    elevation: 25,
    // backgroundColor: 'red',
  },
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
    // backgroundColor: '#f2f2f2',
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
});

export default AccountOptionsScreen;
import React, { useContext } from 'react';
import { Context as AuthContext } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider, ListItem } from 'react-native-elements';
import { NavigationEvents, withNavigation } from 'react-navigation';

const AccountOptionsScreen = ({ navigation }) => {
  const { state, signout, fetchLoggedUser } = useContext(AuthContext);

  return state.loading ? (
    <Spinner />
  ) : (
    <View style={styles.container}>
      <NavigationEvents onWillFocus={fetchLoggedUser} />
      {state.loggedUser ? (
        <View>
          <View>
            <View style={styles.listItemContainer}>
              <Text style={styles.listItemTitle}>{state.loggedUser.name}</Text>
              <Text style={styles.listItemText}>{state.loggedUser.email}</Text>
              <Text>{state.loggedUser.phoneNumber}</Text>
            </View>
            <Divider />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Payments')}>
            <ListItem
              containerStyle={styles.listItemContainer}
              title="Meu saldo"
              titleStyle={styles.listItemTitle}
              subtitle={`R$ ${state.loggedUser.balance}`}
              chevron
              bottomDivider
            />
          </TouchableOpacity>
        </View>
      ) : null}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('UpdateAccountInfo', { user: state.loggedUser })
        }
      >
        <ListItem
          containerStyle={styles.listItemContainer}
          title="Alterar informações"
          titleStyle={styles.listItemTitle}
          chevron
          bottomDivider
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('UpdatePassword', {
            userEmail: state.loggedUser.email,
            navigation,
          })
        }
      >
        <ListItem
          containerStyle={styles.listItemContainer}
          title="Alterar senha"
          titleStyle={styles.listItemTitle}
          chevron
          bottomDivider
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={signout}>
        <ListItem
          containerStyle={styles.listItemContainer}
          title="Sair"
          titleStyle={styles.listItemTitle}
          bottomDivider
          chevron
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  listItemContainer: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    minHeight: 60,
  },
  listItemTitle: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  listItemText: {
    fontSize: 17,
  },
});

export default withNavigation(AccountOptionsScreen);

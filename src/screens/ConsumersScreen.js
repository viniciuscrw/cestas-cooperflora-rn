import React, { useContext } from 'react';
import { Context as UserContext } from '../context/UserContext';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { AntDesign } from '@expo/vector-icons';
import UsersList from '../components/UsersList';
import Spinner from '../components/Spinner';

const ConsumersScreen = ({ navigation }) => {
  const { state, fetchConsumers, deleteUser } = useContext(UserContext);

  return state.loading ? (
    <Spinner />
  ) : (
    <View style={styles.container}>
      <NavigationEvents onWillFocus={fetchConsumers} />
      <UsersList data={state.users} onUserDelete={deleteUser} />
      <TouchableOpacity
        style={styles.icon}
        onPress={() => navigation.navigate('CreateUser', { role: 'consumer' })}
      >
        <AntDesign name="pluscircle" size={46} color="darkolivegreen" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    position: 'absolute',
    bottom: 20,
    right: 35,
  },
});

export default withNavigation(ConsumersScreen);

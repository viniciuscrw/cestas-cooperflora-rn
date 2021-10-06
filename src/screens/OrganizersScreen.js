import React, { useContext, useEffect } from 'react';
import { Context as UserContext } from '../context/UserContext';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { AntDesign } from '@expo/vector-icons';
import UsersList from '../components/UsersList';
import Spinner from '../components/Spinner';

const OrganizersScreen = ({ navigation }) => {
  const { state, fetchOrganizers, deleteUser } = useContext(UserContext);

  useEffect(() => {
    fetchOrganizers();
  },[])

  return state.loading ? (
    <Spinner />
  ) : (
    <View style={styles.container}>
      {/* <NavigationEvents onWillFocus={fetchOrganizers} /> */}
      <UsersList data={state.users} onUserDelete={deleteUser} />
      <TouchableOpacity
        style={styles.icon}
        onPress={() => navigation.navigate('CreateUserScreen', { role: 'organizer' })}
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

export default OrganizersScreen;

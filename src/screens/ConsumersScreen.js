import React, { useContext, useEffect } from 'react';
import { Context as UserContext } from '../context/UserContext';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { AntDesign } from '@expo/vector-icons';
import UsersList from '../components/UsersList';
import Spinner from '../components/Spinner';

const ConsumersScreen = ({ navigation }) => {
  const { state, fetchConsumers, deleteUser } = useContext(UserContext);

  useEffect(() => {
    fetchConsumers();
  }, []);

  return state.loading ? (
    <Spinner />
  ) : (
    <View style={styles.container}>
      {/* <NavigationEvents onWillFocus={fetchConsumers} /> */}
      <UsersList data={state.users} onUserDelete={deleteUser} navigation={navigation}/>
      <TouchableOpacity
        style={styles.icon}
        onPress={() => navigation.navigate('CreateUserScreen', { role: 'consumer' })}
      >
        <AntDesign name="pluscircle" size={46} color="darkolivegreen" />
      </TouchableOpacity>
    </View>
  );
};

ConsumersScreen.navigationOptions = (navData) => {
  return {
      headerTitle: () => (
          <HeaderTitle title="Consumer Screen" />
      ),
      // headerBackImage: () => (<BackArrow />),
      // headerStyle: {
      //     backgroundColor: 'transparent',
      //     elevation: 0,
      //     shadowOpacity: 0,
      //     borderBottomWidth: 0,
      // }
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  icon: {
    position: 'absolute',
    bottom: 20,
    right: 35,
  },
});

export default ConsumersScreen;

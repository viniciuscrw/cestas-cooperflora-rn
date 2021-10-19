import React, { useContext, useEffect } from 'react';
import { Context as UserContext } from '../context/UserContext';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import UsersList from '../components/UsersList';
import Spinner from '../components/Spinner';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const OrganizersScreen = ({ navigation }) => {
  const { state, fetchOrganizers, deleteUser } = useContext(UserContext);
  console.log('[Organizer Screen started]');

  // useEffect(() => {
  //   fetchOrganizers();
  // },[])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      fetchOrganizers();
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        {state.loading ? (
          <Spinner />
        ) : (

          <View style={styles.container}>
            {/* <NavigationEvents onWillFocus={fetchOrganizers} /> */}
            <View style={styles.titleContainer}>
              <View>
                <Text style={styles.title}>Organizadores</Text>
              </View>
              <View style={styles.iconsContainer}>

                <TouchableOpacity
                  onPress={() => navigation.navigate('CreateUserScreen', { role: 'organizer' })}
                >
                  <FontAwesome5 name="user-plus" size={24} color={Colors.secondary} />
                </TouchableOpacity>
              </View>
            </View>
            <UsersList data={state.users} onUserDelete={deleteUser} navigation={navigation}/>
            {/* <TouchableOpacity
              style={styles.icon}
              onPress={() => navigation.navigate('CreateUserScreen', { role: 'organizer' })}
            >
              <AntDesign name="pluscircle" size={46} color="darkolivegreen" />
            </TouchableOpacity> */}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop: 4,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#F0F5F9',
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 25
  },
  container: {
    flex: 1,
    margin: 10,
  },
  icon: {
    position: 'absolute',
    bottom: 20,
    right: 35,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
    color: '#505050',
  }
});

export default OrganizersScreen;

import React, { useContext } from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Context as UserContext } from '../context/UserContext';
import UsersList from '../components/UsersList';
import Spinner from '../components/Spinner';
import Colors from '../constants/Colors';

const ConsumersScreen = ({ navigation }) => {
  const { state, fetchConsumers, deleteUser } = useContext(UserContext);

  useFocusEffect(
    React.useCallback(() => {
      fetchConsumers();
    }, [])
  );

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        {state.loading ? (
          <Spinner />
        ) : (
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <View>
                <Text style={styles.title}>Consumidores</Text>
              </View>
              <View style={styles.iconsContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('CreateUserScreen', {
                      role: 'consumer',
                    })
                  }
                >
                  <FontAwesome5
                    name="user-plus"
                    size={24}
                    color={Colors.secondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <UsersList
              data={state.users.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
              })}
              onUserDelete={deleteUser}
              navigation={navigation}
            />
          </View>
        )}
      </View>
    </View>
  );
};

// export const ConsumerScreenOptions = (navData) => {
//   return {
//     headerTitle: () => <HeaderTitle title="Consumer Screen" />,
//   };
// };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop: 4,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#F0F5F9',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 25,
  },
  container: {
    flex: 1,
    margin: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
    color: '#505050',
  },
});

export default ConsumersScreen;

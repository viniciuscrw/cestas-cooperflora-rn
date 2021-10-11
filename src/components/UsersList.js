import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { SwipeListView } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const UsersList = ({ navigation, data, onUserDelete }) => {
  const deleteIfNotSelfDeletion = async (user) => {
    const loggedUserId = await AsyncStorage.getItem('userId');
    console.log('logged user: ' + loggedUserId);

    if (loggedUserId === user.id) {
      Alert.alert('Aviso', 'Não é possível excluir sua própria conta.', [
        {
          text: 'OK',
        },
      ]);
    } else {
      onUserDelete(user);
    }
  };

  const deleteUser = (user) => {
    Alert.alert(
      'Excluir conta',
      'Tem certeza que deseja remover ' + user.name + ' do grupo de consumo?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => deleteIfNotSelfDeletion(user),
        },
      ]
    );
  };

  const openDetails = (item) => {
    console.log('[User List ]Cheguei no OpenDetails');
    navigation.navigate('UserDetailScreen', {
      user: {
        id: item.id,
        authId: item.authId,
        name: item.name,
        email: item.email,
        phoneNumber: item.phoneNumber,
        role: item.role,
        balance: item.balance,
      },
    });
    console.log('[User List ]Sai do OpenDetails');
  };

  const editUser = (item) => {
    const user = {
      id: item.id,
      authId: item.authId,
      name: item.name,
      email: item.email,
      phoneNumber: item.phoneNumber,
      role: item.role,
      balance: item.balance,
    };

    navigation.navigate('CreateUser', { user });
  };

  const renderItem = (data) => (
    <TouchableHighlight
      onPress={() => openDetails(data.item, navigation)}
      style={styles.rowFront}
      underlayColor={'#ddd'}
    >
      <View style={styles.itemContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>{data.item.name}</Text>
          {/* <Text style={styles.itemSubtitle}>{data.item.phoneNumber}</Text> */}
        </View>
        <View style={styles.iconContainer}>
          <FontAwesome5 name="user-edit" size={24} color={Colors.secondary} />

          {/* <Feather name="chevron-right" size={18} color="#ddd" /> */}
        </View>
      </View>
    </TouchableHighlight>
  );

  const renderHiddenItem = (data, rowMap) => {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnLeft]}
          onPress={() => editUser(data.item)}
        >
          <Text style={styles.backTextWhite}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => deleteUser(data.item)}
        >
          <Text style={styles.backTextWhite}>Remover</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SwipeListView
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        disableRightSwipe
        rightOpenValue={-150}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={3000}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#f2f2f2',
    borderColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  list: {
    flex: 1,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  itemSubtitle: {
    marginTop: 2,
    fontSize: 14,
  },
  backTextWhite: {
    color: '#FFF',
  },
  itemContainer: {
    // paddingLeft: 20,
    padding: 15,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
  },
  rowFront: {
    backgroundColor: '#f2f2f2',
    borderColor: '#ddd',
    borderBottomWidth: 0.5,
    justifyContent: 'center',
    height: 60,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: '#4068ed',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: '#fc5951',
    right: 0,
  },
  iconContainer: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});

export default UsersList;

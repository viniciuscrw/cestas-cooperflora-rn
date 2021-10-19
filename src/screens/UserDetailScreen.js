import React from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import TextInformation from '../components/TextInformation';
import TextLink from '../components/TextLink';
import { FontAwesome, FontAwesome5, Entypo, AntDesign, Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const UserDetailScreen = (props) => {
  // const user = navigation.getParam('user');
  const user = props.route.params.user;
  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} maximumZoomScale={1.25}>
        <View style={styles.optionsContainer}>
          <Ionicons style={styles.iconButton} name="chevron-back" size={24} color={Colors.secondary} onPress={() => props.navigation.goBack(null)} />
          <AntDesign
            name="form"
            size={27}
            color={Colors.secondary}
            onPress={() => props.navigation.navigate('CreateUserScreen', { user })}
            style={styles.iconButton}
          />
          {/* <TextLink
            text="Editar"
            onPress={() => props.navigation.navigate('CreateUserScreen', { user })}
            style={styles.editButton}
          /> */}
          {/*<TextLink*/}
          {/*  text="Adicionar Saldo"*/}
          {/*  onPress={() => navigation.goBack(null)}*/}
          {/*  style={styles.increaseBalanceButton}*/}
          {/*/>*/}
        </View>
        {/* <TextLink
          text="Voltar"
          onPress={() => props.navigation.goBack(null)}
          style={styles.backButton}
        /> */}
        <View style={styles.userDataContainer}>
          <View style={styles.dataContainer}>
            <View style={styles.iconContainer}>
              <FontAwesome name="user" size={24} color={Colors.secondary} />
            </View>
            <Text style={styles.text}>{user.name}</Text>
          </View>
          <View style={styles.dataContainer}>
            <View style={styles.iconContainer}>
              <Entypo name="email" size={24} color={Colors.secondary} />
            </View>
            <Text style={styles.text}>{user.email}</Text>
          </View>
          <View style={styles.dataContainer}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="phone" size={24} color={Colors.secondary} />
            </View>
            <Text style={styles.text}>{user.phoneNumber}</Text>
          </View>
          <View style={styles.dataContainer}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="dollar-sign" size={24} color={Colors.secondary} />
            </View>
            <Text style={styles.text}>Saldo: {`R$ ${user.balance}`}</Text>
          </View>
        </View>
      </ScrollView >
    </View >
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop: 4,
    backgroundColor: 'white',
    // paddingLeft: 25,
    // paddingRight: 25,
    // borderRadius: 25,
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
    marginTop: 20
  },
  optionsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "flex-end",
  },
  iconButton: {
    padding: 10
  },
  // editButton: {
  //   alignSelf: 'flex-end',
  // },
  // backButton: {
  //   alignSelf: 'flex-end',
  // },
  userDataContainer: {
    marginLeft: 15
  },
  dataContainer: {
    flexDirection: 'row'
  },
  text: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
    color: '#505050',
    padding: 5
  },
  iconContainer: {
    alignContent: 'center',
    height: 40,
    width: '10%'
  },
  icon: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
  },
  // container: {
  //   flex: 1,
  //   padding: 10,
  //   backgroundColor: '#ebebeb',
  //   marginTop: -8,
  // },
  // increaseBalanceButton: {
  //   marginRight: 20,
  //   marginTop: -20,
  //   alignSelf: 'flex-end',
  // },
});

export default UserDetailScreen;

import React from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import TextInformation from '../components/TextInformation';
import TextLink from '../components/TextLink';

const UserDetailScreen = ( props ) => {
  // const user = navigation.getParam('user');
  const user = props.route.params.user;
  return (
    <ScrollView style={styles.container} maximumZoomScale={1.25}>
      <TextLink
        text="Voltar"
        onPress={() => props.navigation.goBack(null)}
        style={styles.backButton}
      />
      <TextInformation title="Nome" text={user.name} />
      <TextInformation title="E-mail" text={user.email} />
      <TextInformation title="Telefone" text={user.phoneNumber} />
      <TextInformation title="Saldo" text={`R$ ${user.balance}`} />
      <View style={styles.optionsContainer}>
        <TextLink
          text="Editar"
          onPress={() => props.navigation.navigate('CreateUserScreen', { user })}
          style={styles.editButton}
        />
        {/*<TextLink*/}
        {/*  text="Adicionar Saldo"*/}
        {/*  onPress={() => navigation.goBack(null)}*/}
        {/*  style={styles.increaseBalanceButton}*/}
        {/*/>*/}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ebebeb',
    marginTop: -8,
  },
  backButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: 20,
    right: 20,
  },
  optionsContainer: {
    flex: 1,
  },
  // increaseBalanceButton: {
  //   marginRight: 20,
  //   marginTop: -20,
  //   alignSelf: 'flex-end',
  // },
  editButton: {
    marginTop: 70,
    marginLeft: 5,
    alignSelf: 'flex-start',
  },
});

export default UserDetailScreen;

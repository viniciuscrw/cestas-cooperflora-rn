import React, { useContext, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { Context as UserContext } from '../context/UserContext';
import Spinner from '../components/Spinner';
import GLOBALS from '../Globals';
import TextLink from '../components/TextLink';
import Colors from '../constants/Colors';

const CreateUserScreen = (props) => {
  // const user = props.navigation.getParam('user');
  const user = props.route.params.user;
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phoneNumber, setPhoneNumber] = useState(user ? user.phoneNumber : '');
  const { state, createUser, updateUser, findUserByEmail } =
    useContext(UserContext);
  const emailTextInput = React.createRef();
  const phoneNumberTextInput = React.createRef();

  // const userRole = user ? user.role : navigation.getParam('role');
  const userRole = user ? user.role : props.route.params.role;
  const authenticatedUser = !!(user && user.authId);
  const roleText =
    userRole === GLOBALS.USER.ROLE.CONSUMER
      ? 'pessoa consumidora'
      : 'pessoa organizadora';
  let title = user ? 'Editar ' + roleText : 'Nova ' + roleText;

  const isInvalidEmail = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return email.length > 0 && !reg.test(email);
  };

  const alertExistingEmail = (email) => {
    Alert.alert(
      'Aviso',
      'Já existe uma pessoa cadastrada com e-mail ' + email,
      [
        {
          text: 'OK',
        },
      ]
    );
  };

  const createOrUpdateUser = () => {
    if (user) {
      findUserByEmail(email).then((existingUser) => {
        if (existingUser && existingUser.id !== user.id) {
          alertExistingEmail(email);
        } else {
          updateUser(user.id, name, email, phoneNumber, userRole);
        }
      });
    } else {
      findUserByEmail(email).then((existingUser) => {
        if (existingUser) {
          alertExistingEmail(email);
        } else {
          createUser(name, email, phoneNumber, userRole);
        }
      });
    }
    props.navigation.goBack(null);
  };

  const renderButton = () => {
    if (name.length && email.length && !isInvalidEmail()) {
      return state.loading ? (
        <Spinner size="small" />
      ) : (
        <View style={styles.buttonContainer}>
          <Button
            id="addUpdateUser"
            style={styles.button}
            textColor="white"
            onPress={createOrUpdateUser}
          >
            {user ? 'Atualizar Informações' : `Adicionar ${roleText}`}
          </Button>
        </View>
      );
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
            }}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            enabled
            keyboardVerticalOffset={100}
          >
            <ScrollView style={styles.dataContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <TextLink
                  text="Cancelar"
                  onPress={() => props.navigation.goBack(null)}
                  style={styles.cancelButton}
                />
              </View>
              <FormInput
                id="name"
                label="Nome"
                value={name}
                returnKeyType="next"
                onChangeText={setName}
                onSubmitEditing={() => emailTextInput.current.focus()}
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={50}
              />
              <FormInput
                id="e-mail"
                label="E-mail"
                value={email}
                reference={emailTextInput}
                returnKeyType="next"
                onChangeText={setEmail}
                onSubmitEditing={() => phoneNumberTextInput.current.focus()}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={50}
                disabled={authenticatedUser}
                hasError={isInvalidEmail()}
                errorMessage="Endereço de e-mail inválido."
              />
              <FormInput
                id="mobile"
                label="Celular"
                value={phoneNumber}
                returnKeyType="done"
                reference={phoneNumberTextInput}
                maxLength={25}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
              {renderButton()}
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
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
    // backgroundColor: '#F0F5F9',
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
  },
  title: {
    color: '#101010',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 5,
  },
  cancelButton: {
    marginRight: 6,
    // marginTop: 5,
  },
  buttonContainer: {
    // position: 'absolute',
    width: '100%',
    // bottom: 0,
  },
  button: {
    marginTop: 5,
    backgroundColor: Colors.secondary,
    alignSelf: 'center',
  },
});

export default CreateUserScreen;

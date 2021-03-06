import React, { useContext, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Spacer from '../components/Spacer';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { Context as UserContext } from '../context/UserContext';
import { Context as AuthContext } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { Dialog } from 'react-native-simple-dialogs';
import TextLink from '../components/TextLink';
import LoadingButton from '../components/LoadingButton';

const UpdateAccountInfoScreen = ({ navigation }) => {
  const user = navigation.getParam('user');
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(user ? user.phoneNumber : '');
  const [dialogVisible, setDialogVisible] = useState(false);
  const {
    state: { loading },
    findUserByEmail,
  } = useContext(UserContext);
  const { state, updateAccount, clearError } = useContext(AuthContext);

  const emailTextInput = React.createRef();
  const phoneNumberTextInput = React.createRef();

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

  const updateUserInfo = () => {
    if (user) {
      findUserByEmail(email).then((existingUser) => {
        if (existingUser && existingUser.id !== user.id) {
          alertExistingEmail(email);
        } else {
          if (email !== user.email) {
            setDialogVisible(true);
          } else {
            updateAccount(user.email, password, {
              id: user.id,
              name,
              email,
              phoneNumber,
            });
          }
        }
      });
    }
  };

  const renderPasswordDialog = () => {
    return (
      <Dialog
        visible={dialogVisible}
        title="Digite sua senha"
        onTouchOutside={() => setDialogVisible(false)}
      >
        <View>
          <Text style={styles.dialogText}>
            Para alterar o e-mail, é necessário informar sua senha:
          </Text>
          <FormInput
            placeholder="Senha"
            value={password}
            onChangeText={(password) => {
              clearError();
              setPassword(password);
            }}
            returnKeyType="done"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            fontSize={14}
          />
          {state.errorMessage ? (
            <Text style={styles.errorMessage}>{state.errorMessage}</Text>
          ) : null}
          {state.loading ? null : (
            <View style={styles.dialogButtonsContainer}>
              <TextLink
                textStyle={styles.dialogCancelButton}
                text="Cancelar"
                onPress={() => setDialogVisible(false)}
              />
              <TextLink
                text="OK"
                onPress={() =>
                  updateAccount(user.email, password, {
                    id: user.id,
                    name,
                    email,
                    phoneNumber,
                  })
                }
              />
            </View>
          )}
        </View>
      </Dialog>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        enabled
        keyboardVerticalOffset={100}
      >
        <ScrollView style={styles.container}>
          <Spacer />
          <FormInput
            label="Nome"
            value={name}
            returnKeyType="next"
            onChangeText={setName}
            onSubmitEditing={() => emailTextInput.current.focus()}
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={50}
          />
          <Spacer />
          <FormInput
            label="E-mail"
            value={email}
            reference={emailTextInput}
            returnKeyType="next"
            onChangeText={setEmail}
            onSubmitEditing={() => phoneNumberTextInput.current.focus()}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={50}
            hasError={isInvalidEmail()}
            errorMessage="Endereço de e-mail inválido."
          />
          <Spacer />
          <FormInput
            label="Celular"
            value={phoneNumber}
            returnKeyType="done"
            reference={phoneNumberTextInput}
            maxLength={18}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <Spacer />
          {renderPasswordDialog()}
          <LoadingButton
            onPress={updateUserInfo}
            loading={state.loading || loading}
          >
            Atualizar informações
          </LoadingButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#101010',
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 5,
  },
  cancelButton: {
    marginRight: 15,
    marginTop: 10,
  },
  dialogText: {
    marginBottom: 7,
  },
  dialogButtonsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dialogCancelButton: {
    fontWeight: 'bold',
  },
  errorMessage: {
    fontSize: 14,
    color: 'red',
    marginBottom: 10,
    marginLeft: 10,
    marginTop: -8,
  },
});

export default UpdateAccountInfoScreen;

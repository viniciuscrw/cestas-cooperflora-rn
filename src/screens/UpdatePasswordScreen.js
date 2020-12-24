import React, { useContext, useState } from 'react';
import {
  Text,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Spacer from '../components/Spacer';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { Context as AuthContext } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const UpdatePasswordScreen = ({ navigation }) => {
  const email = navigation.getParam('userEmail');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { state, updatePassword, clearError } = useContext(AuthContext);

  const newPasswordTextInput = React.createRef();

  const updateUserPassword = () => {
    updatePassword(email, password, newPassword);
  };

  const renderButton = () => {
    return state.loading ? (
      <Spinner size="small" />
    ) : (
      <Button onPress={updateUserPassword}>Atualizar senha</Button>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled
        keyboardVerticalOffset={100}
      >
        <ScrollView style={styles.container}>
          <Spacer />
          <FormInput
            label="Digite sua senha atual:"
            value={password}
            returnKeyType="next"
            onChangeText={(password) => {
              setPassword(password);
              if (state.errorMessage) {
                clearError();
              }
            }}
            onSubmitEditing={() => newPasswordTextInput.current.focus()}
            autoCapitalize="words"
            autoCorrect={false}
            secureTextEntry
          />
          <Spacer />
          <FormInput
            label="Nova senha:"
            value={newPassword}
            reference={newPasswordTextInput}
            returnKeyType="done"
            onChangeText={(newPassword) => {
              setNewPassword(newPassword);
              if (state.errorMessage) {
                clearError();
              }
            }}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />
          {state.errorMessage ? (
            <Text style={styles.errorMessage}>{state.errorMessage}</Text>
          ) : null}
          <Spacer />
          {renderButton()}
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
  errorMessage: {
    fontSize: 16,
    color: 'red',
    marginLeft: 15,
  },
});

export default UpdatePasswordScreen;

import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import Spacer from '../components/Spacer';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Divider from '../components/Divider';
import { Context as AuthContext } from '../context/AuthContext';
import HeaderTitle from '../components/HeaderTitle';
import BackArrow from '../components/BackArrow';
import Spinner from '../components/Spinner';
import Colors from '../constants/Colors';
import { stardardScreenStyle as screen } from './screenstyles/ScreenStyles';

const UpdatePasswordScreen = ({ route }) => {
  const email = route.params.userEmail;
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
      <View style={styles.confirmContainer}>
        <Divider style={{ borderBottomColor: Colors.secondary }} />
        <Button
          id="updateUserPasswordButton"
          style={styles.confirmButton}
          textColor="white"
          onPress={updateUserPassword}
        >
          Atualizar Senha
        </Button>
      </View>
    );
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
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            enabled
            keyboardVerticalOffset={100}
          >
            <ScrollView>
              <Spacer />
              <FormInput
                id="currentpassword"
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
                id="newpassword"
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
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
        {renderButton()}
      </View>
    </View>
  );
};

export const updatePasswordScreenOptions = () => {
  return {
    headerTitle: () => (
      <View style={styles.header}>
        <HeaderTitle title="Atualizar Senha" />
      </View>
    ),
    headerBackImage: () => <BackArrow />,
    headerStyle: {
      backgroundColor: 'transparent',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
  };
};

const styles = StyleSheet.create({
  screen,
  container: {
    flex: 1,
    margin: 25,
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    marginLeft: 15,
  },
  confirmContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  confirmButton: {
    marginTop: 5,
    backgroundColor: Colors.primary,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'flex-start',
  },
});

export default UpdatePasswordScreen;

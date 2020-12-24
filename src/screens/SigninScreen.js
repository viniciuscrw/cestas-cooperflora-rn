import React, { useContext, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import Card from '../components/Card';
import CardSection from '../components/CardSection';
import Input from '../components/Input';
import { Context as AuthContext } from '../context/AuthContext';
import { Text } from 'react-native-elements';
import TextCardSection from '../components/TextCardSection';
import PasswordInput from '../components/PasswordInput';
import TextLink from '../components/TextLink';
import { withNavigation } from 'react-navigation';

const SigninScreen = ({ navigation }) => {
  const {
    state,
    signin,
    checkAuthOrUser,
    clearUserInfo,
    clearError,
  } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const renderLoginButton = () => {
    if (state.loading) {
      return <Spinner onLayout={Keyboard.dismiss} size="small" />;
    }

    let userId = state.userId;
    return (
      <Button
        style={styles.loginButton}
        onPress={() => {
          Keyboard.dismiss();
          signin({ email, password, passwordConfirmation, userId });
        }}
      >
        Entrar
      </Button>
    );
  };

  const renderNextButton = () => {
    if (!state.authorized && !state.userId) {
      return (
        <CardSection>
          {state.loading ? (
            <Spinner onLayout={Keyboard.dismiss} size="small" />
          ) : (
            <Button
              style={styles.loginButton}
              onPress={() => checkAuthOrUser({ email })}
            >
              Avançar
            </Button>
          )}
        </CardSection>
      );
    }
  };

  const renderPasswordForm = () => {
    if (state.authorized || state.userId) {
      const styleForMultiplePasswordInput = {
        label: { flex: 1 },
        input: { flex: 1 },
      };

      return (
        <>
          {state.userId ? (
            <TextCardSection text="Cadastre sua senha:">
              <PasswordInput
                label="Senha"
                value={password}
                onChangeText={(password) => {
                  setPassword(password);
                  if (state.errorMessage) {
                    clearError();
                  }
                }}
                autoFocus
                style={styleForMultiplePasswordInput}
              />
              <PasswordInput
                label="Confimar senha"
                value={passwordConfirmation}
                onChangeText={(passwordConfirmation) => {
                  setPasswordConfirmation(passwordConfirmation);
                  if (state.errorMessage) {
                    clearError();
                  }
                }}
                style={styleForMultiplePasswordInput}
              />
            </TextCardSection>
          ) : (
            <CardSection>
              <PasswordInput
                label="Senha"
                value={password}
                onChangeText={(password) => {
                  setPassword(password);
                  if (state.errorMessage) {
                    clearError();
                  }
                }}
                autoFocus
              />
            </CardSection>
          )}
          <CardSection>{renderLoginButton()}</CardSection>
        </>
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.backGroundView}>
        <View style={styles.container}>
          <Text style={styles.title}>Cestas Cooperflora</Text>
          <Card style={styles.card}>
            <CardSection>
              <Input
                placeholder="exemplo@email.com"
                label="E-mail"
                value={email}
                onChangeText={(email) => {
                  setEmail(email);
                  if (state.userId || state.authorized) {
                    clearUserInfo();
                  }
                  if (state.errorMessage) {
                    clearError();
                  }
                }}
              />
            </CardSection>
            {renderNextButton()}
            {renderPasswordForm()}
          </Card>
          {state.errorMessage ? (
            <Text style={styles.errorMessage}>{state.errorMessage}</Text>
          ) : null}
          {state.authorized ? (
            <TextLink
              text="Esqueceu sua senha?"
              size={16}
              onPress={() =>
                navigation.navigate('ForgotPassword', { email: email })
              }
              style={styles.forgotPasswordLink}
            />
          ) : null}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  backGroundView: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    bottom: 30,
  },
  title: {
    fontSize: 30,
    bottom: 40,
    textAlign: 'center',
  },
  loginButton: {
    flex: 1,
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    marginLeft: 15,
    marginTop: 15,
  },
  forgotPasswordLink: {
    padding: 15,
    top: 10,
  },
});

export default withNavigation(SigninScreen);

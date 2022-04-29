import React, { useContext, useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Image, View } from 'react-native';
import { Text } from 'react-native-elements';
import { Feather } from '@expo/vector-icons';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import Input from '../components/Input';
import { Context as AuthContext } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';
import TextLink from '../components/TextLink';
import BasketProductsImage from '../../assets/images/basketproducts3.png';
import mstLogo from '../../assets/images/logomst.png';
import ifspLogo from '../../assets/images/logoifspcampinas.png';
import cooperfloraLogo from '../../assets/images/logocooperflora.png';
import Colors from '../constants/Colors';
import Globals from '../Globals';

const SigninScreen = ({ navigation }) => {
  const { state, signin, checkAuthOrUser, clearUserInfo, clearError } =
    useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const renderLoginButton = () => {
    if (state.loading) {
      return <Spinner onLayout={Keyboard.dismiss} size="small" />;
    }
    const { userId } = state;
    return (
      <View style={styles.buttonContainer}>
        <Button
          id="enterLoginButton"
          style={styles.button}
          textColor="white"
          onPress={() => {
            // Keyboard.dismiss();
            signin({ email, password, passwordConfirmation, userId });
          }}
        >
          Entrar
        </Button>
      </View>
    );
  };

  const renderNextButton = () => {
    if (!state.authorized && !state.userId) {
      return state.loading ? (
        <Spinner onLayout={Keyboard.dismiss} size="small" />
      ) : (
        <View style={styles.buttonContainer}>
          <Button
            id="loginButton"
            style={styles.button}
            textColor="white"
            onPress={() => checkAuthOrUser({ email })}
          >
            Avançar
          </Button>
        </View>
      );
    }
  };

  const renderPasswordForm = () => {
    if (state.authorized || state.userId) {
      // const styleForMultiplePasswordInput = {
      //   label: { flex: 1 },
      //   input: { flex: 1 },
      // };

      return (
        <>
          {state.userId ? (
            <View style={styles.passwordsContainer}>
              {/* <Text>Cadastre sua senha:</Text> */}
              <View style={styles.newPasswordContainer}>
                <View style={styles.passwordContainer}>
                  <PasswordInput
                    id="password"
                    label="Senha:"
                    value={password}
                    onChangeText={(pass) => {
                      setPassword(pass);
                      if (state.errorMessage) {
                        clearError();
                      }
                    }}
                    autoFocus
                    secureTextEntry={secureTextEntry}
                  />
                  <View style={styles.iconContainer}>
                    <Feather
                      name={secureTextEntry ? 'eye-off' : 'eye'}
                      size={24}
                      color={Colors.primary}
                      onPress={() => setSecureTextEntry(!secureTextEntry)}
                    />
                  </View>
                </View>
              </View>
              <PasswordInput
                id="confirmpassword"
                style={{
                  borderBottomColor: 'black',
                  borderBottomWidth: 1,
                  width: 305,
                  alignSelf: 'center',
                }}
                label="Confimar senha:"
                value={passwordConfirmation}
                // eslint-disable-next-line no-shadow
                onChangeText={(passwordConfirmation) => {
                  setPasswordConfirmation(passwordConfirmation);
                  if (state.errorMessage) {
                    clearError();
                  }
                }}
                secureTextEntry={secureTextEntry}
              />
            </View>
          ) : (
            <View style={styles.passwordContainer}>
              <PasswordInput
                label="Senha:"
                value={password}
                secureTextEntry={secureTextEntry}
                onChangeText={(pass) => {
                  setPassword(pass);
                  if (state.errorMessage) {
                    clearError();
                  }
                }}
                autoFocus
              />
              <View style={styles.iconContainer}>
                <Feather
                  name={secureTextEntry ? 'eye-off' : 'eye'}
                  size={24}
                  color={Colors.primary}
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                />
              </View>
            </View>
          )}
          <View style={styles.divider} />
          {renderLoginButton()}
        </>
      );
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.textTitle}>Cestas Cooperflora</Text>
          <Image style={styles.image} source={BasketProductsImage} />
        </View>
        <View>
          <View style={styles.emailInputContainer}>
            <Input
              label="E-mail:"
              value={email}
              onChangeText={(email) => {
                setEmail(email.replace(' ', ''));
                if (state.userId || state.authorized) {
                  clearUserInfo();
                }
                if (state.errorMessage) {
                  clearError();
                }
              }}
            />
            <View style={styles.divider} />
          </View>
          {renderNextButton()}
          {renderPasswordForm()}
          {state.authorized ? (
            <TextLink
              style={styles.forgotPasswordLink}
              text="Esqueceu sua senha?"
              size={16}
              onPress={() => navigation.navigate('ForgotPassword', { email })}
            />
          ) : null}
        </View>
        {state.errorMessage ? (
          <Text style={styles.errorMessage}>{state.errorMessage}</Text>
        ) : null}
        <View style={styles.textContainer}>
          <Text style={styles.descriptionText}>
            {Globals.APP.INITIALSCREEN_TEXT}
          </Text>
        </View>
        <View style={styles.logosContainer}>
          <View style={styles.logoContainer}>
            <Image style={styles.logoImage} source={ifspLogo} />
          </View>
          <View style={styles.logoContainer}>
            <Image style={styles.logoImage} source={cooperfloraLogo} />
          </View>
          <View style={styles.logoContainer}>
            <Image style={styles.logoImage} source={mstLogo} />
          </View>
        </View>
      </View>
    </View>
  );
};

export const signinScreenOptions = () => {
  return {
    headerShown: false,
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 25,
  },
  container: {
    flex: 1,
    marginTop: 30,
  },
  textTitle: {
    fontSize: 35,
    color: '#2D6535',
    fontWeight: 'bold',
    right: '-48%',
    textAlign: 'right',
    width: '50%',
  },
  image: {
    marginLeft: 5,
    marginTop: -30,
    width: 250,
  },
  // title: {
  //   fontSize: 30,
  //   bottom: 40,
  //   textAlign: 'center',
  // },
  emailInputContainer: {
    height: 50,
  },
  passwordsContainer: {
    height: 80,
  },
  passwordContainer: {
    flexDirection: 'row',
    marginRight: 40,
    height: 50,
  },
  newPasswordContainer: {
    margin: 0,
  },
  divider: {
    borderBottomColor: '#8898AA',
    borderBottomWidth: 1,
    width: '80%',
    alignSelf: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    marginTop: 5,
    backgroundColor: Colors.primary,
    alignSelf: 'center',
  },
  textContainer: {
    margin: 20,
  },
  descriptionText: {
    fontSize: 20,
    color: '#8898AA',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  // smallTitle: {
  //   fontSize: 20,
  //   bottom: 20,
  //   textAlign: 'center',
  // },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    marginLeft: 15,
    marginTop: 15,
  },
  forgotPasswordLink: {
    color: '#8898AA',
    fontSize: 58,
    padding: 9,
    marginLeft: 20,
  },
  logosContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
  },
  logoContainer: {
    flex: 1,
    margin: 5,
    alignContent: 'center',
    justifyContent: 'center',
    width: '40%',
    alignSelf: 'center',
  },
  logoImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
  iconContainer: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SigninScreen;

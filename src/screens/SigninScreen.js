import React, { useContext, useEffect, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  View,
  KeyboardAvoidingView
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
import { AntDesign } from '@expo/vector-icons';
import BasketProductsImage from '../../assets/images/basketproducts3.png';
import Colors from '../constants/Colors';

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
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);


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
    let userId = state.userId;
    return (
      <View style={styles.buttonContainer}>
        <Button style={styles.button}
          textColor='white'
          onPress={() => {
            // Keyboard.dismiss();
            signin({ email, password, passwordConfirmation, userId });
          }}>
          Entrar
        </Button>
      </View>
    );
  };

  const renderNextButton = () => {
    if (!state.authorized && !state.userId) {
      return (
        state.loading ? (
          <Spinner onLayout={Keyboard.dismiss} size="small" />
        ) : (
          <View style={styles.buttonContainer}>
            <Button style={styles.button}
              textColor='white'
              onPress={() => checkAuthOrUser({ email })}>
              Avançar
            </Button>
          </View>
        )
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
                style={{
                  borderBottomColor: 'black',
                  borderBottomWidth: 1,
                  width: 305,
                  //alignContent: 'center',
                  //alignItems: 'center',
                  alignSelf: 'center'

                }}
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
            <View style={styles.inputContainer}>
              <PasswordInput
                label="Senha:"
                value={password}
                onChangeText={(password) => {
                  setPassword(password);
                  if (state.errorMessage) {
                    clearError();
                  }
                }}
                autoFocus
              />
            </View>
          )}
          <View style={styles.divider}></View>
          {renderLoginButton()}
        </>
      );
    }
  };

  return (
    <View style={styles.screen} >
      <View style={styles.container} >
        <View style={styles.header}>
          <Text style={styles.textTitle}>
            Cestas Cooperflora
          </Text>
          <Image
            style={styles.image}
            source={BasketProductsImage}
          />
        </View>

        <View>
          <View style={styles.inputContainer}>
            <Input
              label='E-mail:'
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
            <View style={styles.divider} />
          </View>
          {renderNextButton()}

          {renderPasswordForm()}
          {state.authorized ? (
            <TextLink
              style={styles.forgotPasswordLink}
              text="Esqueceu sua senha?"
              size={16}
              onPress={() =>
                navigation.navigate('ForgotPassword', { email: email })
              }
            />
          ) : null}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.descriptionText}>
            A Cooperflora é uma cooperativa que produz
            e comercializa produtos orgânicos do assentamento
            Milton Santos em Americana.
          </Text>
        </View>
        {state.errorMessage ? (
          <Text style={styles.errorMessage}>{state.errorMessage}</Text>
        ) : null}
      </View>
    </View >
  );
};

export const signinScreenOptions = (navData) => {
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
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 25
  },
  container: {
    flex: 1,
    marginTop: 30,
  },
  controlContainer: {
    flex: 1,
  },
  header: {
    // flex: 1,
    // left: -33,
    // alignSelf: 'center',
    // top: -60,
    // width: 250,
    // height: 150,
    // zIndex: 2
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
  title: {
    fontSize: 30,
    bottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    height: 50,
  },
  divider: {
    borderBottomColor: '#8898AA',
    borderBottomWidth: 1,
    width: '80%',
    alignSelf: 'center'
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
    margin: 20
  },
  descriptionText: {
    fontSize: 20,
    color: '#8898AA',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  smallTitle: {
    fontSize: 20,
    bottom: 20,
    textAlign: 'center',
  },
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
  }
});

export default SigninScreen;
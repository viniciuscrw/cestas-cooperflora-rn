import React, { useContext, useEffect, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
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
import { AntDesign } from '@expo/vector-icons';
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
      <Button
        style={styles.loginButton}
        onPress={() => {
          Keyboard.dismiss();
          signin({ email, password, passwordConfirmation, userId });
        }}
      >
        <Text style={styles.text}> Entrar </Text>
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
              <Text style={styles.text}> Avançar </Text>
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
          <View
            style={{
                left:-33,
                alignSelf: 'center',
                //marginBottom: 210,
                top: -90,
                width: 250,
                height: 150,
                zIndex: 2
            }}
          >
              <Text style={styles.textTitle}>
                Cestas Cooperflora
              </Text>
              <Image
                style={{
                  width: '100%',
                  height: '100%'
                  }}
                source={require('../../assets/images/backetproducts.png')}
              />
        </View>  
            <CardSection style={styles.cardstyle}>
              <Input style={styles.text}
                placeholder="exemplo@email.com"
                label="E-mail:"
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
            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: 1,
              }}
            />
            <View><Text></Text></View>
            {renderNextButton()}
            {renderPasswordForm()}
            <View><Text></Text></View>
            <View><Text></Text></View>
            <View 
              style={{
                //padding: 2, 
                alignItems: 'center', 
                width: 315,
                right: -18
              }}
            >
              <View><Text></Text></View>
              <Text style={styles.textText}>
                A Cooperflora é uma cooperativa que produz 
                  e comercializa produtos orgânicos do assentamento
                  Milton Santos em Americana.
              </Text>
            </View>
            {/* <View>
              <Image
                style={{
                  width: 70,
                  height: 50
                }} 
                source={require('../../assets/images/logo.png')}
              />
              <Image
                style={{
                  width: 70,
                  height: 50
                }}  
                source={require('../../assets/images/basketproducts2.png')}
              />
            </View> */}
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
    // bottom: 10,
  },
  title: {
    fontSize: 30,
    bottom: 40,
    textAlign: 'center',
  },
  smallTitle: {
    fontSize: 20,
    bottom: 20,
    textAlign: 'center',
  },
  loginButton: {
    flex: 1,
    backgroundColor: '#38C54C',
    // color: '#ffffff'
    borderColor: 'black',
    shadowRadius: 2
  },
  cardstyle: {
    backgroundColor: '#F0F5F9',
    top: -90
    // color: '#ffffff'
    //borderColor: 'black',
  },
  text:{
    //backgroundColor: '#87dc93',
    color: 'white',
    fontWeight: 'bold',
    
  },
  textTitle:{
    fontSize: 24,
    color: '#2D6535',
    fontWeight: 'bold',
    top: -18,
    right: -90 
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    marginLeft: 15,
    marginTop: 15,
  },
  forgotPasswordLink: {
    padding: 9,
    top: 5,
  },
  textText:{
    fontSize: 16,
    textAlign: 'center'
    //fontWeight: 'bold'
  }
});

export default withNavigation(SigninScreen);

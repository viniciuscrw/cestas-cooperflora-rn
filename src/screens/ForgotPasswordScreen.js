import React, { useContext, useState } from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FormInput from '../components/FormInput';
import Spacer from '../components/Spacer';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import { Context as AuthContext } from '../context/AuthContext';
import HeaderTitle from '../components/HeaderTitle';
import BackArrow from '../components/BackArrow';
import Colors from '../constants/Colors';

const ForgotPasswordScreen = ({ navigation, route }) => {
  const { state, resetPassword, clearError } = useContext(AuthContext);
  const signinEmail = route.params.email;
  const [email, setEmail] = useState(signinEmail);

  const onHandleResetPassword = () => {
    Keyboard.dismiss();
    resetPassword(email);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.backGroundView}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <FormInput
              id="e-mail"
              label="Digite seu e-mail:"
              value={email}
              returnKeyType="next"
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              errorMessage="Endereço de e-mail inválido."
            />
            {state.errorMessage ? (
              <Text style={styles.errorMessage}>{state.errorMessage}</Text>
            ) : null}
            <Spacer />
            <View style={styles.resetButtonContainer}>
              <Button
                id="resetPasswordButton"
                style={styles.resetButton}
                textColor="white"
                onPress={onHandleResetPassword}
              >
                Redefinir senha
              </Button>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
//cooperflorabarao@gmail.com

export const forgotPasswordScreenOptions = (props) => {
  return {
    headerTitle: () => (
      <View style={styles.header}>
        <HeaderTitle title="Esqueci Minha Senha" />
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
  backGroundView: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 50,
    marginLeft: 15,
    backgroundColor: 'white',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    marginLeft: 15,
    marginTop: 15,
  },
  resetButtonContainer: {
    // position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  resetButton: {
    marginTop: 5,
    backgroundColor: Colors.primary,
    alignSelf: 'center',
  },
});

export default ForgotPasswordScreen;

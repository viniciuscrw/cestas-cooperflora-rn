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
import { withNavigation } from 'react-navigation';
import TextLink from '../components/TextLink';

const ForgotPasswordScreen = ({ navigation }) => {
  const { state, resetPassword, clearError } = useContext(AuthContext);
  const signinEmail = navigation.getParam('email');
  const [email, setEmail] = useState(signinEmail);

  const renderButton = () => {
    return state.loading ? (
      <Spinner size="small" />
    ) : (
      <Button
        onPress={() => {
          Keyboard.dismiss();
          resetPassword(email);
        }}
      >
        Redefinir senha
      </Button>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.backGroundView}>
        <View style={styles.container}>
          <TextLink
            text="< Voltar"
            onPress={() => {
              clearError();
              navigation.goBack(null);
            }}
            style={styles.backButton}
          />
          <View style={styles.innerContainer}>
            <FormInput
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
            {renderButton()}
          </View>
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
});

export default withNavigation(ForgotPasswordScreen);

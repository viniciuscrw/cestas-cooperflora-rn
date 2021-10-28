import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firebase from 'firebase';
import CardSection from './CardSection';
import Spinner from './Spinner';
import Button from './Button';
import Card from './Card';
import Input from './Input';
import Header from './Header';
import { accessibilityLabel } from '../utils';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onLoginFail = () => {
    setError('Auth failed.');
    setLoading(false);
  };

  const onLoginSuccess = () => {
    setEmail('');
    setPassword('');
    setError('');
    setLoading(false);
  };

  const onButtonPress = () => {
    setError('');
    setLoading(true);

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(onLoginSuccess.bind(this))
      .catch(() => {
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(onLoginSuccess.bind(this))
          .catch(onLoginFail.bind(this));
      });
  };

  const renderButton = () => {
    if (loading) {
      return <Spinner size="small" />;
    }

    return <Button onPress={onButtonPress()}>Login</Button>;
  };

  console.log(accessibilityLabel);

  return (
    <View>
      <Header headerText="Authentication" />
      <Card>
        <CardSection>
          <Input
            id="e-mail"
            placeholder="user@gmail.com"
            label="Email"
            value={email}
            onChangeText={(email) => setEmail(email)}
          />
        </CardSection>

        <CardSection>
          <Input
            id="password"
            placeholder="password"
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={(password) => setPassword(password)}
          />
        </CardSection>

        <Text style={styles.errorText}>{error}</Text>

        <CardSection>{renderButton()}</CardSection>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red',
  },
});

export default LoginForm;

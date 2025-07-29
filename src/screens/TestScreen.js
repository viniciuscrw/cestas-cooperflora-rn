import React, { useContext, useEffect, useState } from 'react';
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
import { Text } from '@rneui/themed';
import TextCardSection from '../components/TextCardSection';
import PasswordInput from '../components/PasswordInput';
import TextLink from '../components/TextLink';

const TestScreen = ({ navigation }) => {
  
  return (
      <View style={styles.backGroundView}>
        <View style={styles.container}>
            <Text>Teste</Text>
        </View>
      </View>
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
  }
});

export default TestScreen;

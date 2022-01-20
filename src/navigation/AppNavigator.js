import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator, MainNavigator } from './MainNavigation';
import { Context as AuthContext } from '../context/AuthContext';
import { navigationRef } from '../navigationRef';

const AppNavigator = () => {
  const { state } = useContext(AuthContext);
  const { authId } = state;

  if (authId) {
    console.log('user logged in');
  } else {
    console.log('user logged off');
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {!authId ? <AuthNavigator /> : <MainNavigator />}
      {/* <MainNavigator /> */}
    </NavigationContainer>
  );
};

export default AppNavigator;

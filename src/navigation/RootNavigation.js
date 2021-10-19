import React from 'react';
import SigninScreen from '../screens/SigninScreen';
import MainNavigation from './MainNavigation';
// import { createSwitchNavigator } from 'react-navigation';

const RootStackNavigator = createSwitchNavigator({
  Login: {
    screen: SigninScreen,
  },
  Main: {
    screen: MainNavigation,
  },
});

export default RootStackNavigator;

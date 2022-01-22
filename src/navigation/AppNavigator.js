import React, { useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator, MainNavigator } from './MainNavigation';
import { Context as AuthContext } from '../context/AuthContext';
import IntroSlider from '../screens/IntroSlider';

const AppNavigator = () => {
  const [showIntroSlider, setShowIntroSlider] = useState(true);
  const { state } = useContext(AuthContext);
  const { authId } = state;

  if (authId) {
    console.log('user logged in');
  } else {
    console.log('user logged off');
  }

  if (showIntroSlider) {
    return <IntroSlider setIntroSlider={setShowIntroSlider} />;
  }

  return (
    <NavigationContainer>
      {!authId ? <AuthNavigator /> : <MainNavigator />}
      {/* <AccountNavigator /> */}
      {/* <MainNavigator /> */}
      {/* <ConsumerGroupNavigator /> */}
    </NavigationContainer>
  );
};

export default AppNavigator;

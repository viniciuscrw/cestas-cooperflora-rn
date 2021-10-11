import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator, MainNavigator } from './MainNavigation';
import { Context as AuthContext } from '../context/AuthContext';

const AppNavigator = (props) => {
    const { state } = useContext(AuthContext);
    const authId = state.authId;

    if (authId) {
        console.log('user logged in');
    } else {
        console.log('user logged off');

    }

    return (
        <NavigationContainer>
            {!authId
                ? <AuthNavigator />
                : <MainNavigator />
            }
            {/* <AccountNavigator /> */}
            {/* <MainNavigator /> */}
            {/* <ConsumerGroupNavigator /> */}
        </NavigationContainer>
    );
};

export default AppNavigator;
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DeliveriesScreen from '../screens/delivery/DeliveriesScreen';

const AppStack = createStackNavigator();

const AppNavigator = (props) => {
    return (
        <NavigationContainer>
            <AppNavigator.Navigator>
                <AppNavigator.Screen
                    name='DeliveriesScreen'
                    component={DeliveriesScreen}
                />
            </AppNavigator.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
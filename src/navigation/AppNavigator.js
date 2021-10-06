import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ConsumerGroupNavigator, ConsumerNavigator, OrganizerNavigator, ConsumerGroupTopTabNavigator, ExtraItemsNavigator, DeliveraryTopTabNavigator, OrdersManagementTabNavigator, DeliveryNavigator, AuthNavigator } from './MainNavigation';

const AppNavigator = (props) => {
    return (
        <NavigationContainer>
            <AuthNavigator />
            {/* <ConsumerGroupTopTabNavigator /> */}
            {/* <ConsumerNavigator /> */}
            {/* <OrganizerNavigator /> */}
            {/* <ConsumerGroupNavigator /> */}
        </NavigationContainer>
    );
};

export default AppNavigator;
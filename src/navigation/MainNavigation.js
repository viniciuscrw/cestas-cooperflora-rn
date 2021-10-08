import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import {
//   createBottomTabNavigator,
//   createMaterialTopTabNavigator,
// } from 'react-navigation-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import DeliveriesScreen, {
  deliveriesNavigationOptions,
} from '../screens/delivery/DeliveriesScreen';
import ConsumerGroupInfoScreen, {
  consumerGroupInfoNavigationOptions,
} from '../screens/ConsumerGroupInfoScreen';
import PaymentsScreen, { paymentsScreenOptions } from '../screens/PaymentsScreen';
import SigninScreen, { signinScreenOptions } from '../screens/SigninScreen';
import InitialScreen from '../screens/InitialScreen';
import ConsumersScreen from '../screens/ConsumersScreen';
import OrganizersScreen from '../screens/OrganizersScreen';
import CreateUserScreen from '../screens/CreateUserScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import EditConsumerGroupInfoScreen from '../screens/EditConsumerGroupScreen';
import UpdateAccountInfoScreen, { updateAccountInfoScreenOptions } from '../screens/UpdateAccountInfoScreen';
import AccountOptionsScreen, { AccountOptionsScreenOptions } from '../screens/AccountOptionsScreen';
import UpdatePasswordScreen, { updatePasswordScreenOptions } from '../screens/UpdatePasswordScreen';
import CreateDeliveryScreen, {
  createDeliveryNavigationOptions,
} from '../screens/delivery/CreateDeliveryScreen';
import AddDeliveryExtraItemsScreen from '../screens/delivery/AddDeliveryExtraItemsScreen';
import CreateExtraItemScreen from '../screens/delivery/CreateExtraItemScreen';
import OrdersByConsumerScreen, {
  ordersManagementNavigationOptions,
} from '../screens/OrdersByConsumerScreen';
import ConsumerOrderScreen from '../screens/consumer/ConsumerOrderScreen';
import ConsumerOrderPlacedScreen from '../screens/consumer/ConsumerOrderPlacedScreen';
import ConsumerPaymentsScreen, { consumerPaymentsScreenOptions } from '../screens/consumer/ConsumerPaymentsScreen';
import ConsumerAddPaymentScreen, { consumerAddPaymentScreenOptions } from '../screens/consumer/ConsumerAddPaymentScreen';
import OrdersItemsQuantityScreen from '../screens/OrdersItemsQuantityScreen';
import Colors from '../constants/Colors';

const defaultStackNavOptions = {
  headerTitleAlign: 'center',
};

const topTabBarOptions = {
  style: {
    backgroundColor: 'white',
    height: 30,
  },
  labelStyle: {
    marginTop: -8,
    fontSize: 11,
  },
  activeTintColor: 'darkorange',
  inactiveTintColor: 'darkolivegreen',
};

const ConsumerGroupStackNavigator = createStackNavigator();
export const ConsumerGroupNavigator = () => {
  return (
    <ConsumerGroupStackNavigator.Navigator>
      <ConsumerGroupStackNavigator.Screen
        name="ConsumerGroupInfoScreen" component={ConsumerGroupInfoScreen}
      />
      <ConsumerGroupStackNavigator.Screen
        name="EditConsumerGroupInfoScreen" component={EditConsumerGroupInfoScreen}
      />
    </ConsumerGroupStackNavigator.Navigator>
  );
}

const ConsumerStackNavigator = createStackNavigator();
export const ConsumerNavigator = () => {
  return (
    <ConsumerStackNavigator.Navigator>
      <ConsumerStackNavigator.Screen
        name="ConsumersScreen" component={ConsumersScreen}
      />
      <ConsumerStackNavigator.Screen
        name="CreateUserScreen" component={CreateUserScreen}
      />
      <ConsumerStackNavigator.Screen
        name="UserDetailScreen" component={UserDetailScreen}
      />
    </ConsumerStackNavigator.Navigator>
  );
}

const OrganizerStackNavigator = createStackNavigator();
export const OrganizerNavigator = () => {
  return (
    <OrganizerStackNavigator.Navigator>
      <OrganizerStackNavigator.Screen
        name="OrganizersScreen" component={OrganizersScreen}
      />
      <OrganizerStackNavigator.Screen
        name="CreateUserScreen" component={CreateUserScreen}
      />
      <OrganizerStackNavigator.Screen
        name="UserDetailScreen" component={UserDetailScreen}
      />
    </OrganizerStackNavigator.Navigator>
  );
}

const TopTabNavigator = createMaterialTopTabNavigator();
export const ConsumerGroupTopTabNavigator = () => {
  return (
    <TopTabNavigator.Navigator tabBarOptions={topTabBarOptions} swipeEnabled={true}>
      <TopTabNavigator.Screen
        name="Informações" component={ConsumerGroupNavigator}
      />
      <TopTabNavigator.Screen
        name="Consumidores" component={ConsumerNavigator} />
      <TopTabNavigator.Screen
        name="Organizadores" component={OrganizerNavigator}
      />
    </TopTabNavigator.Navigator>
  );
}

const ExtraItemsStackNavigator = createStackNavigator();
export const ExtraItemsNavigator = () => {
  return (
    <ExtraItemsStackNavigator.Navigator>
      <ExtraItemsStackNavigator.Screen
        name="AddDeliveryExtraItemsScreen" component={AddDeliveryExtraItemsScreen}
      />
      <ExtraItemsStackNavigator.Screen
        name="CreateExtraItemScreen" component={CreateExtraItemScreen}
      />
    </ExtraItemsStackNavigator.Navigator>
  );
}

const DelTopTabNavigator = createMaterialTopTabNavigator();
export const DeliveryTopTabNavigator = () => {
  return (
    <DelTopTabNavigator.Navigator tabBarOptions={topTabBarOptions}>
      <DelTopTabNavigator.Screen
        name="Informações da entrega" component={CreateDeliveryScreen}
      />
      <DelTopTabNavigator.Screen
        name="Produtos Extras" component={ExtraItemsNavigator}
      />
    </DelTopTabNavigator.Navigator>
  );
}

const OrdTopTabNavigator = createMaterialTopTabNavigator();
export const OrdersManagementTabNavigator = () => {
  return (
    <OrdTopTabNavigator.Navigator tabBarOptions={topTabBarOptions}>
      <OrdTopTabNavigator.Screen
        name="Pedidos" component={OrdersByConsumerScreen}
        options={ordersManagementNavigationOptions}
      />
      <OrdTopTabNavigator.Screen
        name="Quantidades pedidas" component={OrdersItemsQuantityScreen}
      />
    </OrdTopTabNavigator.Navigator>
  );
}

const DeliveryStackNavigator = createStackNavigator();
export const DeliveryNavigator = () => {
  return (
    <DeliveryStackNavigator.Navigator options={defaultStackNavOptions}>
      <DeliveryStackNavigator.Screen
        name="DeliveriesScreen" component={DeliveriesScreen}
        options={deliveriesNavigationOptions}
      />
      <DeliveryStackNavigator.Screen
        name="DeliveryTopTabNavigator" component={DeliveryTopTabNavigator} options={createDeliveryNavigationOptions}
      />
      <DeliveryStackNavigator.Screen
        name="ConsumerGroupTopTabNavigator" component={ConsumerGroupTopTabNavigator} options={consumerGroupInfoNavigationOptions}
      />
      <DeliveryStackNavigator.Screen
        name="ConsumerGroupInfo" component={ConsumerGroupInfoScreen} options={consumerGroupInfoNavigationOptions}
      />
      <DeliveryStackNavigator.Screen
        name="OrdersManagement" component={OrdersManagementTabNavigator} options={ordersManagementNavigationOptions}
      />
      <DeliveryStackNavigator.Screen
        name="ConsumerOrderScreen" component={ConsumerOrderScreen}
      // options={ordersManagementNavigationOptions}
      />
      <DeliveryStackNavigator.Screen
        name="ConsumerOrderPlacedScreen" component={ConsumerOrderPlacedScreen}
      // options={ordersManagementNavigationOptions}
      />
      <DeliveryStackNavigator.Screen
        name="ConsumerAddPaymentScreen" component={ConsumerAddPaymentScreen}
        options={consumerAddPaymentScreenOptions}
      />
      <DeliveryStackNavigator.Screen
        name="ConsumerPaymentsScreen" component={ConsumerPaymentsScreen}
      // options={ordersManagementNavigationOptions}
      />
    </DeliveryStackNavigator.Navigator>
  );
}

const PaymentsStackNavigator = createStackNavigator();
export const PaymentsNavigator = () => {
  return (
    <PaymentsStackNavigator.Navigator options={defaultStackNavOptions}>
      <PaymentsStackNavigator.Screen
        name="PaymentsScreen" component={PaymentsScreen}
        options={paymentsScreenOptions}
      />
      <PaymentsStackNavigator.Screen
        name="ConsumerPaymentsScreen" component={ConsumerPaymentsScreen}
        options={consumerPaymentsScreenOptions}
      />
    </PaymentsStackNavigator.Navigator>
  );
}

const AuthStackNavigator = createStackNavigator();
export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator>
      <AuthStackNavigator.Screen
        name="SigninScreen"
        component={SigninScreen}
        options={signinScreenOptions}
      />
      <AuthStackNavigator.Screen
        name="ForgotPassword" component={ForgotPasswordScreen}
      />
    </AuthStackNavigator.Navigator>
  );
}

const AccountStackNavigator = createStackNavigator();
export const AccountNavigator = () => {
  return (
    <AccountStackNavigator.Navigator options={defaultStackNavOptions}>
      <AccountStackNavigator.Screen
        name="AccountOptionsScreen" component={AccountOptionsScreen}
        options={AccountOptionsScreenOptions}
      />
      <AccountStackNavigator.Screen
        name="UpdateAccountInfoScreen" component={UpdateAccountInfoScreen} options={updateAccountInfoScreenOptions}
      />
      <AccountStackNavigator.Screen
        name="UpdatePasswordScreen" component={UpdatePasswordScreen} options={updatePasswordScreenOptions}
      />
    </AccountStackNavigator.Navigator>
  );
}

const tabBarOptions = {
  activeTintColor: Colors.activeIconColor,
  inactiveTintColor: Colors.inactiveIconColor,
  tabBarActiveTintColor: Colors.activeIconColor,
  tabBarInactiveTintColor: Colors.inactiveIconColor,
  label: {
    fontSize: 16,
  },
  style: {
    height: 60,
    backgroundColor: 'white',
  },
}

import { Ionicons } from '@expo/vector-icons';

const BottomTab = createBottomTabNavigator();
export const BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="DeliveryNavigator"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <BottomTab.Screen
        name="AccountNavigator" component={AccountNavigator}
        headerShown='false'
        options={{
          tabBarLabel: 'Minha Conta',
          tabBarAccessibilityLabel: 'Minha Conta',
          tabBarIcon: ({ color, size }) => {
            return (
              <FontAwesome5 name="user-alt" size={34} color={color} />
            )
          },
        }}
      />
      <BottomTab.Screen
        name="DeliveryNavigator" component={DeliveryNavigator}
        options={{
          tabBarLabel: 'Cestas bottom tab',
          tabBarAccessibilityLabel: 'Cestas bottom tab',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="shopping-basket" size={34} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Payments" component={PaymentsNavigator}
        options={{
          tabBarLabel: 'Pagamentos',
          tabBarAccessibilityLabel: 'Pagamentos',
          tabBarActiveTintColor: 'red',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="dollar-sign" size={34} color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

const MainStackNavigator = createStackNavigator();
export const MainNavigator = () => {
  return (
    <MainStackNavigator.Navigator >
      <MainStackNavigator.Screen
        name="Entregas" component={BottomTabNavigator} 
        options={{headerShown:false}}
      />
      <MainStackNavigator.Screen
        name="CreateDeliveryScreen"
        component={DeliveryTopTabNavigator}
        // options={}
      />
      <MainStackNavigator.Screen
        name="OrdersManagement"
        component={OrdersManagementTabNavigator}
      />

      {/* <MainStackNavigator.Screen
        name="CreateDeliveryScreen" 
        component={CreateDeliveryScreen}
      />
      <MainStackNavigator.Screen
        name="DeliveryTopTabNavigator" component={DeliveryTopTabNavigator}
      />
      <MainStackNavigator.Screen
        name="PaymentsScreen" 
        component={PaymentsScreen}
        options={PaymentsScreenOptions}
      /> */}
      {/* <MainStackNavigator.Screen
        name="ConsumerGroupTopTabNavigator" component={ConsumerGroupTopTabNavigator}
      /> */}
      <MainStackNavigator.Screen
        name="ConsumerGroupInfoScreen" component={ConsumerGroupInfoScreen}
      />
    </MainStackNavigator.Navigator>
  );
}

// const switchNavigator = createSwitchNavigator({
//   Initial: InitialScreen,
//   mainFlow: createBottomTabNavigator(
//     {
//       Account: {
//         screen: createStackNavigator({
//           AccountOptions: {
//             screen: AccountOptionsScreen,
//             navigationOptions: {
//               headerTitle: 'Minha Conta',
//               ...defaultStackNavOptions,
//             },
//           },
//           UpdateAccountInfo: {
//             screen: UpdateAccountInfoScreen,
//             navigationOptions: {
//               headerTitle: 'Atualizar informações',
//               headerBackTitle: 'Voltar',
//               ...defaultStackNavOptions,
//             },
//           },
//           UpdatePassword: {
//             screen: UpdatePasswordScreen,
//             navigationOptions: {
//               headerTitle: 'Atualizar senha',
//               headerBackTitle: 'Voltar',
//               ...defaultStackNavOptions,
//             },
//           },
//         }),
//         navigationOptions: {
//           tabBarLabel: 'Minha Conta',
//           tabBarIcon: ({ tintColor }) => (
//             <FontAwesome5 name="user-alt" size={30} color={tintColor} />
//           ),
//         },
//       },
//       Deliveries: {
//         screen: deliveryStackNavigator,
//         navigationOptions: {
//           tabBarLabel: 'Cestas',
//           tabBarIcon: ({ tintColor }) => (
//             <FontAwesome5 name="shopping-basket" size={34} color={tintColor} />
//           ),
//         },
//       },
//       Payments: {
//         screen: createStackNavigator({
//           Payments: {
//             // screen: ConsumerPaymentsScreen,
//             screen: PaymentsScreen
//           },
//         }),
//         navigationOptions: {
//           tabBarLabel: 'Pagamentos',
//           tabBarIcon: ({ tintColor }) => (
//             <FontAwesome5 name="dollar-sign" size={30} color={tintColor} />
//           ),
//         },
//       },
//     },
//     {
//       initialRouteName: 'Deliveries',
//       tabBarOptions: {
//         activeTintColor: Colors.activeIconColor,
//         inactiveTintColor: Colors.inactiveIconColor,
//         label: {
//           fontSize: 16,
//         },
//         style: {
//           height: 60,
//           backgroundColor: 'white',
//         },
//       },
//     }
//   ),
// });






// const switchNavigator = createSwitchNavigator({
//   Initial: InitialScreen,
//   LoginFlow: createStackNavigator({
//     Signin: {
//       screen: SigninScreen,
//       navigationOptions: {
//         headerShown: false,
//       },
//     },
//     ForgotPassword: {
//       screen: ForgotPasswordScreen,
//       navigationOptions: {
//         headerShown: false,
//       },
//     },
//   }),
//   mainFlow: createBottomTabNavigator(
//     {
//       Account: {
//         screen: createStackNavigator({
//           AccountOptions: {
//             screen: AccountOptionsScreen,
//             navigationOptions: {
//               headerTitle: 'Minha Conta',
//               ...defaultStackNavOptions,
//             },
//           },
//           UpdateAccountInfo: {
//             screen: UpdateAccountInfoScreen,
//             navigationOptions: {
//               headerTitle: 'Atualizar informações',
//               headerBackTitle: 'Voltar',
//               ...defaultStackNavOptions,
//             },
//           },
//           UpdatePassword: {
//             screen: UpdatePasswordScreen,
//             navigationOptions: {
//               headerTitle: 'Atualizar senha',
//               headerBackTitle: 'Voltar',
//               ...defaultStackNavOptions,
//             },
//           },
//         }),
//         navigationOptions: {
//           tabBarLabel: 'Minha Conta',
//           tabBarIcon: ({ tintColor }) => (
//             <FontAwesome5 name="user-alt" size={30} color={tintColor} />
//           ),
//         },
//       },
//       Deliveries: {
//         screen: deliveryStackNavigator,
//         navigationOptions: {
//           tabBarLabel: 'Cestas',
//           tabBarIcon: ({ tintColor }) => (
//             <FontAwesome5 name="shopping-basket" size={34} color={tintColor} />
//           ),
//         },
//       },
//       Payments: {
//         screen: createStackNavigator({
//           Payments: {
//             // screen: ConsumerPaymentsScreen,
//             screen: PaymentsScreen
//           },
//         }),
//         navigationOptions: {
//           tabBarLabel: 'Pagamentos',
//           tabBarIcon: ({ tintColor }) => (
//             <FontAwesome5 name="dollar-sign" size={30} color={tintColor} />
//           ),
//         },
//       },
//     },
//     {
//       initialRouteName: 'Deliveries',
//       tabBarOptions: {
//         activeTintColor: Colors.activeIconColor,
//         inactiveTintColor: Colors.inactiveIconColor,
//         label: {
//           fontSize: 16,
//         },
//         style: {
//           height: 60,
//           backgroundColor: 'white',
//         },
//       },
//     }
//   ),
// });

// export default switchNavigator;
// export default consumerGroupStackNavigator;

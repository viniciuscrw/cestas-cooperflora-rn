import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { FontAwesome5 } from '@expo/vector-icons';
import DeliveriesScreen, {
  deliveriesNavigationOptions,
} from '../screens/delivery/DeliveriesScreen';
import ConsumerGroupInfoScreen, {
  consumerGroupInfoScreenOptions,
} from '../screens/ConsumerGroupInfoScreen';
import PaymentScreen, { paymentScreenOptions } from '../screens/PaymentScreen';
import PaymentsScreen, {
  paymentsScreenOptions,
} from '../screens/PaymentsScreen';
import SigninScreen, { signinScreenOptions } from '../screens/SigninScreen';
import ConsumersScreen from '../screens/ConsumersScreen';
import OrganizersScreen from '../screens/OrganizersScreen';
import CreateUserScreen from '../screens/CreateUserScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import ForgotPasswordScreen, {
  forgotPasswordScreenOptions,
} from '../screens/ForgotPasswordScreen';
import EditConsumerGroupInfoScreen, {
  editConsumerGroupScreenOptions,
} from '../screens/EditConsumerGroupScreen';
import UpdateAccountInfoScreen, {
  updateAccountInfoScreenOptions,
} from '../screens/UpdateAccountInfoScreen';
import AccountOptionsScreen, {
  AccountOptionsScreenOptions,
} from '../screens/AccountOptionsScreen';
import UpdatePasswordScreen, {
  updatePasswordScreenOptions,
} from '../screens/UpdatePasswordScreen';
import CreateDeliveryScreen, {
  createDeliveryScreenOptions,
} from '../screens/delivery/CreateDeliveryScreen';
import AddDeliveryExtraItemsScreen from '../screens/delivery/AddDeliveryExtraItemsScreen';
import CreateExtraItemScreen from '../screens/delivery/CreateExtraItemScreen';
import OrdersByConsumerScreen, {
  ordersManagementScreenOptions,
} from '../screens/OrdersByConsumerScreen';
import ConsumerOrderScreen, {
  consumerOrderScreenOptions,
} from '../screens/consumer/ConsumerOrderScreen';
import ConsumerOrderPlacedScreen, {
  consumerOrderPlacedScreenOptions,
} from '../screens/consumer/ConsumerOrderPlacedScreen';
import ConsumerPaymentsScreen, {
  consumerPaymentsScreenOptions,
} from '../screens/consumer/ConsumerPaymentsScreen';
import ConsumerAddPaymentScreen, {
  consumerAddPaymentScreenOptions,
} from '../screens/consumer/ConsumerAddPaymentScreen';
import AboutScreen, { aboutScreenOptions } from '../screens/AboutScreen';
import OrdersItemsQuantityScreen from '../screens/OrdersItemsQuantityScreen';
import InitialScreen, { initialScreenOptions } from '../screens/InitialScreen';
import Colors from '../constants/Colors';

const ConsumerGroupStackNavigator = createStackNavigator();
export const ConsumerGroupNavigator = () => {
  return (
    <ConsumerGroupStackNavigator.Navigator>
      <ConsumerGroupStackNavigator.Screen
        name="ConsumerGroupInfoScreen"
        component={ConsumerGroupInfoScreen}
        options={{ headerShown: false }}
      // options={consumerGroupInfoScreenOptions}
      />
      <ConsumerGroupStackNavigator.Screen
        name="EditConsumerGroupInfoScreen"
        component={EditConsumerGroupInfoScreen}
        options={{ headerShown: false }}
      // options={editConsumerGroupScreenOptions}
      />
    </ConsumerGroupStackNavigator.Navigator>
  );
};

const ConsumerStackNavigator = createStackNavigator();
export const ConsumerNavigator = () => {
  return (
    <ConsumerStackNavigator.Navigator>
      <ConsumerStackNavigator.Screen
        name="ConsumersScreen"
        component={ConsumersScreen}
        options={{ headerShown: false }}
      />
      <ConsumerStackNavigator.Screen
        name="CreateUserScreen"
        component={CreateUserScreen}
        options={{ headerShown: false }}
      />
      <ConsumerStackNavigator.Screen
        name="UserDetailScreen"
        component={UserDetailScreen}
        options={{ headerShown: false }}
      />
    </ConsumerStackNavigator.Navigator>
  );
};

const OrganizerStackNavigator = createStackNavigator();
export const OrganizerNavigator = () => {
  return (
    <OrganizerStackNavigator.Navigator>
      <OrganizerStackNavigator.Screen
        name="OrganizersScreen"
        component={OrganizersScreen}
        options={{ headerShown: false }}
      />
      <OrganizerStackNavigator.Screen
        name="CreateUserScreen"
        component={CreateUserScreen}
        options={{ headerShown: false }}
      />
      <OrganizerStackNavigator.Screen
        name="UserDetailScreen"
        component={UserDetailScreen}
        options={{ headerShown: false }}
      />
    </OrganizerStackNavigator.Navigator>
  );
};

const TopTabNavigator = createMaterialTopTabNavigator();
export const ConsumerGroupTopTabNavigator = () => {
  return (
    <TopTabNavigator.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.activeIconColor,
        tabBarInactiveTintColor: Colors.inactiveIconColor,
        tabBarLabelStyle: [{ marginTop: -8, fontSize: 13 }, null],
        tabBarIndicatorStyle: { backgroundColor: Colors.activeIconColor },
        tabBarStyle: { backgroundColor: 'transparent', height: 30 },
      }}
      initialRouteName="Informações"
    >
      <TopTabNavigator.Screen
        name="Informações"
        component={ConsumerGroupNavigator}
      />
      <TopTabNavigator.Screen
        name="Consumidores"
        component={ConsumerNavigator}
      />
      <TopTabNavigator.Screen
        name="Organizadores"
        component={OrganizerNavigator}
      />
    </TopTabNavigator.Navigator>
  );
};

const ExtraItemsStackNavigator = createStackNavigator();
export const ExtraItemsNavigator = () => {
  return (
    <ExtraItemsStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <ExtraItemsStackNavigator.Screen
        name="AddDeliveryExtraItemsScreen"
        component={AddDeliveryExtraItemsScreen}
      />
      <ExtraItemsStackNavigator.Screen
        name="CreateExtraItemScreen"
        component={CreateExtraItemScreen}
      />
    </ExtraItemsStackNavigator.Navigator>
  );
};

const DelTopTabNavigator = createMaterialTopTabNavigator();
export const DeliveryManagementTopTabNavigator = () => {
  return (
    <DelTopTabNavigator.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.activeIconColor,
        tabBarInactiveTintColor: Colors.inactiveIconColor,
        tabBarLabelStyle: [{ marginTop: -8, fontSize: 13 }, null],
        tabBarIndicatorStyle: { backgroundColor: Colors.activeIconColor },
        tabBarStyle: { backgroundColor: 'transparent', height: 30 }
      }}
    >
      {/* <DelTopTabNavigator.Navigator> */}
      <DelTopTabNavigator.Screen
        name="CreateDeliveryScreen"
        component={CreateDeliveryScreen}
        options={{ tabBarLabel: 'Composição da Cesta' }}
      />
      <DelTopTabNavigator.Screen
        name="Produtos Extras"
        component={ExtraItemsNavigator}
        options={{ tabBarLabel: 'Produtos Extras' }}
      />
    </DelTopTabNavigator.Navigator>
  );
};

const OrdTopTabNavigator = createMaterialTopTabNavigator();
export const OrdersManagementTabNavigator = ({ route }) => {
  const delivery = route.params;
  return (
    <OrdTopTabNavigator.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.activeIconColor,
        tabBarInactiveTintColor: Colors.inactiveIconColor,
        tabBarLabelStyle: [{ marginTop: -8, fontSize: 13 }, null],
        tabBarIndicatorStyle: { backgroundColor: Colors.activeIconColor },
        tabBarStyle: { backgroundColor: '#F0F5F9', height: 30 },
      }}
    >
      <OrdTopTabNavigator.Screen
        name="OrdersByConsumer"
        component={OrdersByConsumerScreen}
        // options={ordersManagementScreenOptions}
        options={{ tabBarLabel: 'Pedidos' }}
        initialParams={delivery}
      />
      <OrdTopTabNavigator.Screen
        name="Quantidades pedidas"
        component={OrdersItemsQuantityScreen}
        initialParams={delivery}
      />
    </OrdTopTabNavigator.Navigator>
  );
};

const DeliveryStackNavigator = createStackNavigator();
export const DeliveryNavigator = () => {
  return (
    <DeliveryStackNavigator.Navigator>
      <DeliveryStackNavigator.Screen
        name="DeliveriesScreen"
        component={DeliveriesScreen}
        options={deliveriesNavigationOptions}
      />
      <DeliveryStackNavigator.Screen
        name="DeliveryTopTabNavigator"
        component={DeliveryManagementTopTabNavigator}
        options={createDeliveryScreenOptions}
      />
      <DeliveryStackNavigator.Screen
        name="ConsumerGroupTopTabNavigator"
        component={ConsumerGroupTopTabNavigator}
      // options={consumerGroupInfoNavigationOptions}
      />
      <DeliveryStackNavigator.Screen
        name="ConsumerGroupInfoScreen"
        component={ConsumerGroupInfoScreen}
        options={consumerGroupInfoScreenOptions}
      />
      <DeliveryStackNavigator.Screen
        name="OrdersManagement"
        component={OrdersManagementTabNavigator}
        options={ordersManagementScreenOptions}
      />
      <DeliveryStackNavigator.Screen
        name="ConsumerOrderScreen"
        component={ConsumerOrderScreen}
        options={consumerOrderScreenOptions}
      />
      <DeliveryStackNavigator.Screen
        name="ConsumerOrderPlacedScreen"
        component={ConsumerOrderPlacedScreen}
        options={consumerOrderPlacedScreenOptions}
      />
    </DeliveryStackNavigator.Navigator >
  );
};

const PaymentsStackNavigator = createStackNavigator();
export const PaymentsNavigator = () => {
  return (
    <PaymentsStackNavigator.Navigator>
      <PaymentsStackNavigator.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={paymentScreenOptions}
      />
      <PaymentsStackNavigator.Screen
        name="PaymentsScreen"
        component={PaymentsScreen}
        options={paymentsScreenOptions}
      />
      <PaymentsStackNavigator.Screen
        name="ConsumerPaymentsScreen"
        component={ConsumerPaymentsScreen}
        options={consumerPaymentsScreenOptions}
      />
      <PaymentsStackNavigator.Screen
        name="ConsumerAddPaymentScreen"
        component={ConsumerAddPaymentScreen}
        options={consumerAddPaymentScreenOptions}
      />
    </PaymentsStackNavigator.Navigator>
  );
};

const AuthStackNavigator = createStackNavigator();
export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator>
      <AuthStackNavigator.Screen
        name="InitialScreen"
        component={InitialScreen}
        options={initialScreenOptions}
      />
      <AuthStackNavigator.Screen
        name="SigninScreen"
        component={SigninScreen}
        options={signinScreenOptions}
      />
      <AuthStackNavigator.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={forgotPasswordScreenOptions}
      />
    </AuthStackNavigator.Navigator>
  );
};

const AccountStackNavigator = createStackNavigator();
export const AccountNavigator = () => {
  return (
    <AccountStackNavigator.Navigator>
      <AccountStackNavigator.Screen
        name="AccountOptionsScreen"
        component={AccountOptionsScreen}
        options={AccountOptionsScreenOptions}
      />
      <AccountStackNavigator.Screen
        name="UpdateAccountInfoScreen"
        component={UpdateAccountInfoScreen}
        options={updateAccountInfoScreenOptions}
      />
      <AccountStackNavigator.Screen
        name="UpdatePasswordScreen"
        component={UpdatePasswordScreen}
        options={updatePasswordScreenOptions}
      />
      <AccountStackNavigator.Screen
        name="AboutScreen"
        component={AboutScreen}
        options={aboutScreenOptions}
      />
      <AccountStackNavigator.Screen
        name="Payments"
        component={PaymentsNavigator}
        options={paymentScreenOptions}
      />
    </AccountStackNavigator.Navigator>
  );
};

const BottomTab = createBottomTabNavigator();
export const BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="DeliveryNavigator"
      screenOptions={{
        tabBarActiveTintColor: Colors.activeIconColor,
        tabBarInactiveTintColor: Colors.inactiveIconColor,
        // tabBarStyle: [{ display: 'flex' }, null],
        tabBarStyle: { paddingTop: 5 },
        headerShown: false,
      }}
    >
      <BottomTab.Screen
        name="AccountNavigator"
        component={AccountNavigator}
        headerShown="false"
        options={{
          tabBarLabel: 'Minha Conta',
          tabBarAccessibilityLabel: 'Minha Conta',
          tabBarIcon: ({ color }) => {
            return <FontAwesome5 name="user-alt" size={34} color={color} />;
          },
        }}
      />
      <BottomTab.Screen
        name="DeliveryNavigator"
        component={DeliveryNavigator}
        options={{
          tabBarLabel: 'Cestas',
          tabBarAccessibilityLabel: 'Cestas',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="shopping-basket" size={34} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Payments"
        component={PaymentsNavigator}
        options={{
          tabBarLabel: 'Pagamentos',
          tabBarAccessibilityLabel: 'Pagamentos',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="dollar-sign" size={34} color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

const MainStackNavigator = createStackNavigator();
export const MainNavigator = () => {
  return (
    <MainStackNavigator.Navigator>
      <MainStackNavigator.Screen
        name="Entregas"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <MainStackNavigator.Screen
        name="DeliveryManagement"
        component={DeliveryManagementTopTabNavigator}
        options={createDeliveryScreenOptions}
      />
      <MainStackNavigator.Screen
        name="OrdersManagement"
        component={OrdersManagementTabNavigator}
      />
      <MainStackNavigator.Screen
        name="ConsumerGroupInfoScreen"
        component={ConsumerGroupInfoScreen}
        options={consumerGroupInfoScreenOptions}
      />
      <MainStackNavigator.Screen
        name="ConsumerGroupManagement"
        component={ConsumerGroupTopTabNavigator}
        options={consumerGroupInfoScreenOptions}
      />
    </MainStackNavigator.Navigator>
  );
};

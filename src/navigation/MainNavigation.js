import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { createSwitchNavigator } from 'react-navigation';
import DeliveriesScreen, { deliveriesNavigationOptions } from '../screens/delivery/DeliveriesScreen';
import ConsumerGroupInfoScreen, { consumerGroupInfoNavigationOptions } from '../screens/ConsumerGroupInfoScreen';
import PaymentsScreen from '../screens/PaymentsScreen';
import SigninScreen from '../screens/SigninScreen';
import InitialScreen from '../screens/InitialScreen';
import ConsumersScreen from '../screens/ConsumersScreen';
import OrganizersScreen from '../screens/OrganizersScreen';
import CreateUserScreen from '../screens/CreateUserScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import EditConsumerGroupInfoScreen from '../screens/EditConsumerGroupScreen';
import UpdateAccountInfoScreen from '../screens/UpdateAccountInfoScreen';
import AccountOptionsScreen from '../screens/AccountOptionsScreen';
import UpdatePasswordScreen from '../screens/UpdatePasswordScreen';
import CreateDeliveryScreen, { createDeliveryNavigationOptions } from '../screens/delivery/CreateDeliveryScreen';
import AddDeliveryExtraItemsScreen from '../screens/delivery/AddDeliveryExtraItemsScreen';
import CreateExtraItemScreen from '../screens/delivery/CreateExtraItemScreen';
import ConsumerOrderScreen, {ConsumerOrderScreenOptions} from '../screens/consumer/ConsumerOrderScreen';


const defaultStackNavOptions = {
  headerTitleAlign: 'center',
};

const topTabConfig = {
  tabBarOptions: {
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
  },
};

const consumerGroupStackNavigator = createStackNavigator({
  ConsumerGroupInfo: {
    screen: ConsumerGroupInfoScreen,
  },
  EditConsumerGroup: {
    screen: EditConsumerGroupInfoScreen,
  },
});

const consumerStackNavigator = createStackNavigator({
  Consumers: {
    screen: ConsumersScreen,
  },
  CreateUser: {
    screen: CreateUserScreen,
  },
  UserDetail: {
    screen: UserDetailScreen,
  },
});

const organizerStackNavigator = createStackNavigator({
  Organizers: {
    screen: OrganizersScreen,
  },
  CreateUser: {
    screen: CreateUserScreen,
  },
  UserDetail: {
    screen: UserDetailScreen,
  },
});

const consumerGroupTopTabNavigator = createMaterialTopTabNavigator(
  {
    ConsumerGroupInfo: {
      screen: consumerGroupStackNavigator,
      navigationOptions: {
        tabBarLabel: 'Informações',
      },
    },
    Consumers: {
      screen: consumerStackNavigator,
      navigationOptions: {
        tabBarLabel: 'Consumidores',
      },
    },
    Organizers: {
      screen: organizerStackNavigator,
      navigationOptions: {
        tabBarLabel: 'Organizadores',
      },
    },
  },
  { ...topTabConfig, swipeEnabled: false },
);

const extraItemsStackNavigator = createStackNavigator({
  AddDeliveryExtraItems: {
    screen: AddDeliveryExtraItemsScreen,
  },
  CreateExtraItem: {
    screen: CreateExtraItemScreen,
  },
});

const deliveryTopTabNavigator = createMaterialTopTabNavigator(
  {
    CreateDelivery: {
      screen: CreateDeliveryScreen,
      navigationOptions: {
        tabBarLabel: 'Informações da entrega',
      },
    },
    AddDeliveryExtraItems: {
      screen: extraItemsStackNavigator,
      navigationOptions: {
        tabBarLabel: 'Produtos Extras',
      },
    },
  },
  topTabConfig
);

const deliveryStackNavigator = createStackNavigator(
  {
    Deliveries: {
      screen: DeliveriesScreen,
      navigationOptions: deliveriesNavigationOptions,
    },
    CreateDelivery: {
      screen: deliveryTopTabNavigator,
      navigationOptions: createDeliveryNavigationOptions,
    },
    ConsumerGroup: {
      screen: consumerGroupTopTabNavigator,
      navigationOptions: consumerGroupInfoNavigationOptions,
    },
    ConsumerGroupInfo: {
      screen: ConsumerGroupInfoScreen,
      navigationOptions: consumerGroupInfoNavigationOptions,
    },
    ConsumerOrder: {
      screen: ConsumerOrderScreen,
      navigationOptions: ConsumerOrderScreenOptions,
    }
  },
  {
    defaultNavigationOptions: defaultStackNavOptions,
  }
);

//Screen added by André/Rafa/Yasmin
// const consumerOrderStackNavigator = createStackNavigator(
//   {
//     Deliveries: {
//       screen: DeliveriesScreen,
//       navigationOptions: deliveriesNavigationOptions,
//     },
//     Order: {
//       screen: ConsumerOrderScreen,
//       navigationOptions: ScreenOptions,
//     }
//   },
//   {
//     defaultNavigationOptions: defaultStackNavOptions,
//   }
// );

// ==================

const switchNavigator = createSwitchNavigator({
  Initial: InitialScreen,
  LoginFlow: createStackNavigator({
    Signin: {
      screen: SigninScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    ForgotPassword: {
      screen: ForgotPasswordScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  }),
  mainFlow: createBottomTabNavigator(
    {
      Account: {
        screen: createStackNavigator({
          AccountOptions: {
            screen: AccountOptionsScreen,
            navigationOptions: {
              headerTitle: 'Minha Conta',
              ...defaultStackNavOptions,
            },
          },
          UpdateAccountInfo: {
            screen: UpdateAccountInfoScreen,
            navigationOptions: {
              headerTitle: 'Atualizar informações',
              headerBackTitle: 'Voltar',
              ...defaultStackNavOptions,
            },
          },
          UpdatePassword: {
            screen: UpdatePasswordScreen,
            navigationOptions: {
              headerTitle: 'Atualizar senha',
              headerBackTitle: 'Voltar',
              ...defaultStackNavOptions,
            },
          },
        }),
        navigationOptions: {
          tabBarLabel: 'Minha conta',
          tabBarIcon: ({ tintColor }) => (
            <FontAwesome5 name="user-alt" size={30} color={tintColor} />
          ),
        },
      },
      Deliveries: {
        screen: deliveryStackNavigator,
        navigationOptions: {
          tabBarLabel: 'Cestas',
          tabBarIcon: ({ tintColor }) => (
            <FontAwesome5 name="shopping-bag" size={34} color={tintColor} />
          ),
        },
      },
      Payments: {
        screen: createStackNavigator({
          Payments: {
            screen: PaymentsScreen,
            navigationOptions: {
              headerTitle: 'Pagamentos',
              ...defaultStackNavOptions,
            },
          },
        }),
        navigationOptions: {
          tabBarLabel: 'Pagamentos',
          tabBarIcon: ({ tintColor }) => (
            <FontAwesome5 name="dollar-sign" size={30} color={tintColor} />
          ),
        },
      },
    },
    {
      initialRouteName: 'Deliveries',
      tabBarOptions: {
        activeTintColor: 'darkorange',
        inactiveTintColor: 'darkolivegreen',
        label: {
          fontSize: 16,
        },
        style: {
          height: 60,
          backgroundColor: 'white',
        },
      },
    }
  ),
});

export default switchNavigator;

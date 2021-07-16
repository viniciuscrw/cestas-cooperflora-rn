import React from 'react';
import { createAppContainer } from 'react-navigation';
import { LogBox } from 'react-native';
import firebase from 'firebase';
import MainNavigation from './src/navigation/MainNavigation';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as UserProvider } from './src/context/UserContext';
import { Provider as ConsumerGroupProvider } from './src/context/ConsumerGroupContext';
import { Provider as DeliveryProvider } from './src/context/DeliveryContext';
import { Provider as ProductProvider } from './src/context/ProductContext';
import FirebaseConfig from './src/constants/FirebaseConfig';
import { setNavigator } from './src/navigationRef';

const App = createAppContainer(MainNavigation);

export default () => {

  LogBox.ignoreLogs(['Setting a timer']);

  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseConfig.FirebaseConfig);
  }

  LogBox.ignoreAllLogs();

  return (
    <AuthProvider>
      <UserProvider>
        <ConsumerGroupProvider>
          <DeliveryProvider>
            <ProductProvider>
              <App
                ref={(navigator) => {
                  setNavigator(navigator);
                }}
              />
            </ProductProvider>
          </DeliveryProvider>
        </ConsumerGroupProvider>
      </UserProvider>
    </AuthProvider>
  );
};

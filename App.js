import React from 'react';
import MainNavigation from './src/navigation/MainNavigation';
import { createAppContainer } from 'react-navigation';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as UserProvider } from './src/context/UserContext';
import { Provider as ConsumerGroupProvider } from './src/context/ConsumerGroupContext';
import { Provider as DeliveryProvider } from './src/context/DeliveryContext';
import { Provider as ProductProvider } from './src/context/ProductContext';
import FirebaseConfig from './src/constants/FirebaseConfig';
import firebase from 'firebase';
import { setNavigator } from './src/navigationRef';

const App = createAppContainer(MainNavigation);

export default () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseConfig.FirebaseConfig);
  }

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

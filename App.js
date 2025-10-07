import React from 'react';
import { LogBox } from 'react-native';
import firebase from 'firebase/compat/app';

import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as UserProvider } from './src/context/UserContext';
import { Provider as ConsumerGroupProvider } from './src/context/ConsumerGroupContext';
import { Provider as DeliveryProvider } from './src/context/DeliveryContext';
import { Provider as ProductProvider } from './src/context/ProductContext';
import { Provider as OrderProvider } from './src/context/OrderContext';
import { Provider as PaymentProvider } from './src/context/PaymentContext';
import { FirebaseConfig } from './src/constants/FirebaseConfig';

import AppNavigator from './src/navigation/AppNavigator';

// eslint-disable-next-line no-undef
const App = () => {
  console.log('[App] started');
  LogBox.ignoreLogs(['Setting a timer']);
  LogBox.ignoreLogs(['It appears']);
  LogBox.ignoreLogs(["'Card."]);
  LogBox.ignoreAllLogs();

  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseConfig);
  }

  return (
    <AuthProvider>
      <UserProvider>
        <ConsumerGroupProvider>
          <OrderProvider>
            <DeliveryProvider>
              <ProductProvider>
                <PaymentProvider>
                  <AppNavigator />
                </PaymentProvider>
              </ProductProvider>
            </DeliveryProvider>
          </OrderProvider>
        </ConsumerGroupProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default App;

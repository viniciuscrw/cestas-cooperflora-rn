import React from 'react';
import { LogBox } from 'react-native';
import firebase from 'firebase';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as UserProvider } from './src/context/UserContext';
import { Provider as ConsumerGroupProvider } from './src/context/ConsumerGroupContext';
import { Provider as DeliveryProvider } from './src/context/DeliveryContext';
import { Provider as ProductProvider } from './src/context/ProductContext';
import { Provider as OrderProvider } from './src/context/OrderContext';
import { Provider as PaymentProvider } from './src/context/PaymentContext';
import FirebaseConfig from './src/constants/FirebaseConfig';
import AppNavigator from './src/navigation/AppNavigator';

export default App = () => {
  LogBox.ignoreLogs(['Setting a timer']);
  LogBox.ignoreLogs(['It appears']);
  LogBox.ignoreLogs(["'Card."]);
  LogBox.ignoreLogs(["'ListItem."]);
  LogBox.ignoreAllLogs();

  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseConfig.FirebaseConfig);
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

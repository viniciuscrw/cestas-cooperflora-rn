import React from 'react';
import { LogBox } from 'react-native';
// import firebase from 'firebase';
import firebase from 'firebase/compat/app';

// import * as Sentry from 'sentry-expo';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as UserProvider } from './src/context/UserContext';
import { Provider as ConsumerGroupProvider } from './src/context/ConsumerGroupContext';
import { Provider as DeliveryProvider } from './src/context/DeliveryContext';
import { Provider as ProductProvider } from './src/context/ProductContext';
import { Provider as OrderProvider } from './src/context/OrderContext';
import { Provider as PaymentProvider } from './src/context/PaymentContext';
// import FirebaseConfig from './src/constants/FirebaseConfig';
import { FirebaseConfig } from './src/constants/FirebaseConfig';

import AppNavigator from './src/navigation/AppNavigator';

// Sentry.init({
//   dsn: 'https://d60426361ed74ca1af53a268f4d03253@o1022102.ingest.sentry.io/6095099',
//   enableInExpoDevelopment: true,
//   debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
// });

// // Access any @sentry/react-native exports via:
// Sentry.Native.*

// // Access any @sentry/browser exports via:
// Sentry.Browser.*

export default App = () => {
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

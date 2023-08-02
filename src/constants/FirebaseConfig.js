import {
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth/react-native';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import getEnvVars() from environment.js
import getEnvVars from '../../environment';

const { FirebaseConfig } = getEnvVars();

const app = initializeApp(FirebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

export { FirebaseConfig, auth, db };

// https://stackoverflow.com/questions/66665969/expo-app-environments-for-dev-uat-and-production
import Constants from 'expo-constants';

const ENV = {
  dev: {
    FirebaseConfig: {
      apiKey: "AIzaSyDd6zz4XqA7CIeL4AhcrKlclh8PK2EpzIA",
      authDomain: "cestas-cooperflora-dev2.firebaseapp.com",
      databaseURL: "https://cestas-cooperflora-dev2-default-rtdb.firebaseio.com",
      projectId: "cestas-cooperflora-dev2",
      storageBucket: "cestas-cooperflora-dev2.appspot.com",
      messagingSenderId: "109563362615",
      appId: "1:109563362615:web:25896a03f004d33970aeb2"
    },
  },
  prod: {
    FirebaseConfig: {
      apiKey: 'AIzaSyAKufHFIlzA2k26_PO4Yfx03pUqtfLHAKw',
      authDomain: 'cestascooperflorabarao.firebaseapp.com',
      databaseURL: 'https://cestas-cooperflora-barao.firebaseio.com',
      projectId: 'cestascooperflorabarao',
      storageBucket: 'cestascooperflorabarao.appspot.com',
      messagingSenderId: '1021764633897',
      appId: '1:1021764633897:web:2ac317b9efd23a3306a338',
    },
  },
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
  // What is __DEV__ ?
  // This variable is set to true when react-native is running in Dev mode.
  // __DEV__ is true when run locally, but false when published.
  if (__DEV__ || env === 'dev') {
    console.log('Dev environment');
    return ENV.dev;
  }
  console.log('Prod environment');
  return ENV.prod;
};

export default getEnvVars;

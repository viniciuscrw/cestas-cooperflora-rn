//https://stackoverflow.com/questions/66665969/expo-app-environments-for-dev-uat-and-production
import Constants from 'expo-constants';

const ENV = {
  dev: {
    FirebaseConfig: {
      apiKey: 'AIzaSyCAn6bViRobzNBEvfANu8eFEqBji3_KE7E',
      authDomain: 'cestascooperflorabarao-dev.firebaseapp.com',
      databaseURL: 'https://cestas-cooperflora-dev.firebaseio.com',
      projectId: 'cestascooperflorabarao-dev',
      storageBucket: 'cestascooperflorabarao-dev.appspot.com',
      messagingSenderId: '384118273017',
      appId: '1:384118273017:web:046a319cf0b479f7d2c328',
    },
  },
  prod: {
    FirebaseConfig: {
      apiKey: "AIzaSyAKufHFIlzA2k26_PO4Yfx03pUqtfLHAKw",
      authDomain: "cestascooperflorabarao.firebaseapp.com",
      databaseURL: 'https://cestas-cooperflora-barao.firebaseio.com',
      projectId: "cestascooperflorabarao",
      storageBucket: "cestascooperflorabarao.appspot.com",
      messagingSenderId: "1021764633897",
      appId: "1:1021764633897:web:2ac317b9efd23a3306a338"
    },
  },
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
  // What is __DEV__ ?
  // This variable is set to true when react-native is running in Dev mode.
  // __DEV__ is true when run locally, but false when published.
  // if (__DEV__) {
  //   console.log('Dev environment');
  //   return ENV.dev;
  // }
  if (env === 'prod') {
    console.log('Prod environment');
    return ENV.prod;
  }
  console.log('Dev environment');
  return ENV.dev;
};

export default getEnvVars;

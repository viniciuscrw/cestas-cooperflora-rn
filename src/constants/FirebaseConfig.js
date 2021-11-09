// Import getEnvVars() from environment.js
import getEnvVars from '../../environment';

const { FirebaseConfig } = getEnvVars();

console.log(FirebaseConfig);

export default { FirebaseConfig };

// const FirebaseConfig = {
//   apiKey: 'AIzaSyAOyjOVcCZnHRzATllhAh8x48sg8kMFphY',
//   authDomain: 'cestas-cooperflora-dev-1375c.firebaseapp.com',
//   databaseURL: 'https://cestas-cooperflora-dev-1375c.firebaseio.com',
//   projectId: 'cestas-cooperflora-dev-1375c',
//   storageBucket: 'cestas-cooperflora-dev-1375c.appspot.com',
//   messagingSenderId: '68980862546',
//   appId: '1:68980862546:web:69a7625891fc43eb3a798b',
// };

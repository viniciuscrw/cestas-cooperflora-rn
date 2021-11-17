// import { NavigationActions } from 'react-navigation';

// let navigator;

// export const setNavigator = (nav) => {
//   navigator = nav;
// };

// export const navigate = (routeName, params) => {
//   navigator.dispatch(NavigationActions.navigate({ routeName, params }));
// };

//------------------------------
import * as React from 'react';

export const navigationRef = React.createRef();

export const navigate = (name, params) => {
  navigationRef.current?.navigate(name, params);
};

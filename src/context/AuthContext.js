// import firebase from 'firebase';
import {
  getAuth,
  updateEmail,
  updatePassword as updatePass,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { auth } from '../constants/FirebaseConfig';
import createDataContext from './createDataContext';
// import 'firebase/firestore';
import { navigate } from '../navigationRef';
import {
  getFirstByAttribute,
  updateDoc,
  updateDocAttribute,
} from '../api/firebase';
import GLOBALS from '../Globals';
import { setPushNotificationToken } from '../utils';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'add_error':
      return { ...state, loading: false, errorMessage: action.payload };
    case 'clear_error':
      return { ...state, loading: false, errorMessage: '' };
    case 'signin':
      return {
        ...state,
        errorMessage: '',
        loading: false,
        authId: action.payload,
      };
    case 'loading':
      return { ...state, errorMessage: '', loading: true };
    case 'check_auth':
      return { ...state, errorMessage: '', loading: false, authorized: true };
    case 'add_user':
      return {
        ...state,
        errorMessage: '',
        loading: false,
        authorized: false,
        userId: action.payload,
      };
    case 'clear_user':
      return {
        ...state,
        errorMessage: '',
        loading: false,
        authorized: null,
        userId: null,
      };
    case 'fetch_logged_user':
      return {
        ...state,
        errorMessage: '',
        loading: false,
        loggedUser: action.payload,
      };
    case 'signout':
      return {
        userId: null,
        authId: null,
        errorMessage: '',
        loading: false,
        authorized: false,
      };
    case 'reset_password':
      return { ...state, errorMessage: '', loading: false };
    case 'update_account':
      return {
        ...state,
        errorMessage: '',
        loading: false,
        loggedUser: action.payload,
      };
    default:
      return state;
  }
};

const tryLocalSignin = (dispatch) => async () => {
  const authId = await AsyncStorage.getItem('authId');

  // firebase.auth().onAuthStateChanged((user) => {
  //   if (!user) {
  //     console.log('User has been logged out. Redirecting to login...');
  //     navigate('SigninScreen');
  //   }
  // });

  const user = await getFirstByAttribute('users', 'authId', authId);
  if (authId && user) {
    console.log(`Local sign in for auth: ${authId}`);
    dispatch({ type: 'signin', payload: authId });
    console.log('[AuthContext] Navegando para Deliveries');
    // navigate('Deliveries');
    navigate('DeliveriesScreen');
  } else {
    console.log('[AuthContext], Se não existir authId e user.');
    navigate('SigninScreen');
  }
};

const onSigninSuccess = (dispatch) => async (email) => {
  // const authId = firebase.auth().currentUser.uid;
  const authId = auth.currentUser.uid;

  console.log(`Sign in success for auth: ${authId}`);
  // console.log(
  //   '[Auth Context - onSignInSuccess]',
  //   JSON.stringify(authId, null, 2)
  // );

  let user = await getFirstByAttribute('users', 'authId', authId);

  if (!user) {
    console.log(
      `No user found with auth {${authId}}. Checking by email: ${email}`
    );
    user = await getFirstByAttribute('users', 'email', email);

    if (user) {
      setPushNotificationToken().then((userPushNotificationToken) => {
        if (!userPushNotificationToken) {
          updateDocAttribute(
            'users',
            user.id,
            'userPushNotificationToken',
            null
          );
        } else {
          updateDocAttribute(
            'users',
            user.id,
            'userPushNotificationToken',
            userPushNotificationToken
          );
        }
      });
      await updateDocAttribute('users', user.id, 'authId', authId);
    }
  }

  if (user) {
    console.log(`User found. Setting user id to async storage: ${user.id}`);
    await AsyncStorage.setItem('userId', user.id);
    await AsyncStorage.setItem('userRole', user.role);
    await AsyncStorage.setItem('authId', authId);

    dispatch({ type: 'signin', payload: authId });
    // navigate('Deliveries');
    navigate('DeliveriesScreen');
  } else {
    console.log(`Error retrieving user for auth: ${authId}`);
    dispatch({
      type: 'add_error',
      payload: 'Algo deu errado com o login.',
    });
  }
};

const signin =
  (dispatch) =>
  async ({ email, password, passwordConfirmation, userId }) => {
    dispatch({ type: 'loading' });
    console.log(
      '[Auth Context - SigIn started]',
      email,
      password,
      passwordConfirmation,
      userId
    );
    if (passwordConfirmation) {
      passwordConfirmation !== password
        ? dispatch({
            type: 'add_error',
            payload: 'As senhas digitadas são divergentes.',
          })
        : signup(dispatch)(email, password, userId);
    } else {
      console.log(`Signing in existing user: ${userId}`);
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        // console.log('[Auth Context - SignIn]', userCredential);
        onSigninSuccess(dispatch)(email);
      } catch (error) {
        const errorMessage =
          error.code === 'auth/wrong-password'
            ? 'Senha inválida.'
            : 'Algo deu errado com o login.';
        dispatch({
          type: 'add_error',
          payload: errorMessage,
        });
        console.log('[Auth Context - SignIn]', error);
      }

      // firebase
      //   .auth()
      //   .signInWithEmailAndPassword(email, password)
      //   .then(() => onSigninSuccess(dispatch)(email))
      //   .catch((err) => {
      //     console.log(err);
      //     const errorMessage =
      //       err.code === 'auth/wrong-password'
      //         ? 'Senha inválida.'
      //         : 'Algo deu errado com o login.';

      //     dispatch({
      //       type: 'add_error',
      //       payload: errorMessage,
      //     });
      //   });
    }
  };

const signup = (dispatch) => (email, password, userId) => {
  console.log(`Creating auth for new user: ${userId}`);

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((data) => {
      console.log(`Updating authId for user: ${userId}`);
      updateDocAttribute('users', userId, 'authId', data.user.uid).then(() =>
        onSigninSuccess(dispatch)(email)
      );
    })
    .catch((err) => {
      console.log(`Error creating auth for new user: ${userId}`, err.code);
      const errorMessage =
        err.code === 'auth/weak-password'
          ? 'A senha deve possuir pelo menos 6 caracteres.'
          : 'Algo deu errado com o login.';

      dispatch({
        type: 'add_error',
        payload: errorMessage,
      });
    });
};

const checkAuthOrUser =
  (dispatch) =>
  async ({ email }) => {
    dispatch({ type: 'loading' });
    console.log(`Checking auth or user for email: ${email}`);

    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      console.log('SignIn Methods =>', signInMethods);
      if (signInMethods.includes('password')) {
        console.log(`Auth found for email: ${email}`);
        const user = await getFirstByAttribute('users', 'email', email);
        if (!user) {
          console.log(`Auth found but user was deleted: ${email}`);
          dispatch({ type: 'add_error', payload: 'E-mail não autorizado.' });
        } else {
          dispatch({ type: 'check_auth' });
        }
      } else {
        await findUser(dispatch)(email);
      }
    } catch (error) {
      const errorMessage =
        error.code === 'auth/invalid-email'
          ? 'Endereço de e-mail inválido.'
          : 'Algo deu errado com a verificação do e-mail. Verifique sua conexão com a Internet.';
      dispatch({ type: 'add_error', payload: errorMessage });
    }

    // auth()
    //   .fetchSignInMethodsForEmail(email)
    //   .then(async (signInMethods) => {
    //     if (
    //       signInMethods.indexOf(
    //         // firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
    //         auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
    //       ) !== -1
    //     ) {
    //       console.log(`Auth found for email: ${email}`);
    //       const user = await getFirstByAttribute('users', 'email', email);

    //       if (!user) {
    //         console.log(`Auth found but user was deleted: ${email}`);
    //         dispatch({ type: 'add_error', payload: 'E-mail não autorizado.' });
    //       } else {
    //         dispatch({ type: 'check_auth' });
    //       }
    //     } else {
    //       await findUser(dispatch)(email);
    //     }
    //   })
    //   .catch((err) => {
    //     const errorMessage =
    //       err.code === 'auth/invalid-email'
    //         ? 'Endereço de e-mail inválido.'
    //         : 'Algo deu errado com a verificação do e-mail. Verifique sua conexão com a Internet.';
    //     dispatch({ type: 'add_error', payload: errorMessage });
    //   });
  };

const findUser = (dispatch) => async (email) => {
  console.log(`No auth. So finding user for email: ${email}`);
  const user = await getFirstByAttribute('users', 'email', email);

  if (user) {
    console.log(`User found by email: ${user.id}`);
    dispatch({
      type: 'add_user',
      payload: user.id,
    });
  } else {
    dispatch({ type: 'add_error', payload: 'E-mail não autorizado.' });
  }
};

const fetchLoggedUser = (dispatch) => async () => {
  dispatch({ type: 'loading' });
  const authId = await AsyncStorage.getItem('authId');
  console.log(`Fetching logged user with auth: ${authId}`);

  const loggedUser = await getFirstByAttribute(
    GLOBALS.COLLECTION.USERS,
    GLOBALS.USER.ATTRIBUTE.AUTH_ID,
    authId
  );

  if (loggedUser) {
    console.log(`Current user: ${JSON.stringify(loggedUser)}`);
    dispatch({ type: 'fetch_logged_user', payload: loggedUser });
  } else {
    console.log(`No user found for auth: ${authId}`);
    navigate('Signin');
  }
};

const clearError = (dispatch) => () => {
  dispatch({ type: 'clear_error' });
};

const clearUserInfo = (dispatch) => () => {
  dispatch({ type: 'clear_user' });
};

const signout = (dispatch) => () => {
  dispatch({ type: 'loading' });

  signOut(auth)
    .then(async () => {
      console.log('[AuthContext] signout sucessfully');
      await AsyncStorage.removeItem('authId');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('group');
      dispatch({ type: 'signout' });
    })
    .catch((error) => {
      console.log('[AuthContext] signout error', error);
    });
};

const resetPassword = (dispatch) => (email) => {
  console.log(`Reseting password for user with email: ${email}`);
  dispatch({ type: 'loading' });
  sendPasswordResetEmail(auth, email)
    .then(() => {
      Alert.alert(
        'E-mail enviado',
        `E-mail enviado com as instruções para redefinição de senha para ${email}`,
        [
          {
            text: 'OK',
          },
        ]
      );
      dispatch({ type: 'reset_password' });
      navigate('SigninScreen');
    })
    .catch((error) => {
      console.log(`Error while reseting password for email: ${email}`, error);
      let errorMessage = 'Algo deu errado com a redefinição de senha.';

      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Endereço de e-mail inválido.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Endereço de e-mail não cadastrado.';
      }

      dispatch({ type: 'add_error', payload: errorMessage });
    });

  // firebase
  //   .auth()
  //   .sendPasswordResetEmail(email)
  //   .then(() => {
  //     Alert.alert(
  //       'E-mail enviado',
  //       `E-mail enviado com as instruções para redefinição de senha para ${email}`,
  //       [
  //         {
  //           text: 'OK',
  //         },
  //       ]
  //     );
  //     dispatch({ type: 'reset_password' });
  //     navigate('SigninScreen');
  //   })
  //   .catch((err) => {
  //     console.log(`Error while reseting password for email: ${email}`, err);
  //     let errorMessage = 'Algo deu errado com a redefinição de senha.';

  //     if (err.code === 'auth/invalid-email') {
  //       errorMessage = 'Endereço de e-mail inválido.';
  //     } else if (err.code === 'auth/user-not-found') {
  //       errorMessage = 'Endereço de e-mail não cadastrado.';
  //     }

  //     dispatch({ type: 'add_error', payload: errorMessage });
  //   });
};

const updateAccount = (dispatch) => async (currentEmail, password, user) => {
  dispatch({ type: 'loading' });
  console.log(`Updating account for user: ${user.id}`);

  if (currentEmail !== user.email) {
    await updateWithEmail(dispatch)(currentEmail, password, user);
  } else {
    await updateDoc(GLOBALS.COLLECTION.USERS, user.id, user);
    dispatch({ type: 'update_account', payload: user });
  }
};

const updateWithEmail = (dispatch) => (currentEmail, password, user) => {
  console.log(
    `Setting new e-mail [${user.email}] for user with e-mail: ${currentEmail}`
  );

  signInWithEmailAndPassword(auth, currentEmail, password)
    .then(
      updateEmail(auth.currentUser, user.email)
        .then(() => {
          updateDoc(GLOBALS.COLLECTION.USERS, user.id, user).then(() => {
            dispatch({ type: 'update_account', payload: user });
          });
        })
        .catch((error) => {
          console.log(
            `Error while updating email for user: ${currentEmail}`,
            error
          );
          user.email = currentEmail;
          updateDoc(GLOBALS.COLLECTION.USERS, user.id, user).then(() => {
            dispatch({ type: 'update_account', payload: user });
          });
        })
    )
    .catch((err) => {
      console.log(err);
      const errorMessage =
        err.code === 'auth/wrong-password'
          ? 'Senha inválida.'
          : 'Algo deu errado com a atualização de senha.';

      dispatch({
        type: 'add_error',
        payload: errorMessage,
      });
    });

  // firebase
  //   .auth()
  //   .signInWithEmailAndPassword(currentEmail, password)
  //   .then((userCredential) => {
  //     userCredential.user
  //       .updateEmail(user.email)
  //       .then(() => {
  //         updateDoc(GLOBALS.COLLECTION.USERS, user.id, user).then(() => {
  //           dispatch({ type: 'update_account', payload: user });
  //         });
  //       })
  //       .catch((err) => {
  //         console.log(
  //           `Error while updating email for user: ${currentEmail}`,
  //           err
  //         );
  //         user.email = currentEmail;
  //         updateDoc(GLOBALS.COLLECTION.USERS, user.id, user).then(() => {
  //           dispatch({ type: 'update_account', payload: user });
  //         });
  //       });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     const errorMessage =
  //       err.code === 'auth/wrong-password'
  //         ? 'Senha inválida.'
  //         : 'Algo deu errado com a atualização de senha.';

  //     dispatch({
  //       type: 'add_error',
  //       payload: errorMessage,
  //     });
  //   });
};

const updatePassword = (dispatch) => async (email, password, newPassword) => {
  dispatch({ type: 'loading' });
  console.log(`Updating password for user: ${email}`);

  try {
    const user = auth.currentUser;
    await updatePass(user, newPassword);
    Alert.alert('Sua senha foi atualizada!', '', [
      {
        text: 'OK',
      },
    ]);
    dispatch({ type: 'update_account' });
    navigate('AccountOptionsScreen');
  } catch (error) {
    console.log(error);
    const errorMessage =
      error.code === 'auth/weak-password'
        ? 'A nova senha deve possuir pelo menos 6 caracteres.'
        : 'Algo deu errado com a atualização de senha.';

    dispatch({
      type: 'add_error',
      payload: errorMessage,
    });
  }

  // firebase
  //   .auth()
  //   .signInWithEmailAndPassword(email, password)
  //   .then((userCredential) => {
  //     userCredential.user
  //       .updatePassword(newPassword)
  //       .then(() => {
  //         Alert.alert('Sua senha foi atualizada!', '', [
  //           {
  //             text: 'OK',
  //           },
  //         ]);
  //         dispatch({ type: 'update_account' });
  //         navigate('AccountOptionsScreen');
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         const errorMessage =
  //           err.code === 'auth/weak-password'
  //             ? 'A nova senha deve possuir pelo menos 6 caracteres.'
  //             : 'Algo deu errado com a atualização de senha.';

  //         dispatch({
  //           type: 'add_error',
  //           payload: errorMessage,
  //         });
  //       });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     const errorMessage =
  //       err.code === 'auth/wrong-password'
  //         ? 'Senha atual inválida.'
  //         : 'Algo deu errado com a atualização de senha.';

  //     dispatch({
  //       type: 'add_error',
  //       payload: errorMessage,
  //     });
  //   });
};

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    signin,
    signout,
    tryLocalSignin,
    checkAuthOrUser,
    fetchLoggedUser,
    clearUserInfo,
    clearError,
    resetPassword,
    updateAccount,
    updatePassword,
  },
  {
    authId: null,
    userId: null,
    authorized: null,
    loggedUser: null,
    errorMessage: '',
    loading: false,
  }
);

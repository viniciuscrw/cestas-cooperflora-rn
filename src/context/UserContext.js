import createDataContext from './createDataContext';
import {
  deleteDoc,
  getFirstByAttribute,
  insertDoc,
  updateDoc,
  getByAttributeOrderingBy,
} from '../api/firebase';
import { navigate } from '../navigationRef';
import GLOBALS from '../Globals';

const userReducer = (state, action) => {
  switch (action.type) {
    case 'fetch_users':
      return { loading: false, users: action.payload };
    case 'fetch_user':
      return { loading: false };
    case 'create_user':
      return { ...state, loading: false };
    case 'update_user':
      return { ...state, loading: false };
    case 'delete_user':
      return { ...state, loading: false };
    case 'loading':
      return { ...state, loading: true };
    case 'add_error':
      return { ...state, loading: false, errorMessage: action.payload };
    case 'clear_error':
      return { ...state, loading: false, errorMessage: '' };
    default:
      return state;
  }
};

const fetchConsumers = (dispatch) => async () => {
  dispatch({ type: 'loading' });
  const consumers = await getByAttributeOrderingBy(
    GLOBALS.COLLECTION.USERS,
    GLOBALS.USER.ATTRIBUTE.ROLE,
    GLOBALS.USER.ROLE.CONSUMER,
    'name'
  );
  dispatch({ type: 'fetch_users', payload: consumers });
};

const fetchOrganizers = (dispatch) => async () => {
  dispatch({ type: 'loading' });
  const organizers = await getByAttributeOrderingBy(
    GLOBALS.COLLECTION.USERS,
    GLOBALS.USER.ATTRIBUTE.ROLE,
    GLOBALS.USER.ROLE.ORGANIZER,
    'name'
  );
  dispatch({ type: 'fetch_users', payload: organizers });
};

const findUserByEmail = (dispatch) => async (email) => {
  dispatch({ type: 'loading' });

  const existingUserWithEmail = await getFirstByAttribute(
    GLOBALS.COLLECTION.USERS,
    GLOBALS.USER.ATTRIBUTE.EMAIL,
    email
  );

  dispatch({ type: 'fetch_user' });
  return existingUserWithEmail;
};

const createUser = (dispatch) => async (name, email, phoneNumber, role) => {
  dispatch({ type: 'loading' });

  const consumerGroupId = GLOBALS.CONSUMER_GROUP.ID;

  const user = {
    name,
    email,
    phoneNumber,
    role,
    consumerGroupId,
    balance: 0.0,
  };

  console.log('Creating user: ' + JSON.stringify(user));
  let routeName =
    role === GLOBALS.USER.ROLE.CONSUMER ? 'Consumers' : 'Organizers';
  insertDoc(GLOBALS.COLLECTION.USERS, user).then(() => {
    dispatch({ type: 'create_user' });
    navigate(routeName);
  });
};

const updateUser = (dispatch) => (id, name, email, phoneNumber, role) => {
  dispatch({ type: 'loading' });

  const user = {
    name,
    email,
    phoneNumber,
  };

  console.log('Updating user: ' + id);
  let routeName =
    role === GLOBALS.USER.ROLE.CONSUMER ? 'Consumers' : 'Organizers';
  updateDoc(GLOBALS.COLLECTION.USERS, id, user).then(() => {
    dispatch({ type: 'update_user' });
    navigate(routeName);
  });
};

const deleteUser = (dispatch) => async (user) => {
  dispatch({ type: 'loading' });

  console.log('Deleting user: ' + user.id);
  deleteDoc(GLOBALS.COLLECTION.USERS, user.id).then(() => {
    dispatch({ type: 'delete_user' });
    console.log('User deleted: ' + user.id);

    if (user.role === GLOBALS.USER.ROLE.CONSUMER) {
      fetchConsumers(dispatch)();
    } else {
      fetchOrganizers(dispatch)();
    }
  });
};

export const { Provider, Context } = createDataContext(
  userReducer,
  {
    fetchConsumers,
    fetchOrganizers,
    findUserByEmail,
    createUser,
    updateUser,
    deleteUser,
  },
  { users: [], loading: false }
);

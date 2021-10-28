import createDataContext from './createDataContext';
import { insertIntoSubcollection, updateDocAttribute } from '../api/firebase';
import GLOBALS from '../Globals';

const paymentReducer = (state, action) => {
  switch (action.type) {
    case 'fetch_payments':
      return { loading: false };
    case 'add_payment':
      return { ...state, loading: false };
    case 'loading':
      return { ...state, loading: true };
    default:
      return state;
  }
};

const createPaymentForUser = (dispatch) => async (user, order) => {
  dispatch({ type: 'loading' });

  console.log(`Creating payment for user: ${user.id}`);

  const userBalance = user.balance ? user.balance : 0;

  const payment = {
    date: new Date().toISOString(),
    userId: user.id,
    orderId: order.id,
    currentBalance: userBalance,
    orderTotalAmount: order.totalAmount,
    totalToBePaid: order.totalAmount - userBalance,
    status: GLOBALS.PAYMENT.STATUS.OPENED,
  };

  await insertIntoSubcollection(
    GLOBALS.COLLECTION.USERS,
    user.id,
    GLOBALS.SUB_COLLECTION.PAYMENTS,
    payment
  );

  const newBalance = userBalance - order.totalAmount;

  await updateDocAttribute(
    GLOBALS.COLLECTION.USERS,
    user.id,
    GLOBALS.USER.ATTRIBUTE.BALANCE,
    newBalance
  );

  dispatch({ type: 'add_payment' });
};

export const { Provider, Context } = createDataContext(
  paymentReducer,
  {
    createPaymentForUser,
  },
  { payments: [], payment: null, loading: false }
);

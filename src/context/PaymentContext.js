import createDataContext from './createDataContext';
import {
  getByIdFromSubcollectionPayments,
  insertIntoSubcollection,
  updateDocInSubcollection,
  updateDocAttribute,
} from '../api/firebase';
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
  let userBalance = user.balance ? user.balance : 0;

  const payment = {
    date: new Date().toISOString(),
    userId: user.id,
    orderId: order.id,
    currentBalance: userBalance,
    orderTotalAmount: order.totalAmount,
    // totalToBePaid: order.totalAmount - userBalance,
    totalToBePaid: order.totalAmount,
    status: GLOBALS.PAYMENT.STATUS.OPENED,
  };

  // Verify if the payment already exists
  let paymentId = null;
  let newBalance = null;
  if (order.paymentId) {
    // Read the current open payment
    const currentPaymentDoc = await getByIdFromSubcollectionPayments(
      GLOBALS.COLLECTION.USERS,
      user.id,
      GLOBALS.SUB_COLLECTION.PAYMENTS,
      order.paymentId
    );
    userBalance += currentPaymentDoc.orderTotalAmount;
    newBalance = userBalance - order.totalAmount;
    payment.currentBalance = userBalance + order.totalAmount;
    payment.totalToBePaid = order.totalAmount - userBalance;

    // update the payment Doc
    await updateDocInSubcollection(
      GLOBALS.COLLECTION.USERS,
      user.id,
      GLOBALS.SUB_COLLECTION.PAYMENTS,
      order.paymentId,
      payment
    );
    newBalance = userBalance - order.totalAmount; // - valor anterior;
    paymentId = order.paymentId;
  } else {
    paymentId = await insertIntoSubcollection(
      GLOBALS.COLLECTION.USERS,
      user.id,
      GLOBALS.SUB_COLLECTION.PAYMENTS,
      payment
    );
    newBalance = userBalance - order.totalAmount;
  }

  await updateDocAttribute(
    GLOBALS.COLLECTION.USERS,
    user.id,
    GLOBALS.USER.ATTRIBUTE.BALANCE,
    newBalance
  );

  // Update the checkbalance attribute. This attribute is used by the group admins to verify if they verify the users payments.
  await updateDocAttribute(
    GLOBALS.COLLECTION.USERS,
    user.id,
    GLOBALS.USER.ATTRIBUTE.CHECKBALANCE,
    true
  );

  // Update order with the payment id.
  await updateDocAttribute(
    GLOBALS.COLLECTION.ORDERS,
    order.id,
    GLOBALS.ORDER.ATTRIBUTE.PAYMENT_ID,
    paymentId
  );

  dispatch({ type: 'add_payment' });
};

export const getPaymentStatusById = (dispatch) => async (user, paymentId) => {
  dispatch({ type: 'loading' });
  const paymentDoc = await getByIdFromSubcollectionPayments(
    GLOBALS.COLLECTION.USERS,
    user.id,
    GLOBALS.SUB_COLLECTION.PAYMENTS,
    paymentId
  );

  return paymentDoc;
};

export const { Provider, Context } = createDataContext(
  paymentReducer,
  {
    createPaymentForUser,
  },
  { payments: [], payment: null, loading: false }
);

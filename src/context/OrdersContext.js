import createDataContext from './createDataContext';
import { getByAttribute } from '../api/firebase';
import GLOBALS from '../Globals';

const orderReducer = (state, action) => {
  switch (action.type) {
    case 'fetch_orders':
      return { loading: false, orders: action.payload };
    case 'loading':
      return { ...state, loading: true };
    default:
      return state;
  }
};

const fetchOrdersByDelivery = (dispatch) => async ({ deliveryId }) => {
  console.log('Fetching orders by delivery...');
  dispatch({ type: 'loading' });

  const orders = await getByAttribute(
    GLOBALS.COLLECTION.ORDERS,
    'deliveryId',
    deliveryId
  );

  // console.log(`Orders: ${JSON.stringify(orders)}`);
  dispatch({ type: 'fetch_orders', payload: orders });
};

export const { Provider, Context } = createDataContext(
  orderReducer,
  {
    fetchOrdersByDelivery,
  },
  { orders: [], loading: false }
);

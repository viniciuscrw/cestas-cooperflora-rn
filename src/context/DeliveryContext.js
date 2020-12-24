import createDataContext from './createDataContext';
import { getGroupDeliveries, insertIntoSubcollection } from '../api/firebase';
import { navigate } from '../navigationRef';
import GLOBALS from '../Globals';

const deliveryReducer = (state, action) => {
  switch (action.type) {
    case 'fetch_deliveries':
      return {
        loading: false,
        nextDelivery: action.payload.nextDelivery,
        lastDeliveries: action.payload.lastDeliveries,
      };
    case 'set_info':
      return {
        ...state,
        loading: false,
        deliveryDate: action.payload.deliveryDate,
        ordersLimitDate: action.payload.ordersLimitDate,
        baseProducts: action.payload.baseProducts,
      };
    case 'add_delivery':
      return { ...state, loading: false };
    case 'loading':
      return { ...state, loading: true };
    default:
      return state;
  }
};

const getNextDelivery = (deliveries) => {
  let nextDelivery = [];
  if (deliveries) {
    const currentDate = new Date();
    nextDelivery = deliveries.filter((delivery) => {
      return delivery.deliveryDate >= currentDate;
    });
  }

  return nextDelivery.length ? nextDelivery[0] : null;
};

const getLastDeliveries = (deliveries) => {
  let lastDeliveries = [];
  if (deliveries) {
    const currentDate = new Date();
    lastDeliveries = deliveries.filter((delivery) => {
      return delivery.deliveryDate < currentDate;
    });
  }

  return lastDeliveries;
};

const fetchDeliveries = (dispatch) => async () => {
  dispatch({ type: 'loading' });
  console.log('Fetching deliveries...');

  const deliveries = await getGroupDeliveries(
    GLOBALS.COLLECTION.GROUPS,
    GLOBALS.CONSUMER_GROUP.ID,
    GLOBALS.COLLECTION.DELIVERIES
  );

  const nextDelivery = getNextDelivery(deliveries);
  const lastDeliveries = getLastDeliveries(deliveries);

  console.log('deliveries: ' + JSON.stringify(deliveries));
  dispatch({
    type: 'fetch_deliveries',
    payload: { nextDelivery, lastDeliveries },
  });
};

const setDeliveryInfo = (dispatch) => async (
  deliveryDate,
  ordersDateLimit,
  ordersTimeLimit,
  baseProducts
) => {
  const limitDateTime = new Date(
    ordersDateLimit.getFullYear(),
    ordersDateLimit.getMonth(),
    ordersDateLimit.getDate(),
    ordersTimeLimit.getHours(),
    ordersTimeLimit.getMinutes()
  );

  console.log(
    'Setting delivery info: {deliveryDate: ' +
      deliveryDate.toString() +
      '; limitDate: ' +
      limitDateTime.toString() +
      '; baseProducts: ' +
      baseProducts +
      '}'
  );

  dispatch({
    type: 'set_info',
    payload: {
      deliveryDate,
      ordersLimitDate: limitDateTime,
      baseProducts,
    },
  });
};

const createDelivery = (dispatch) => async ({ delivery }) => {
  dispatch({ type: 'loading' });
  console.log('Creating new delivery: ' + JSON.stringify(delivery));

  insertIntoSubcollection(
    GLOBALS.COLLECTION.GROUPS,
    GLOBALS.CONSUMER_GROUP.ID,
    GLOBALS.COLLECTION.DELIVERIES,
    delivery
  ).then(() => {
    dispatch({ type: 'add_delivery' });
    navigate('Deliveries');
  });
};

export const { Provider, Context } = createDataContext(
  deliveryReducer,
  {
    fetchDeliveries,
    setDeliveryInfo,
    createDelivery,
  },
  { deliveries: null, loading: false }
);

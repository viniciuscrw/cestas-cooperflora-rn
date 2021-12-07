import createDataContext from './createDataContext';
import {
  deleteDocInSubcollection,
  getByIdFromSubcollection,
  getGroupDeliveries,
  insertIntoSubcollection,
  updateDocInSubcollection,
} from '../api/firebase';
import GLOBALS from '../Globals';

const deliveryReducer = (state, action) => {
  switch (action.type) {
    case 'fetch_deliveries':
      return {
        loading: false,
        nextDelivery: action.payload.nextDelivery,
        lastDeliveries: action.payload.lastDeliveries,
      };
    case 'fetch_delivery':
      return {
        ...state,
        loading: false,
        delivery: action.payload.delivery,
      };
    case 'set_info':
      return {
        ...state,
        loading: false,
        deliveryDate: action.payload.deliveryDate,
        ordersLimitDate: action.payload.ordersLimitDate,
        baseProducts: action.payload.baseProducts,
        baseProductsPrice: action.payload.baseProductsPrice,
        deliveryFee: action.payload.deliveryFee,
      };
    case 'add_delivery':
      return { ...state, loading: false };
    case 'delete_delivery':
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

const fetchDelivery = (dispatch) => async (deliveryId) => {
  dispatch({ type: 'loading' });
  console.log(`Fetching delivery by id: ${deliveryId}...`);

  const delivery = await getByIdFromSubcollection(
    GLOBALS.COLLECTION.GROUPS,
    GLOBALS.CONSUMER_GROUP.ID,
    GLOBALS.COLLECTION.DELIVERIES,
    deliveryId
  );

  dispatch({ type: 'fetch_delivery', payload: { delivery } });
  return delivery;
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

  dispatch({
    type: 'fetch_deliveries',
    payload: { nextDelivery, lastDeliveries },
  });
};

const setDeliveryInfo =
  (dispatch) =>
  async (
    deliveryDate,
    ordersDateLimit,
    ordersTimeLimit,
    baseProducts,
    baseProductsPrice,
    deliveryFee
  ) => {
    const limitDateTime = new Date(
      ordersDateLimit.getFullYear(),
      ordersDateLimit.getMonth(),
      ordersDateLimit.getDate(),
      ordersTimeLimit.getHours(),
      ordersTimeLimit.getMinutes()
    );

    dispatch({
      type: 'set_info',
      payload: {
        deliveryDate,
        ordersLimitDate: limitDateTime,
        baseProducts,
        baseProductsPrice,
        deliveryFee,
      },
    });
  };

const createDelivery =
  (dispatch) =>
  async ({ delivery }) => {
    dispatch({ type: 'loading' });
    console.log(`Creating new delivery: ${JSON.stringify(delivery)}`);

    insertIntoSubcollection(
      GLOBALS.COLLECTION.GROUPS,
      GLOBALS.CONSUMER_GROUP.ID,
      GLOBALS.COLLECTION.DELIVERIES,
      delivery
    ).then(() => {
      console.log('[createDelivery delivery context] then');
      dispatch({ type: 'add_delivery' });
      // navigate('Deliveries');
    });
  };

const updateDelivery =
  (dispatch) =>
  async ({ deliveryId, delivery }) => {
    dispatch({ type: 'loading' });
    console.log(`Updating delivery: ${JSON.stringify(delivery)}`);

    updateDocInSubcollection(
      GLOBALS.COLLECTION.GROUPS,
      GLOBALS.CONSUMER_GROUP.ID,
      GLOBALS.COLLECTION.DELIVERIES,
      deliveryId,
      delivery
    ).then(() => {
      dispatch({ type: 'add_delivery' });
    });
  };

const deleteDelivery =
  (dispatch) =>
  async ({ deliveryId }) => {
    dispatch({ type: 'loading' });
    console.log(`Deleting delivery with id: ${deliveryId}`);

    deleteDocInSubcollection(
      GLOBALS.COLLECTION.GROUPS,
      GLOBALS.CONSUMER_GROUP.ID,
      GLOBALS.COLLECTION.DELIVERIES,
      deliveryId
    ).then(() => {
      dispatch({ type: 'delete_delivery' });
      // navigate('Deliveries');
    });
  };

export const { Provider, Context } = createDataContext(
  deliveryReducer,
  {
    fetchDeliveries,
    fetchDelivery,
    setDeliveryInfo,
    createDelivery,
    updateDelivery,
    deleteDelivery,
  },
  { deliveries: null, loading: false, delivery: null }
);

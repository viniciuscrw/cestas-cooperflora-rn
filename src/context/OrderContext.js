import createDataContext from './createDataContext';
import { getByAttribute, insertDoc, updateDoc } from '../api/firebase';
import GLOBALS from '../Globals';

const orderReducer = (state, action) => {
  switch (action.type) {
    case 'start_order':
      return {
        ...state,
        loading: false,
        order: {
          ...state.order,
          baseProducts: 0,
          extraProducts: action.payload.extraProducts,
        },
      };
    case 'add_base_products': {
      const updatedTotalAmount =
        state.order.totalAmount === 0
          ? action.payload.baseProductsPrice + action.payload.deliveryFee
          : state.order.totalAmount + action.payload.baseProductsPrice;

      return {
        ...state,
        loading: false,
        order: {
          ...state.order,
          baseProducts: state.order.baseProducts + 1,
          totalAmount: updatedTotalAmount,
        },
      };
    }
    case 'remove_base_products': {
      const updatedTotalAmount =
        state.order.totalAmount ===
        action.payload.baseProductsPrice + action.payload.deliveryFee
          ? 0
          : state.order.totalAmount - action.payload.baseProductsPrice;

      return {
        ...state,
        loading: false,
        order: {
          ...state.order,
          baseProducts:
            state.order.baseProducts > 0 ? state.order.baseProducts - 1 : 0,
          totalAmount: updatedTotalAmount,
        },
      };
    }
    case 'add_product': {
      const updatedTotalAmount =
        state.order.totalAmount === 0
          ? action.payload.productPrice + action.payload.deliveryFee
          : state.order.totalAmount + action.payload.productPrice;

      return {
        ...state,
        loading: false,
        order: {
          ...state.order,
          extraProducts: action.payload.extraProducts,
          totalAmount: updatedTotalAmount,
        },
      };
    }
    case 'remove_product': {
      const updatedTotalAmount =
        state.order.totalAmount ===
        action.payload.productPrice + action.payload.deliveryFee
          ? 0
          : state.order.totalAmount - action.payload.productPrice;

      return {
        ...state,
        loading: false,
        order: {
          ...state.order,
          extraProducts: action.payload.extraProducts,
          totalAmount: updatedTotalAmount,
        },
      };
    }
    case 'fetch_orders':
      return { ...state, loading: false, orders: action.payload };
    case 'fetch_order':
      return { ...state, loading: false, order: action.payload };
    case 'add_order':
      return {
        ...state,
        loading: false,
      };
    case 'loading':
      return { ...state, loading: true };
    default:
      return state;
  }
};

const startOrder = (dispatch) => (extraProducts) => {
  const newExtraProducts = [];

  extraProducts.forEach((extraProduct) => {
    newExtraProducts.push({
      productTitle: extraProduct.name,
      productPrice: extraProduct.price,
      quantity: 0,
    });
  });

  dispatch({ type: 'start_order', payload: newExtraProducts });
};

const addBaseProducts = (dispatch) => (baseProductsPrice, deliveryFee) => {
  dispatch({
    type: 'add_base_products',
    payload: { baseProductsPrice, deliveryFee },
  });
};

const removeBaseProducts = (dispatch) => (baseProductsPrice, deliveryFee) => {
  dispatch({
    type: 'remove_base_products',
    payload: { baseProductsPrice, deliveryFee },
  });
};

const addProduct = (dispatch) => (extraProducts, product, deliveryFee) => {
  const productIndex = extraProducts.findIndex(
    (prod) => prod.productTitle === product.productTitle
  );
  extraProducts[productIndex].quantity += 1;
  dispatch({
    type: 'add_product',
    payload: { extraProducts, productPrice: product.productPrice, deliveryFee },
  });
};

const removeProduct = (dispatch) => (extraProducts, product, deliveryFee) => {
  const productIndex = extraProducts.findIndex(
    (prod) => prod.productTitle === product.productTitle
  );

  if (extraProducts[productIndex].quantity > 0) {
    extraProducts[productIndex].quantity -= 1;
    dispatch({
      type: 'remove_product',
      payload: {
        extraProducts,
        productPrice: product.productPrice,
        deliveryFee,
      },
    });
  }
};

const fetchOrdersByDelivery = (dispatch) => async (deliveryId) => {
  console.log('Fetching orders by delivery...');
  dispatch({ type: 'loading' });

  const orders = await getByAttribute(
    GLOBALS.COLLECTION.ORDERS,
    'deliveryId',
    deliveryId
  );

  dispatch({ type: 'fetch_orders', payload: orders });
};

const fetchUserOrder = (dispatch) => async (
  userId,
  deliveryId,
  extraProducts
) => {
  console.log('Fetching user order by delivery...');
  dispatch({ type: 'loading' });

  getByAttribute(GLOBALS.COLLECTION.ORDERS, 'userId', userId)
    .then((data) => {
      const orderData = data.filter((order) => order.deliveryId === deliveryId);
      if (orderData.length > 0) {
        dispatch({
          type: 'fetch_order',
          payload: orderData[0],
        });
      } else {
        startOrder(dispatch)(extraProducts);
      }
    })
    .catch((error) => {
      console.log('[Order Context - Fetching order] - ERRO', error);
    });
};

const addOrder = (dispatch) => (userId, userName, deliveryId, order) => {
  dispatch({ type: 'loading' });
  console.log('[Order Context] adding Order ---------');

  const extraProducts = order.extraProducts.filter((prod) => prod.quantity > 0);

  const newOrder = {
    ...order,
    userId,
    userName,
    deliveryId,
    extraProducts,
  };

  getByAttribute(GLOBALS.COLLECTION.ORDERS, 'userId', userId).then((data) => {
    const deliveryOrder = data.filter(
      (orderData) => orderData.deliveryId === deliveryId
    );
    if (deliveryOrder.length > 0) {
      console.log('[Add order] update order');
      const orderId = deliveryOrder[0].id;
      newOrder.updatedAt = new Date().toISOString();
      updateDoc(GLOBALS.COLLECTION.ORDERS, orderId, newOrder).then(() =>
        dispatch({ type: 'add_order', payload: newOrder })
      );
    } else {
      console.log('[Add order] new order');
      newOrder.date = new Date().toISOString();
      insertDoc(GLOBALS.COLLECTION.ORDERS, newOrder)
        .then(() => dispatch({ type: 'add_order', payload: newOrder }))
        .catch((error) => {
          console.log('[Order Context - Add order] - ERRO', error);
        });
    }
  });
};

export const { Provider, Context } = createDataContext(
  orderReducer,
  {
    startOrder,
    addBaseProducts,
    removeBaseProducts,
    addProduct,
    removeProduct,
    fetchOrdersByDelivery,
    fetchUserOrder,
    addOrder,
  },
  {
    orders: [],
    order: {
      userId: '',
      userName: '',
      deliveryId: '',
      baseProducts: 0,
      extraProducts: [],
      totalAmount: 0,
      date: '',
    },
    loading: false,
  }
);

// import firebase from 'firebase';
// import 'firebase/firestore';
import { doc, runTransaction } from 'firebase/firestore';
import createDataContext from './createDataContext';

import {
  getByAttribute,
  insertDocAndRetrieveId,
  updateDoc,
} from '../api/firebase';
import GLOBALS from '../Globals';
import { showAlert } from '../helper/HelperFunctions';
import { db } from '../constants/FirebaseConfig';

const orderReducer = (state, action) => {
  switch (action.type) {
    case 'start_order':
      return {
        ...state,
        loading: false,
        initialProducts: JSON.parse(JSON.stringify(action.payload)),
        order: {
          baseProducts: 0,
          extraProducts: action.payload,
          productsPriceSum: 0,
          totalAmount: 0,
          status: GLOBALS.ORDER.STATUS.OPENED,
        },
      };
    case 'add_base_products':
      return {
        ...state,
        loading: false,
        order: {
          ...state.order,
          baseProducts: state.order.baseProducts + 1,
          productsPriceSum: state.order.productsPriceSum + action.payload,
        },
      };
    case 'remove_base_products':
      return {
        ...state,
        loading: false,
        order: {
          ...state.order,
          baseProducts:
            state.order.baseProducts > 0 ? state.order.baseProducts - 1 : 0,
          productsPriceSum: state.order.productsPriceSum - action.payload,
        },
      };
    case 'add_product': {
      return {
        ...state,
        loading: false,
        order: {
          ...state.order,
          extraProducts: action.payload.extraProducts,
          productsPriceSum:
            state.order.productsPriceSum + action.payload.productPrice,
        },
      };
    }
    case 'remove_product': {
      return {
        ...state,
        loading: false,
        order: {
          ...state.order,
          extraProducts: action.payload.extraProducts,
          productsPriceSum:
            state.order.productsPriceSum - action.payload.productPrice,
        },
      };
    }
    case 'fetch_orders':
      return { ...state, loading: false, orders: action.payload };
    case 'fetch_order':
      return {
        ...state,
        loading: false,
        order: action.payload,
        initialProducts:
          action.payload && action.payload.extraProducts
            ? JSON.parse(JSON.stringify(action.payload.extraProducts))
            : [],
      };
    case 'add_order':
      return {
        ...state,
        order: action.payload,
        initialProducts: JSON.parse(
          JSON.stringify(action.payload.extraProducts)
        ),
        loading: false,
      };
    case 'loading':
      return { ...state, loading: true };
    case 'stop_loading':
      return { ...state, loading: false };
    default:
      return state;
  }
};

const startOrder = (dispatch) => (extraProducts) => {
  console.log('Starting new order...');
  const newExtraProducts = [];

  extraProducts.forEach((extraProduct) => {
    newExtraProducts.push({
      productId: extraProduct.id,
      productTitle: extraProduct.name,
      productPrice: extraProduct.price,
      quantity: 0,
    });
  });

  dispatch({ type: 'start_order', payload: newExtraProducts });
};

const addBaseProducts = (dispatch) => (baseProductsPrice) => {
  dispatch({ type: 'add_base_products', payload: baseProductsPrice });
};

const removeBaseProducts = (dispatch) => (baseProductsPrice) => {
  dispatch({ type: 'remove_base_products', payload: baseProductsPrice });
};

const addProduct = (dispatch) => (extraProducts, product, initialProducts) => {
  const productIndex = extraProducts.findIndex(
    (prod) => prod.productId === product.productId
  );

  const initialIndex = initialProducts.findIndex(
    (prod) => prod.productId === product.productId
  );

  if (
    extraProducts[productIndex].maxQuantity == null ||
    product.quantity < extraProducts[productIndex].maxQuantity ||
    product.quantity < initialProducts[initialIndex]?.quantity
  ) {
    extraProducts[productIndex].quantity += 1;
    dispatch({
      type: 'add_product',
      payload: { extraProducts, productPrice: product.productPrice },
    });
    return;
  }

  showAlert(
    `Quantidade indisponível de ${extraProducts[productIndex].productTitle}.`
  );
};

const removeProduct = (dispatch) => (extraProducts, product) => {
  const productIndex = extraProducts.findIndex(
    (prod) => prod.productTitle === product.productTitle
  );

  if (extraProducts[productIndex].quantity > 0) {
    extraProducts[productIndex].quantity -= 1;
    dispatch({
      type: 'remove_product',
      payload: { extraProducts, productPrice: product.productPrice },
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

const fetchUserOrder =
  (dispatch) => async (userId, deliveryId, extraProducts) => {
    console.log('Fetching user order by delivery...');
    dispatch({ type: 'loading' });

    getByAttribute(GLOBALS.COLLECTION.ORDERS, 'userId', userId)
      .then((data) => {
        const orderData = data.filter(
          (order) => order.deliveryId === deliveryId
        );
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

const getUserOrder = (dispatch) => async (userId, deliveryId) => {
  console.log('Get user order by delivery...');
  dispatch({ type: 'loading' });

  const orderData = await getByAttribute(
    GLOBALS.COLLECTION.ORDERS,
    'userId',
    userId
  );
  const order = orderData.filter((data) => data.deliveryId === deliveryId);

  if (order.length > 0) {
    dispatch({ type: 'fetch_order', payload: order[0] });
    return order[0];
  }

  dispatch({ type: 'fetch_order', payload: null });

  return null;
};

const findExtraProductsToUpdate = (
  updatedOrderProducts,
  initialOrderProducts
) => {
  const extraProductsToUpdate = [];

  updatedOrderProducts.forEach((orderProduct) => {
    initialOrderProducts.forEach((initialProduct) => {
      if (
        orderProduct.productId === initialProduct.productId &&
        orderProduct.quantity !== initialProduct.quantity
      ) {
        extraProductsToUpdate.push({
          productId: orderProduct.productId,
          productTitle: orderProduct.productTitle,
          quantity: orderProduct.quantity,
          quantityDiff: orderProduct.quantity - initialProduct.quantity,
        });
      }
    });
  });

  updatedOrderProducts
    .filter((updatedProduct) => {
      const ids = initialOrderProducts.map((prod) => prod.productId);
      return (
        !ids.includes(updatedProduct.productId) && updatedProduct.quantity > 0
      );
    })
    .forEach((updatedProduct) => {
      const extraToUpdateIds = extraProductsToUpdate.map(
        (extra) => extra.productId
      );
      if (!extraToUpdateIds.includes(updatedProduct.productId)) {
        extraProductsToUpdate.push({
          productId: updatedProduct.productId,
          productTitle: updatedProduct.productTitle,
          quantity: updatedProduct.quantity,
          quantityDiff: updatedProduct.quantity,
        });
      }
    });

  return extraProductsToUpdate;
};

const updateDeliveryExtraProductsQuantities =
  (dispatch) => async (deliveryId, extraProductsToUpdate) => {
    // const deliveryRef = await db
    //   .collection(GLOBALS.COLLECTION.GROUPS)
    //   .doc(GLOBALS.CONSUMER_GROUP.ID)
    //   .collection(GLOBALS.COLLECTION.DELIVERIES)
    //   .doc(deliveryId);
    const deliveryRef = doc(
      db,
      GLOBALS.COLLECTION.GROUPS,
      GLOBALS.CONSUMER_GROUP.ID,
      GLOBALS.COLLECTION.DELIVERIES,
      deliveryId
    );

    try {
      await runTransaction(db, async (transaction) => {
        console.log('Update delivery extra products - Init transaction');
        const deliveryDoc = await transaction.get(deliveryRef);
        if (!deliveryDoc.exists) {
          console.log(
            `Delivery ${deliveryId} not found to update its products.`
          );
        } else {
          const delivery = deliveryDoc.data();
          // console.log(
          //   `[Order Context] delivery before.${JSON.stringify(
          //     delivery.extraProducts,
          //     null,
          //     2
          //   )}`
          // );
          delivery.extraProducts.forEach((product, index) => {
            const extraToUpdateArr = extraProductsToUpdate.filter(
              (extra) => extra.productId === product.id
            );
            const extraToUpdate = extraToUpdateArr ? extraToUpdateArr[0] : null;

            if (!extraToUpdate) {
              return;
            }

            if (product.availableQuantity != null) {
              const currentAvailableQuantity =
                product.availableQuantity - product.orderedQuantity;

              console.log(`Current available: ${currentAvailableQuantity}`);
              console.log(`To update: ${JSON.stringify(extraToUpdate)}`);

              if (
                extraToUpdate.quantityDiff > 0 &&
                extraToUpdate.quantityDiff > currentAvailableQuantity
              ) {
                dispatch({ type: 'stop_loading' });
                // eslint-disable-next-line no-throw-literal
                throw `Não há quantidade suficiente disponível de ${extraToUpdate.productTitle}. Por favor, tente refazer o pedido com uma quantidade menor.`;
              }
            }

            // TODO: Considerar alteraçao da quantidade maxima permitida por pessoa durante o pedido

            product.orderedQuantity += extraToUpdate.quantityDiff;
            delivery.extraProducts[index] = product;
          });
          console.log(
            `Atualizando extras: ${JSON.stringify(delivery.extraProducts)}`
          );
          transaction.update(deliveryRef, {
            extraProducts: delivery.extraProducts,
          });
          // console.log(
          //   `[Order Context] delivery before.${JSON.stringify(
          //     delivery.extraProducts,
          //     null,
          //     2
          //   )}`
          // );
        }
      });
      console.log('Transaction successfully committed!');
    } catch (e) {
      console.log('Transaction failed: ', e);
    }

    // await db.runTransaction((transaction) => {
    //   console.log('Update delivery extra products - Init transaction');
    //   return transaction.get(deliveryRef).then((deliveryDoc) => {
    //     if (!deliveryDoc.exists) {
    //       console.log(
    //         `Delivery ${deliveryId} not found to update its products.`
    //       );
    //     } else {
    //       const delivery = deliveryDoc.data();
    //       delivery.extraProducts.forEach((product, index) => {
    //         const extraToUpdateArr = extraProductsToUpdate.filter(
    //           (extra) => extra.productId === product.id
    //         );
    //         const extraToUpdate = extraToUpdateArr ? extraToUpdateArr[0] : null;

    //         if (!extraToUpdate) {
    //           return;
    //         }

    //         if (product.availableQuantity != null) {
    //           const currentAvailableQuantity =
    //             product.availableQuantity - product.orderedQuantity;

    //           console.log(`Current available: ${currentAvailableQuantity}`);
    //           console.log(`To update: ${JSON.stringify(extraToUpdate)}`);

    //           if (
    //             extraToUpdate.quantityDiff > 0 &&
    //             extraToUpdate.quantityDiff > currentAvailableQuantity
    //           ) {
    //             dispatch({ type: 'stop_loading' });
    //             throw `Não há quantidade suficiente disponível de ${extraToUpdate.productTitle}. Por favor, tente refazer o pedido com uma quantidade menor.`;
    //           }
    //         }

    //         // TODO: Considerar alteraçao da quantidade maxima permitida por pessoa durante o pedido

    //         product.orderedQuantity += extraToUpdate.quantityDiff;
    //         delivery.extraProducts[index] = product;
    //       });
    //       console.log(
    //         `Atualizando extras: ${JSON.stringify(delivery.extraProducts)}`
    //       );
    //       transaction.update(deliveryRef, {
    //         extraProducts: delivery.extraProducts,
    //       });
    //     }
    //   });
    // });
  };

const addOrder =
  (dispatch) =>
  async (userId, userName, deliveryId, deliveryFee, order, initialProducts) => {
    dispatch({ type: 'loading' });
    console.log('[Order Context] adding Order ---------');
    // console.log(`Initial products: ${JSON.stringify(initialProducts)}`);
    // console.log(`Updated products: ${JSON.stringify(order.extraProducts)}`);

    const extraProducts = order.extraProducts
      ? order.extraProducts.filter((prod) => prod.quantity > 0)
      : [];

    const totalAmount =
      order.productsPriceSum > 0 ? order.productsPriceSum + deliveryFee : 0;

    const newOrder = {
      ...order,
      userId,
      userName,
      deliveryId,
      extraProducts,
      totalAmount,
      status:
        totalAmount > 0
          ? GLOBALS.ORDER.STATUS.OPENED
          : GLOBALS.ORDER.STATUS.CANCELED,
    };

    const extraProductsToUpdate = findExtraProductsToUpdate(
      order.extraProducts,
      initialProducts
    );

    if (extraProductsToUpdate.length > 0) {
      console.log(
        `Updating delivery extra products for delivery=${deliveryId} and user=${userId}; products to update: ${JSON.stringify(
          extraProductsToUpdate
        )}`
      );
      await updateDeliveryExtraProductsQuantities(dispatch)(
        deliveryId,
        extraProductsToUpdate
      );
    }

    if (order.id && order.id.length > 0) {
      console.log('[Add order] update order');
      const orderId = order.id;
      newOrder.updatedAt = new Date().toISOString();
      updateDoc(GLOBALS.COLLECTION.ORDERS, orderId, newOrder).then(() =>
        dispatch({ type: 'add_order', payload: newOrder })
      );
    } else {
      console.log('[Add order] new order');
      newOrder.date = new Date().toISOString();
      insertDocAndRetrieveId(GLOBALS.COLLECTION.ORDERS, newOrder)
        .then((orderId) => {
          newOrder.id = orderId;
          dispatch({ type: 'add_order', payload: newOrder });
        })
        .catch((error) => {
          console.log('[Order Context - Add order] - ERRO', error);
        });
    }
  };

const completeOrderDelivery =
  (dispatch) => (userId, userName, deliveryId, deliveryFee, order) => {
    console.log('Completing order delivery...');
    dispatch({ type: 'loading' });

    const extraProducts = order.extraProducts
      ? order.extraProducts.filter((prod) => prod.quantity > 0)
      : [];

    const totalAmount =
      order.productsPriceSum > 0 ? order.productsPriceSum + deliveryFee : 0;

    const newOrder = {
      ...order,
      userId,
      userName,
      deliveryId,
      extraProducts,
      totalAmount,
      updatedAt: new Date().toISOString(),
      status: GLOBALS.ORDER.STATUS.COMPLETED,
    };

    updateDoc(GLOBALS.COLLECTION.ORDERS, order.id, newOrder)
      .then(() => {
        dispatch({ type: 'add_order', payload: newOrder });
      })
      .catch((error) =>
        console.log('[Order context] - Error completing delivery', error)
      );

    return newOrder;
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
    completeOrderDelivery,
    getUserOrder,
  },
  {
    orders: [],
    order: {
      userId: '',
      userName: '',
      deliveryId: '',
      baseProducts: 0,
      extraProducts: [],
      productsPriceSum: 0,
      totalAmount: 0,
      date: '',
      updatedAt: '',
      updatedBy: '',
      status: '',
    },
    loading: false,
  }
);

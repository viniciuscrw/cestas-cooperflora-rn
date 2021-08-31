import React, { useReducer, useState } from 'react';
import OrderProduct from '../../models/order-product';
import Order from '../../models/order';
import {
    insertDoc,
    getByAttribute,
    updateDoc
} from '../api/firebase';
import GLOBALS from '../Globals';

const initialState = {
    isLoading: false,
    order: {
        userId: '',
        deliveryId: '',
        baseProducts: 0,
        extraProducts: [],
        totalAmount: 0,
        date: ''
    }
}

const calcTotalAmount = (order, baseProductsPrice) => {
    let totalAmount = 0;
    order.extraProducts.forEach(item => {
        totalAmount = totalAmount + (item.quantity * item.productPrice)
    });
    totalAmount = totalAmount + (order.baseProducts * baseProductsPrice); 
    return totalAmount;
}

const OrderContext = React.createContext();
const OrderReducer = (state, action) => {
    switch (action.type) {
        case 'IS_LOADING':
            return ({ ...state, isLoading: true });
        case 'START_ORDER':
            // console.log('[Start order] Reducer');
            // console.log('[Start order] Reducer - state', state);
            // console.log('[Start order] Reducer - extra products in action', action.extraProducts)
            // console.log('[Order reducer - Start Order] - action', action);
            let newExtraProducts = [];
            action.extraProducts.map((extraProduct) => {
                newExtraProducts.push({
                    productTitle: extraProduct.name,
                    productPrice: extraProduct.price,
                    quantity: 0
                });
                // console.log('[Order Context - Start Order] updatedOrder in loop', updatedOrder);
                // console.log('[Order Context - Start Order] in loop', Order);
            });
            // console.log('[Order reducer - Start Order] new extra products', newExtraProducts);
            let updatedOrder = {
                ...state.order,
                baseProducts: 0,
                extraProducts: newExtraProducts
            }
            let updatedState = {
                ...state,
                isLoading: false,
                order: updatedOrder
            }
            return (updatedState);
        case 'ADD_BASE_PRODUCTS_TO_ORDER':
            // let updatedOrNewBaseProducts;
            // if (state.baseProducts) {
            //     updatedOrNewBaseProducts = state.order.baseProducts + 1;
            // } else {
            //     updatedOrNewBaseProducts = 1;
            // }
            let updatedOrNewBaseProducts = state.order.baseProducts + 1;

            // console.log('[Order Context - Reducer Add base products to order - bef]', state);
            // let totalAmount = calcTotalAmount(state.order, action.baseProductsPrice);
            let totalAmount = state.order.totalAmount + action.baseProductsPrice;
            updatedOrder = {
                ...state.order,
                totalAmount: totalAmount,
                baseProducts: updatedOrNewBaseProducts
            };
            updatedState = {
                ...state,
                order: updatedOrder
            }
            // console.log('[Order Context - Reducer Add base products to order - after]', updatedState);

            return (updatedState);
        // console.log('[Order Context] exit', Order.products);
        case 'REMOVE_BASE_PRODUCTS_FROM_ORDER':
            // console.log('[Order Context - Reducer Remove base products to order - bef]', state);
            updatedState = { ...state };
            if (state.order.baseProducts > 0) {
                let updatedBaseProducts = state.order.baseProducts - 1;
                totalAmount = state.order.totalAmount - action.baseProductsPrice;
                updatedOrder = {
                    ...state.order,
                    totalAmount: totalAmount,
                    baseProducts: updatedBaseProducts
                };
                udpatedState = {
                    ...state,
                    order: updatedOrder
                }
            }
            // console.log('[Or/der Context - Reducer Remove base products to order - after updatedState]', udpatedState);
            return (udpatedState);
        case 'ADD_PRODUCT_TO_ORDER':
            // console.log('[Order Context - Reducer Add produce to order - action]', state);
            updatedExtraProducts = state.order.extraProducts;
            let productIndex = updatedExtraProducts.findIndex(prod => prod.productTitle === action.extraProduct.productTitle);
            updatedExtraProducts[productIndex].quantity++;
            totalAmount = state.order.totalAmount + updatedExtraProducts[productIndex].productPrice;
            updatedOrder = {
                ...state.order,
                totalAmount: totalAmount,
                extraProducts: updatedExtraProducts
            };
            updatedState = {
                ...state,
                order: updatedOrder
            }
            // console.log('[Order Context - Reducer Add produce to order - action]', updatedOrder);
            return (updatedState);
        case 'REMOVE_PRODUCT_FROM_ORDER':
            updatedExtraProducts = state.order.extraProducts;
            // console.log('[Order Context] updatedExtraProducts', updatedExtraProducts);
            productIndex = updatedExtraProducts.findIndex(prod => prod.productTitle === action.extraProduct.productTitle);
            if (updatedExtraProducts[productIndex].quantity > 0) {
                updatedExtraProducts[productIndex].quantity--;
                totalAmount = state.order.totalAmount - updatedExtraProducts[productIndex].productPrice;
            }
            // console.log('[Order Context] updatedExtraProducts', updatedExtraProducts[productIndex]);
            updatedOrder = {
                ...state.order,
                totalAmount: totalAmount,
                extraProducts: updatedExtraProducts
            };
            updatedState = {
                ...state,
                order: updatedOrder
            }
            return (updatedState);
        case 'FETCH_ORDER':
            console.log('[Fetch order] Reducer');
            // console.log('[Order Reducer - Fetch Order] state', state.extraProducts);
            // console.log('[Order Reducer - Fetch Order] action.orderData', action.orderData[0].extraProducts);
            let extraProducts = action.extraProducts;
            // console.log('[Order Reducer - Fetch Order] extraProducts', extraProducts);
            newExtraProducts = action.orderData[0].extraProducts;
            // console.log('[Order Reducer - Fetch Order] action newextraProducts', newExtraProducts);
            extraProducts.map((item) => {
                // console.log(item + " = " + extraProducts[item]);
                let isProduct = false;
                newExtraProducts.map((prod) => {
                    if (prod.productTitle === item.name) {
                        // console.log("Produto já existe");
                        isProduct = true;
                    }
                });
                if (!isProduct) {
                    newExtraProducts.push({
                        productPrice: item.price,
                        productTitle: item.name,
                        quantity: 0
                    })
                }
            });
            updatedOrder = {
                userId: action.orderData[0].userId,
                deliveryId: action.orderData[0].deliveryId,
                baseProducts: action.orderData[0].baseProducts,
                extraProducts: newExtraProducts,
                totalAmount: action.orderData[0].totalAmount,
                date: action.orderData[0].date
            }
            updatedState = {
                ...state,
                isLoading: false,
                order: updatedOrder
            }
            // console.log('[Order Reducer - Fetch Order] updated order', updatedOrder);
            return (updatedState);
        case 'ADD_ORDER':
            console.log('[Order Reducer - Add Order] state', state);
            updatedState = {
                ...state,
                isLoading: false
            }
            console.log('[Order Reducer - Add Order] updated state', updatedState);
            return (updatedState);
        default:
            return state;
    }
}

export const OrderProvider = ({ children }) => {

    const [order, dispatch] = useReducer(OrderReducer, initialState);

    // const [order, setOrder] = useState();

    const startOrder = (extraProducts) => {
        dispatch({ type: 'IS_LOADING' });
        dispatch({ type: 'START_ORDER', extraProducts: extraProducts });
    }

    const addBaseProductsToOrder = (baseProductsPrice) => {
        console.log('[Order Context addBaseProductsToOrder] totalAmount', order);
        dispatch({ type: 'ADD_BASE_PRODUCTS_TO_ORDER', baseProductsPrice: baseProductsPrice });
        console.log('[Order Context addBaseProductsToOrder] totalAmount', order);
    }

    const removeBaseProductsFromOrder = (baseProductsPrice) => {
        dispatch({ type: 'REMOVE_BASE_PRODUCTS_FROM_ORDER',  baseProductsPrice: baseProductsPrice  });
    }

    const addProductToOrder = (extraProduct) => {
        // console.log('[Order Provider] - state before add product to order', extraProduct);
        dispatch({ type: 'ADD_PRODUCT_TO_ORDER', extraProduct: extraProduct });
        // console.log('[Order Provider] - state after add product to order', order);
    }

    const removeProductFromOrder = (extraProduct) => {
        dispatch({ type: 'REMOVE_PRODUCT_FROM_ORDER', extraProduct: extraProduct });
    }

    // const createProduct = (dispatch) => async ({ product }) => {

    const fetchOrder = (userId, deliveryId, extraProducts) => {
        dispatch({ type: 'IS_LOADING' });
        console.log('[Order Context] fetchOrder function');
        // console.log('[Order Context] fetchOrder', deliveryId);
        //Read the user Order from Firebase
        getByAttribute(GLOBALS.COLLECTION.ORDERS, 'userId', userId)
            .then((data) => {
                const orderData = data.filter(order => order.deliveryId === deliveryId);
                // console.log('[Order Context] fetchOrder order', orderData);
                if (orderData.length > 0) {
                    dispatch({ type: 'FETCH_ORDER', orderData: orderData, extraProducts: extraProducts });
                } else {
                    startOrder(extraProducts);
                }
            })
            .catch((error) => {
                console.log('[Order Context - Fetching order] - ERRO', error);
            });
    }

    const addOrder = (userId, deliveryId, baseProductsPrice) => {
        dispatch({ type: 'IS_LOADING' });
        console.log('[Order Context] adding Order -----------------------------------');
        // console.log('Order Context - add order - order', order);

        const extraProductsTransformed = order.order.extraProducts.filter(prod => prod.quantity > 0);
        let totalAmount = 0;
        extraProductsTransformed.forEach(item => {
            totalAmount = totalAmount + (item.quantity * item.productPrice)
        });
        totalAmount = totalAmount + (order.order.baseProducts * baseProductsPrice); //Consumer group context tem essa informação. 
        // console.log('Order Context - add order - extra products transformed', extraProductsTransformed);

        const date = new Date()
        const newOrder = {
            userId: userId,
            deliveryId: deliveryId,
            extraProducts: extraProductsTransformed,
            baseProducts: order.order.baseProducts,
            totalAmount: totalAmount,
            date: date.toISOString()
        }

        // console.log('Order Context - add order - newOrder before store', newOrder);

        getByAttribute(GLOBALS.COLLECTION.ORDERS, 'userId', userId)
            .then((data) => {
                // console.log('[Order Context] addorUpdateOrder data', data);
                const orderData = data.filter(order => order.deliveryId === deliveryId);
                if (orderData.length > 0) {
                    //Update order
                    console.log('[Add order] update order');
                    const orderId = orderData[0].id;
                    updateDoc(GLOBALS.COLLECTION.ORDERS, orderId, newOrder)
                } else {
                    //New order
                    console.log('[Add order] new order');
                    insertDoc(GLOBALS.COLLECTION.ORDERS, newOrder)
                        .then((data) => {
                            // console.log('[Order Context] addOrder - order included', data);
                        }).catch((error) => {
                            console.log('[Order Context - Add order] - ERRO', error);
                        });
                }
                dispatch({ type: 'ADD_ORDER', totalAmount: totalAmount });
            })
            .catch((error) => {
                console.log('[Order Context - Read orders] - ERRO', error);
            });
        // console.log('[Order Context] addOrder - order', newOrder);
        dispatch({ type: 'ADD_ORDER' });
    }

    return <OrderContext.Provider value={{
        order: order,
        addBaseProductsToOrder,
        removeBaseProductsFromOrder,
        addProductToOrder,
        startOrder,
        removeProductFromOrder,
        addOrder,
        fetchOrder
    }}>
        {children}
    </OrderContext.Provider>
}

export default OrderContext;

// Order structure { items: {}, totalAmount}
// [Order Reducer] - state Object {
//     "BaseProducts": 2,
//     "products": Object {
//       "p1": OrderItem {
//         "productPrice": 29.99,
//         "productTitle": "Red Shirt",
//         "quantity": 3,
//         "sum": 89.97,
//       },
//       "p2": OrderItem {
//         "productPrice": 99.99,
//         "productTitle": "Blue Carpet",
//         "quantity": 2,
//         "sum": 199.98,
//       },
//       "p5": OrderItem {
//         "productPrice": 2299.99,
//         "productTitle": "PowerBook",
//         "quantity": 1,
//         "sum": 2299.99,
//       },
//     },
//     "totalAmount": 2589.9399999999996,
//   }
import React, { useReducer, useState } from 'react';
import OrderProduct from '../../models/order-product';
import Order from '../../models/order';

const initialState = {
    userId: '',
    deliveryId: '',
    baseProducts: 0,
    extraProducts: [],
    totalAmount: 0,
    date: ''
}

const OrderContext = React.createContext();
const OrderReducer = (state, action) => {
    switch (action.type) {
        case 'START_ORDER':
            // console.log('[Order reducer - Start Order] - action', action);
            let updatedOrder = { extraProducts: [], totalAmount: 0 };
            action.extraProducts.map((extraProduct) => {
                const newProduct = new OrderProduct(0, extraProduct.price, extraProduct.name);
                updatedOrder = {
                    ...updatedOrder,
                    extraProducts: { ...updatedOrder.extraProducts, [extraProduct.id]: newProduct },
                    baseProducts: 0
                };
                // console.log('[Order Context - Start Order] updatedOrder in loop', updatedOrder);
                // console.log('[Order Context - Start Order] in loop', Order);
            });
            // console.log('[Order reducer - Start Order] updatedOrder', updatedOrder);

            return (updatedOrder);
        case 'ADD_BASE_PRODUCTS_TO_ORDER':
            let updatedOrNewBaseProducts;
            if (state.baseProducts) {
                //Base Products já existe
                console.log("Base Products already exists");
                updatedOrNewBaseProducts = state.baseProducts + 1;
            } else {
                updatedOrNewBaseProducts = 1;
            }
            updatedOrder = {
                ...state,
                baseProducts: updatedOrNewBaseProducts
            };
            return updatedOrder;
        // console.log('[Order Context] exit', Order.products);
        case 'REMOVE_BASE_PRODUCTS_FROM_ORDER':
            updatedOrder = { ...state };
            if (state.baseProducts > 0) {
                console.log("Base Products already exists");
                updatedBaseProducts = state.baseProducts - 1;
                updatedOrder = {
                    ...state,
                    baseProducts: updatedBaseProducts
                };
            }
            return (updatedOrder);
        case 'ADD_PRODUCT_TO_ORDER':
            // console.log('[Order Context - Reducer Add produce to order - action]',action);
            let extraProductId = action.extraProduct.productId;
            let newExtraProduct;
            if (state.extraProducts[extraProductId]) {
                //Item já existe
                console.log("Product already exists");
                newExtraProduct = new OrderProduct(
                    state.extraProducts[extraProductId].quantity + 1,
                    action.extraProduct.productPrice,
                    action.extraProduct.productTitle
                );
                // console.log('[New Product]',newExtraProduct);
            } else {
                newExtraProduct = new OrderProduct(1, action.extraProduct.price, action.extraProduct.name);
            }
            updatedOrder = {
                ...state,
                extraProducts: { ...state.extraProducts, [extraProductId]: newExtraProduct }
            };
            return (updatedOrder);
        case 'REMOVE_PRODUCT_FROM_ORDER':
            extraProductId = action.extraProduct.productId;
            updatedOrder = { ...state };
            let updatedExtraProduct;
            if (state.extraProducts[extraProductId].quantity > 0) {
                updatedExtraProduct = new OrderProduct(
                    state.extraProducts[extraProductId].quantity - 1,
                    action.extraProduct.productPrice,
                    action.extraProduct.productTitle
                );
                updatedOrder = {
                    ...state,
                    extraProducts: { ...state.extraProducts, [extraProductId]: updatedExtraProduct }
                };
            }
            return (updatedOrder);
        case 'ADD_ORDER':
            // console.log('[Order Reducer] add order - state', state.extraProducts);
            const extraProductsTransformed = action.orderProducts.filter(prod => prod.quantity != 0);
            let totalAmount = 0;
            extraProductsTransformed.forEach(item => {
                totalAmount = totalAmount + item.quantity * item.productPrice
            });
            totalAmount = totalAmount + state.baseProducts * 37; //Consumer group context tem essa informação. 
            updatedOrder = {
                ...state,
                extraProducts: extraProductsTransformed,
                userId: action.userId,
                deliveryId: action.deliveryId,
                totalAmount: totalAmount,
                date: Date()
            }
            console.log('[Order Reducer] Order ended', updatedOrder);

            return (updatedOrder);
        default:
            return state;
    }
}

export const OrderProvider = ({ children }) => {

    const [order, dispatch] = useReducer(OrderReducer, initialState);

    // const [order, setOrder] = useState();

    const startOrder = (extraProducts) => {
        dispatch({ type: 'START_ORDER', extraProducts: extraProducts });
    }

    const addBaseProductsToOrder = () => {
        dispatch({ type: 'ADD_BASE_PRODUCTS_TO_ORDER' });
    }

    const removeBaseProductsFromOrder = () => {
        dispatch({ type: 'REMOVE_BASE_PRODUCTS_FROM_ORDER' });
    }

    const addProductToOrder = (extraProduct) => {
        // console.log('[Order Provider] - state before add product to order', order);
        dispatch({ type: 'ADD_PRODUCT_TO_ORDER', extraProduct: extraProduct });
        // console.log('[Order Provider] - state after add product to order', order);
    }

    const removeProductFromOrder = (extraProduct) => {
        dispatch({ type: 'REMOVE_PRODUCT_FROM_ORDER', extraProduct: extraProduct });
    }

    const addOrder = (userId, deliveryId, orderProducts) => {
        dispatch({ type: 'ADD_ORDER', userId: userId, deliveryId: deliveryId, orderProducts: orderProducts});
    }

    return <OrderContext.Provider value={{ order: order, addBaseProductsToOrder, removeBaseProductsFromOrder, addProductToOrder, startOrder, removeProductFromOrder, addOrder }}>
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
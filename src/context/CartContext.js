// Cart structure { items: {}, totalAmount}
// [cart Reducer] - state Object {
//     "basicProducts": 2,
//     "items": Object {
//       "p1": CartItem {
//         "productPrice": 29.99,
//         "productTitle": "Red Shirt",
//         "quantity": 3,
//         "sum": 89.97,
//       },
//       "p2": CartItem {
//         "productPrice": 99.99,
//         "productTitle": "Blue Carpet",
//         "quantity": 2,
//         "sum": 199.98,
//       },
//       "p5": CartItem {
//         "productPrice": 2299.99,
//         "productTitle": "PowerBook",
//         "quantity": 1,
//         "sum": 2299.99,
//       },
//     },
//     "totalAmount": 2589.9399999999996,
//   }


import React, { useState } from 'react';
import CartProduct from '../../models/cart-product';

const CartContext = React.createContext();

export const CartProvider = ({ children }) => {

    const [cart, setCart] = useState({ products: [], totalAmount: 0 });

    const startCart = (products) => {
        let updatedCart = { products: [], totalAmount: 0 };
        // console.log('[Cart Context - Start Cart] enter', cart);
        products.map((product) => {
            const newProduct = new CartProduct(0, product.price, product.name);
            updatedCart = {
                ...updatedCart,
                products: { ...updatedCart.products, [product.id]: newProduct },
                basicProducts: 0
            };
            // console.log('[Cart Context - Start Cart] updatedcart in loop', updatedCart);
            // console.log('[Cart Context - Start Cart] in loop', cart);
        });
        setCart(updatedCart);
        // console.log('[Cart Context - Start Cart] exit', cart);
    }

    const addBasicProductsToCart = () => {       
        let updatedOrNewBasicProducts;
        if (cart.basicProducts) {
            //Basic Products já existe
            console.log("Basic Products already exists");
            updatedOrNewBasicProducts = cart.basicProducts + 1;
        } else {
            updatedOrNewBasicProducts = 1;
        }
        const updatedCart = {
            ...cart,
            basicProducts: updatedOrNewBasicProducts
        };
        setCart(updatedCart);
        // console.log('[Cart Context] exit', cart.products);
    }

    const removeBasicProductsFromCart = () => {       
        let updatedOrNewBasicProducts;
        if (cart.basicProducts > 0) {
            //Basic Products já existe
            console.log("Basic Products already exists");
            updatedOrNewBasicProducts = cart.basicProducts -1;
            const updatedCart = {
                ...cart,
                basicProducts: updatedOrNewBasicProducts
            };
            setCart(updatedCart);
        } 

    }

    const addProductToCart = (product) => {
        // console.log('[Cart Context] entering', cart.products);
        // console.log('-----', product);
        // Object.keys(cart.products).forEach(function (index) {
        //     if(product.productTitle === cart.products[index].productTitle){
        //         productId = index;
        //         console.log("encontrei productId = ", productId);
        //     }
        // });
        const productId = product.productId;

        let updatedOrNewProduct;
        if (cart.products[productId]) {
            //Item já existe
            console.log("Product already exists");
            updatedOrNewProduct = new CartProduct(
                cart.products[productId].quantity + 1,
                product.productPrice,
                product.productTitle
            );
            console.log(updatedOrNewProduct);
        } else {
            updatedOrNewProduct = new CartProduct(1, product.price, product.name);
        }
        const updatedCart = {
            ...cart,
            products: { ...cart.products, [productId]: updatedOrNewProduct }
        };

        setCart(updatedCart);
        // console.log('[Cart Context] exit', cart.products);
    }

    const removeProductFromCart = (product) => {
        const productId = product.productId;
        let updatedProduct;
        if (cart.products[productId].quantity > 0) {
            updatedProduct = new CartProduct(
                cart.products[productId].quantity - 1,
                product.productPrice,
                product.productTitle
            );
            const updatedCart = {
                ...cart,
                products: { ...cart.products, [productId]: updatedProduct }
            };
            setCart(updatedCart);
        }
    }

    return <CartContext.Provider value={{ cart: cart, addBasicProductsToCart, removeBasicProductsFromCart, addProductToCart, startCart, removeProductFromCart }}>
        {children}
    </CartContext.Provider>
}

export default CartContext
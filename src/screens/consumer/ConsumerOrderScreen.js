import React, { useEffect, useState, useContext } from 'react'
import { withNavigation } from 'react-navigation';
import { FlatList, StyleSheet, Text, View, Button } from 'react-native'
import { Context as DeliveryContext } from '../../context/DeliveryContext';

import CartContext from '../../context/CartContext';

const ConsumerOrderScreen = () => {

    const [baseProducts, setBaseProducts] = useState();
    const [cartProducts, setCartProducts] = useState([]);

    const { cart, startCart, addBasicProductsToCart, removeBasicProductsFromCart, addProductToCart, removeProductFromCart } = useContext(CartContext);

    // console.log('[Consumer Screen] - Transformed CartProducts', cartProducts);
    // console.log('-----');

    const transformCartProducts = () => {
        let transformedCartProducts = [];
        for (const key in cart.products) {
            transformedCartProducts.push({
                productId: key,
                productTitle: cart.products[key].productTitle,
                productPrice: cart.products[key].productPrice,
                quantity: cart.products[key].quantity,
            })
        }
        transformedCartProducts.sort((a, b) => { 
            return (a.productId > b.productId ? 1 : -1)
        });
        setCartProducts(() => transformedCartProducts);
    }

    // console.log('[Consumer Screen] - Cart', cart);

    const delivery = useContext(DeliveryContext);

    // console.log('[Consumer Screen] - Delivery', delivery.state.nextDelivery);

    useEffect(() => {
        setBaseProducts(delivery.state.nextDelivery.baseProducts);
        // console.log('[Consumer Screen] - Cart',cart);
        startCart(delivery.state.nextDelivery.extraProducts);
    }, []);

    useEffect(() => {
        transformCartProducts();
    }, [cart.products])

    return (
        <View styles={styles.screen}>
            <View style={styles.baseProducts}>
                <Text style={styles.title}>Cesta </Text>
                <View style={styles.controls}>
                    <View style={styles.button}>
                        <Button
                            style={styles.button}
                            onPress={() => removeBasicProductsFromCart()}
                            title="-"
                            color="darkolivegreen"
                        />
                    </View>
                    <Text style={styles.quantity}>{cart.basicProducts}</Text>
                    <View style={styles.button}>
                        <Button
                            onPress={() => { addBasicProductsToCart() }}
                            title="+"
                            color="darkolivegreen"
                        />
                    </View>
                </View>
            </View>
            <Text>({baseProducts})</Text>
            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                }}
            />
            <View style={styles.extraProducts}>
                <Text style={styles.title}>Itens extras</Text>
                {/* {Object.values(cart.products).map((item, index) => { */}
                {cartProducts.map((item, index) => {
                    return (
                        <View key={index} style={styles.extraProductItems}>
                            <View style={styles.item}>
                                <Text>{item.productTitle}</Text>
                            </View>
                            <View style={styles.controls}>
                                <View style={styles.button}>
                                    <Button
                                        style={styles.button}
                                        onPress={() => { removeProductFromCart(item) }}
                                        title="-"
                                        color="darkolivegreen"
                                    />
                                </View>
                                <Text style={styles.quantity}>{item.quantity}</Text>
                                <View style={styles.button}>
                                    <Button
                                        onPress={() => {
                                            addProductToCart(item)
                                        }}
                                        title="+"
                                        color="darkolivegreen"
                                    />
                                </View>
                            </View>
                        </View>
                    )
                })}
            </View>
            <Button title="Confirmar" color='darkolivegreen' onPress={() => { }} />
        </View>
    )
}

const styles = StyleSheet.create({
    baseProducts: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    extraProducts: {
        marginTop: 10
    },
    extraProductItems: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    quantity: {
        fontSize: 20,
        padding: 5
    },
    controls: {
        flexDirection: 'row'
    },
    button: {
        margin: 5
    },
    title: {
        fontWeight: 'bold'
    }
})

ConsumerOrderScreen.navigationOptions = (navData) => {
    return {
        headerTitle: 'Pedidos do consumidor'
        // headerRight: () => <ConsumerGroupDetails />,
    };
};

export default withNavigation(ConsumerOrderScreen);

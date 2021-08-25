import React, { useEffect, useState, useContext } from 'react'
import { withNavigation } from 'react-navigation';
import { StyleSheet, Text, View, Button, Alert } from 'react-native'
import { Context as DeliveryContext } from '../../context/DeliveryContext';
import useUser from '../../hooks/useUser';
import OrderContext from '../../context/OrderContext';

const ConsumerOrderScreen = (props) => {

    const [baseProducts, setBaseProducts] = useState();
    const [orderProducts, setOrderProducts] = useState([]);

    const { order, startOrder, addBaseProductsToOrder, removeBaseProductsFromOrder, addProductToOrder, removeProductFromOrder, addOrder } = useContext(OrderContext);
    const user = useUser();

    // console.log('[Consumer Screen] - Order', order);

    // console.log('[Consumer Screen] - Transformed orderProducts', orderProducts);
    // console.log('-----');

    const transformOrderProducts = () => {
        // console.log("Products from reducer", order);
        let transformedOrderProducts = [];
        for (const key in order.extraProducts) {
            transformedOrderProducts.push({
                productId: key,
                productTitle: order.extraProducts[key].productTitle,
                productPrice: order.extraProducts[key].productPrice,
                quantity: order.extraProducts[key].quantity,
            })
        }
        transformedOrderProducts.sort((a, b) => {
            return (a.productId > b.productId ? 1 : -1)
        });
        setOrderProducts(() => transformedOrderProducts);
    }

    // console.log('[Consumer Screen] - order', order);

    const delivery = useContext(DeliveryContext);
    // console.log('[Consumer Screen] - Delivery', delivery.state.nextDelivery);

    useEffect(() => {
        setBaseProducts(delivery.state.nextDelivery.baseProducts);
        startOrder(delivery.state.nextDelivery.extraProducts);
    }, []);

    useEffect(() => {
        transformOrderProducts();
    }, [order.extraProducts]);

    const onHandleNewOrder = () => {
        console.log('[Consumer Order Screen] Finishing new order');
        addOrder(user.id, delivery.state.nextDelivery.id, orderProducts);
        startOrder(delivery.state.nextDelivery.extraProducts);
        props.navigation.navigate('ConsumerGroup');
    }

    const confirmOrder = () => {
        Alert.alert(
            "Confirma a inclusão do pedido?",
            "Fique atento/a para a data da entrega !!!",
            [
                {
                    text: "Cancelar",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Confirmar", onPress: () => onHandleNewOrder() }
            ]
        );
    }

    return (
        <View styles={styles.screen}>
            <View style={styles.baseProducts}>
                <Text style={styles.title}>Cesta </Text>
                <View style={styles.controls}>
                    <View style={styles.button}>
                        <Button
                            style={styles.button}
                            onPress={() => removeBaseProductsFromOrder()}
                            title="-"
                            color="darkolivegreen"
                        />
                    </View>
                    <Text style={styles.quantity}>{order.baseProducts}</Text>
                    <View style={styles.button}>
                        <Button
                            onPress={() => { addBaseProductsToOrder() }}
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
                {/* {Object.values(order.products).map((item, index) => { */}
                {orderProducts.map((item, index) => {
                    return (
                        <View key={index} style={styles.extraProductItems}>
                            <View style={styles.item}>
                                <View style={styles.line}>
                                    <Text>{item.productTitle}</Text>
                                    <Text> (R${item.productPrice.toFixed(2)})</Text>
                                </View>

                            </View>
                            <View style={styles.controls}>
                                <View style={styles.button}>
                                    <Button
                                        style={styles.button}
                                        onPress={() => { removeProductFromOrder(item) }}
                                        title="-"
                                        color="darkolivegreen"
                                    />
                                </View>
                                <Text style={styles.quantity}>{item.quantity}</Text>
                                <View style={styles.button}>
                                    <Button
                                        onPress={() => {
                                            addProductToOrder(item)
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
            <Button
                title="Confirmar"
                color='darkolivegreen'
                onPress={() => { confirmOrder() }} 
            />
        </View>
    )
}

const styles = StyleSheet.create({
    baseProducts: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    line: {
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

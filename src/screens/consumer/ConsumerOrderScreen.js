import React, { useEffect, useState, useContext } from 'react'
import { withNavigation } from 'react-navigation';
import { StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Context as DeliveryContext } from '../../context/DeliveryContext';
import { Context as ConsumerGroupContext } from '../../context/ConsumerGroupContext';
import useUser from '../../hooks/useUser';
import OrderContext from '../../context/OrderContext';
import Colors from '../../constants/Colors';
import Divider from '../../components/Divider';
import Button from '../../components/Button';

const ConsumerOrderScreen = (props) => {
    const [baseProducts, setBaseProducts] = useState();
    const [orderProducts, setOrderProducts] = useState([]);
    const [limitDateToOrder, setLimitDateToOrder] = useState();

    const now = new Date();
    const date = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        now.getMinutes()
    );

    console.log('[ConsumerOrderProductScreen] Screen started');

    const {
        order,
        addBaseProductsToOrder,
        removeBaseProductsFromOrder,
        addProductToOrder,
        removeProductFromOrder,
        addOrder,
        fetchOrder
    } = useContext(OrderContext);
    // console.log('[ConsumerOrderProduct Screen] order', order);

    const user = useUser();
    const delivery = useContext(DeliveryContext);

    const { state } = useContext(ConsumerGroupContext);
    // console.log('[Consumer Order Screen] - consumer group', state.consumerGroup);

    //############# ATENCAO CORRIGIR

    const baseProductsPrice = state.consumerGroup ? state.consumerGroup.baseProductsPrice : 10;
    // const baseProductsPrice = 37.00;

    //############# 

    // console.log('[ConsumerOrderScreen] consumer group', state);
    // console.log('[ConsumerOrderScreen] consumer group', baseProductsPrice);

    const transformOrderProducts = () => {
        // console.log('[ConsumerOrderProduct] order.extraproducts', order.extraProducts);
        let transformedOrderProducts = order.order.extraProducts;
        transformedOrderProducts.sort((a, b) => {
            return (a.productTitle > b.productTitle ? 1 : -1)
        });
        // console.log('[ConsumerOrderProduct] Transformed products', transformedOrderProducts);
        setOrderProducts(transformedOrderProducts);
    }
    // console.log('[Consumer Screen] - order', order);

    useEffect(() => {
        console.log('[Consumer Order Product Screen - useEffect fetch orders');

        user ? console.log('[Consumer Order Screen] Fetch Order]', user) : console.log('user does not exist');
        // console.log('[ConsumerOrderProduct] order', order);
        if (user && delivery) {
            setLimitDateToOrder(delivery.state.nextDelivery.limitDate);
            console.log('[ConsumerOrderProduct] delivery', delivery.state.nextDelivery.limitDate);
            // console.log('[Consumer Screen] - Delivery', delivery);
            fetchOrder(user.id, delivery.state.nextDelivery.id, delivery.state.nextDelivery.extraProducts);
            setBaseProducts(delivery.state.nextDelivery.baseProducts);
        }
    }, [user, delivery]);

    useEffect(() => {
        console.log('[Consumer Order Product Screen - Transform Order Products');
        transformOrderProducts();
    }, [order]);

    const onHandleNewOrUpdatedOrder = () => {
        console.log('[Consumer Order Screen] Handle new or update order');
        addOrder(user.id, delivery.state.nextDelivery.id, baseProductsPrice);
        if (!order.isLoading) {
            props.navigation.navigate('ConsumerOrderPlacedScreen');
        }
        // Alert.alert(
        //     "Confirma a inclusão do pedido?",
        //     "Fique atento/a para a data da entrega !!!",
        //     [
        //         {
        //             text: "Cancelar",
        //             onPress: () => console.log("Cancel Pressed"),
        //             style: "cancel"
        //         },
        //         {
        //             text: "Confirmar", onPress: () => {
        //                 addOrder(user.id, delivery.state.nextDelivery.id, baseProductsPrice);
        //                 props.navigation.navigate('ConsumerOrderPlacedScreen');
        //             }
        //         }
        //     ]
        // )
        // return;
    }

    if (order.isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    }

    // console.log('[Consumer Product Screen] Data atual', date);
    // console.log('[Consumer Product Screen] Data limite', limitDateToOrder);
    if (limitDateToOrder < now) {
        Alert.alert(
            "Data para pedidos já foi encerrada!",
            ".",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
        props.navigation.navigate('ConsumerOrderPlacedScreen')
    }

    return (
        <View style={styles.screen}>
            <View style={styles.baseProductsContainer}>
                <View style={styles.baseProducts}>
                    <View style={styles.title}>
                        <Text style={styles.textTitle}>{`Cesta (${baseProductsPrice.toFixed(2)})`}</Text>
                    </View>
                    <View style={styles.controls}>
                        <View style={styles.incDecButton}>
                            <TouchableOpacity
                                onPress={() => removeBaseProductsFromOrder(baseProductsPrice)}
                            >
                                <Text style={styles.textControls}>-</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.quantity}>{order.order.baseProducts}</Text>
                        <View style={styles.incDecButton}>
                            <TouchableOpacity
                                onPress={() => addBaseProductsToOrder(baseProductsPrice)}
                            >
                                <Text style={styles.textControls}>+</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
                <View style={styles.baseProductsItems}>
                    <Text style={styles.textItens}>{baseProducts}</Text>
                </View>
            </View>
            <Divider style={{ borderBottomColor: Colors.secondary }} />
            <View style={styles.extraProductsContainer}>
                <View style={styles.title}>
                    <Text style={styles.textTitle}>Extras</Text>
                </View>
                <ScrollView style={styles.extraProducts}>
                    {/* {Object.values(order.products).map((item, index) => { */}
                    {orderProducts.map((item, index) => {
                        return (
                            <View key={index} style={styles.extraProductItems}>
                                <View style={styles.item}>
                                    <View style={styles.line}>
                                        <Text style={styles.textItens}>{item.productTitle}</Text>
                                        <Text style={styles.textItens}> (R${item.productPrice.toFixed(2)})</Text>
                                    </View>

                                </View>
                                <View style={styles.controls}>
                                    <View style={styles.incDecButton}>
                                        <TouchableOpacity
                                            onPress={() => removeProductFromOrder(item)}
                                        >
                                            <Text style={styles.textControls}>-</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.quantity}>{item.quantity}</Text>
                                    <View style={styles.incDecButton}>
                                        <TouchableOpacity
                                            onPress={() => addProductToOrder(item)}
                                        >
                                            <Text style={styles.textControls}>+</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>
                        )
                    })
                    }
                </ScrollView>
            </View>
            <Divider style={{ borderBottomColor: Colors.tertiary }} />
            <View style={styles.totalAmountContainer}>
                <Text style={styles.textTitle}>Total</Text>
                <View>
                    <Text style={styles.textTitle}>{order.order.totalAmount.toFixed(2)}</Text>
                </View>
            </View>
            <Divider style={{ borderBottomColor: Colors.secondary }} />
            <View style={styles.buttonContainer}>
                <Button
                    style={styles.button}
                    onPress={() => { onHandleNewOrUpdatedOrder() }}
                >Confirmar
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        paddingLeft: 25,
        paddingRight: 25,
        borderRadius: 22,
        borderTopColor: 'black',
    },
    baseProductsContainer: {
        height: '18%'
    },
    baseProducts: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 5,
    },
    baseProductsItems: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    line: {
        flex: 1,
        flexDirection: 'row',
        // justifyContent: 'space-between',
        // alignItems: 'center'
    },
    extraProductsContainer: {
        height: '60%'
    },
    extraProducts: {
        // height: '60%'
    },
    extraProductItems: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 5,
    },
    quantity: {
        fontSize: 20,
        paddingLeft: 5,
        paddingRight: 5,
        borderBottomWidth: 2,
        borderBottomColor: '#8898AA'
    },
    controls: {
        flexDirection: 'row',
    },
    textControls: {
        fontFamily: 'Roboto',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#8898AA'
    },
    title: {
        flex: 1,
        justifyContent: 'center',
        height: 40
    },
    textTitle: {
        fontFamily: 'Roboto',
        fontWeight: '700',
        fontSize: 16,
        color: '#505050'
    },
    textItens: {
        fontFamily: 'Roboto',
        fontWeight: '400',
        fontSize: 16,
        color: '#505050',
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    button: {
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: Colors.primary,
    },
    totalAmountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 10
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

ConsumerOrderScreen.navigationOptions = (navData) => {
    return {
        headerTitle: 'Pedidos do consumidor'
        // headerStyle: {
        //     backgroundColor: 'white',
        // },
        // headerTintColor: 'red',
        // headerTitleStyle: {
        //     fontWeight: 'bold',
        // },
        // // headerRight: () => <ConsumerGroupDetails />,
    };
};

export default withNavigation(ConsumerOrderScreen);

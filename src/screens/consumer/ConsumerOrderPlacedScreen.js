import React, { useEffect, useState, useContext } from 'react'
import { withNavigation } from 'react-navigation';
import { ScrollView, View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import Divider from '../../components/Divider';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';
import OrderContext from '../../context/OrderContext';
import { Context as DeliveryContext } from '../../context/DeliveryContext';
import { Context as ConsumerGroupContext } from '../../context/ConsumerGroupContext';
import useUser from '../../hooks/useUser';

const ConsumerOrderPlacedScreen = (props) => {
    const [totalAmount, setTotalAmount] = useState(0);
    const {
        order,
        fetchOrder
    } = useContext(OrderContext);
    // setOrderChanged(order.order);
    const user = useUser();
    const delivery = useContext(DeliveryContext);


    const { state } = useContext(ConsumerGroupContext);
    //############# ATENCAO CORRIGIR
    const baseProductsPrice = state.consumerGroup ? state.consumerGroup.baseProductsPrice : 10;
    // const baseProductsPrice = 37.00;

    //############# 

    useEffect(() => {
        console.log('[ConsumerOrderPlacedScreen] useEffect');
        if (user && delivery) {
            console.log('[ConsumerOrderPlacedScreen] start fetch order');
            // console.log('[Consumer Screen] - Delivery', delivery);
            fetchOrder(user.id, delivery.state.nextDelivery.id, delivery.state.nextDelivery.extraProducts);
        }
    }, []);

    useEffect(() => {
        console.log('[ConsumerOrderPlacedScreen] update totalamount');
        setTotalAmount(order.order.totalAmount);
    }, [order]);

    if (order.isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    }

    return (
        <View style={styles.screen}>

            <View style={styles.titleContainer}>
                <Text style={styles.title}>Pedido!</Text>
            </View>
            <Divider style={{ borderBottomColor: Colors.secondary }} />
            <ScrollView style={styles.orderItemsContainer}>
                <View styles={styles.ordemItems}>
                    <View style={styles.orderItemContainer}>
                        <View style={styles.box1} >
                            <Text style={styles.itemText}>{order.order.baseProducts}</Text>
                            <Text style={styles.itemText}>Cesta</Text>
                        </View>
                        <View style={styles.box2}>
                            <Text style={styles.itemText}>37.00</Text>
                        </View>
                    </View>
                    <FlatList
                        // data={[{ quantity: 1, productTitle: 'Queijo', productPrice: 12.00 },
                        // { quantity: 3, productTitle: 'Alho', productPrice: 4.00 }]}
                        data={order.order.extraProducts}
                        keyExtractor={item => item.productTitle}
                        renderItem={(itemData) => {
                            let total = (itemData.item.productPrice * itemData.item.quantity).toFixed(2)
                            return (
                                <View>
                                    {total != 0 ?
                                        <View style={styles.orderItemContainer}>
                                            <View style={styles.box1} >
                                                <Text style={styles.itemText}>{itemData.item.quantity}</Text>
                                                <Text style={styles.itemText}>{itemData.item.productTitle}</Text>
                                            </View>
                                            <View style={styles.box2}>
                                                <Text style={styles.itemText}>{total}</Text>
                                            </View>
                                        </View>
                                        : null}
                                </View>
                            )
                        }}
                    />
                </View>
            </ScrollView>
            <Divider style={{ borderBottomColor: Colors.tertiary }} />
            <View style={styles.totalAmountContainer}>
                <View style={styles.box1}>
                    <Text style={styles.itemText}>Total</Text>
                </View>
                <View>
                    <Text style={styles.itemText}>{totalAmount.toFixed(2)}</Text>
                </View>
            </View>
            <Divider style={{ borderBottomColor: Colors.secondary }} />
            <View style={styles.buttonContainer}>
                <Button style={styles.button} onPress={() => console.log('Button pressed!')}>
                    Adicionar Pagamento
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 15
    },
    titleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '20%',
        padding: 10
    },
    orderItemsContainer: {
        padding: 25,
        height: '50%'
    },
    orderItemContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    itemText: {
        fontFamily: 'Roboto',
        fontWeight: '700',
        fontSize: 16,
        color: '#505050',
        padding: 2
    },
    box1: {
        flex: 1,
        flexDirection: 'row',
    },
    // box2:{
    //     alignContent: 'flex-end',
    //     justifyContent: 'space-between',

    // },
    totalAmountContainer: {
        height: '10%',
        paddingRight: 25,
        paddingLeft: 25,
        flex: 1,
        flexDirection: 'row',
        // backgroundColor: 'grey'
    },
    buttonContainer: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        paddingTop: 10,
        paddingRight: 25,
        paddingLeft: 25,
        height: '10%'
    },
    title: {
        fontFamily: 'Roboto',
        fontWeight: '700',
        fontSize: 24,
        color: '#505050'
    },
    button: {
        backgroundColor: Colors.primary,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

ConsumerOrderPlacedScreen.navigationOptions = (navData) => {
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

export default withNavigation(ConsumerOrderPlacedScreen);

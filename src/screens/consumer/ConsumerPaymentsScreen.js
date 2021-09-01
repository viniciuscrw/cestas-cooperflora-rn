import React, { useEffect, useState, useContext } from 'react'
import { withNavigation } from 'react-navigation';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import HeaderTitle from '../../components/HeaderTitle';
import BackArrow from '../../components/BackArrow';
import Divider from '../../components/Divider';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';
import CameraIcon from '../../../assets/cameraicon.png'
import useUser from '../../hooks/useUser';
import { Context as userContext } from '../../context/UserContext';
import Input from './Input';
import Upload from './Upload';

const ConsumerPaymentsScreen = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [amountToPay, setAmountToPay] = useState(0);
    const [userData, setUserData] = useState();

    const user = useUser();
    // console.log('[Consumer Payments Screen] user', user);

    console.log('[ConsumerPaymentsScreen] started');
    const orderTotalAmount = props.navigation.state.params.orderTotalAmount;

    const { getUserById } = useContext(userContext);

    useEffect(() => {
        setIsLoading(true);
        if (user) {
            getUserById(user.id)
                .then((data) => {
                    setUserData(data);
                    console.log('[Consumer Payments Screen] userData', data);
                    setIsLoading(false);
                    setAmountToPay(orderTotalAmount - data.balance);
                });
        }
    }, [user]);

    if (isLoading) {
        console.log('[Consumer Payments Screen] isLoading', isLoading)
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary} />
            </View>
        )
    }

    const inputChangeHandler = (text) => {
        setAmountToPay(parseInt(text));
        console.log('Text modified');
    }

    return (
        <View style={styles.screen}>
            <View style={styles.container}>
                <View style={styles.valuesContainer}>
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>Valor do Pedido</Text>
                        <View style={styles.itemBox}>
                            <Text style={styles.itemText}>{`R$ ${orderTotalAmount.toFixed(2)}`}</Text>
                        </View>
                    </View>
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>Saldo atual</Text>
                        <View style={styles.itemBox}>
                            <Text style={styles.itemText}>{`R$ ${userData.balance.toFixed(2)}`}</Text>
                        </View>
                    </View>
                </View>
                <Divider style={{ borderBottomColor: Colors.tertiary }} />
                <View style={styles.addContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.itemText}>Saldo a Pagar</Text>
                        {/* <View>
                            <TextInput
                                style={styles.input}
                                onChangeText={onChangeText}
                                value={amountToPay.toFixed(2)}
                                keyboardType="numeric"
                            />
                        </View> */}
                        <Input
                            id='title'
                            errorText='Please enter a valid title!'
                            keyboardType='numeric'
                            autoCapitalize='sentences'
                            autoCorrect
                            returnKeyType='next'
                            onInputChange={inputChangeHandler}
                            initialValue={0}
                            initiallyValid={true}
                            required
                            style={{width:50}}
                        />
                    </View>
                    {/* <Button
                        style={styles.button1}
                        textColor='black'
                        onPress={() => {
                            console.log('Button clicked');
                        }}>
                        Adicionar R$ {amountToPay.toFixed(2)}
                    </Button> */}
                    {/* <View style={styles.receiptContainer} > */}

                    <View style={styles.receiptButton}>
                        <TouchableOpacity
                            style={styles.receiptButtonInt}
                            onPress={() => console.log('Button pressed!')}>
                            <Text style={styles.receiptText}>Comprovante</Text>
                            <Image source={CameraIcon} />
                        </TouchableOpacity>
                    </View>
                    <Upload />
                    {/* </View> */}
                </View>
                <View style={styles.buttonAddPaymentContainer}>
                    <Divider style={{ borderBottomColor: Colors.secondary }} />
                    <Button style={styles.button2}
                        textColor='white'
                        onPress={() => {
                            props.navigation.navigate('ConsumerPaymentsScreen')
                        }}>
                        Confirmar Pagamento
                    </Button>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginTop: 4,
        backgroundColor: 'white',
        // paddingLeft: 25,
        // paddingRight: 25,
        // borderRadius: 25,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        // backgroundColor: 'grey',
        shadowColor: "black",
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2
    },
    container: {
        flex: 1,
        margin: 25
    },
    valuesContainer: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        height: '15%'
    },
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemBox: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    itemText: {
        fontFamily: 'Roboto',
        fontWeight: '700',
        fontSize: 16,
        color: '#505050'
    },
    addContainer: {
        marginTop: 10,
        // alignItems: 'flex-start',
        // justifyContent: 'center',
        // flexDirection: 'column',
        height: '50%',
        // alignItems: 'center',
        // justifyContent: 'center',
        paddingTop: 10,
        // paddingRight: 25,
        // paddingLeft: 25,
        // height: '10%',
        // backgroundColor: 'grey'
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'

    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        fontFamily: 'Roboto',
        fontWeight: '700',
        fontSize: 16,
        color: '#505050',
        textAlign: 'right',
        width: 60
    },
    button1: {
        marginTop: 15,
        backgroundColor: '#f2f2f2',
        color: 'black'
    },
    textButton: {
        color: 'black'
    },
    receiptButtonInt: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    receiptButton: {
        paddingLeft: 10,
        paddingRight: 15,
        marginTop: 15,
        borderColor: 'black',
        borderWidth: 1,
        width: 343,
        height: 48,
        alignSelf: 'stretch',
        borderRadius: 5,
        marginLeft: 5,
        marginRight: 5,
    },
    receiptText: {
        alignSelf: 'flex-start',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: '700',
        paddingTop: 10,
        paddingBottom: 10,
    },
    buttonAddPaymentContainer: {
        position: 'absolute',
        bottom: 5,
        marginBottom: 10,
        // backgroundColor: 'grey'
    },
    button2: {
        marginTop: 5,
        backgroundColor: Colors.primary
    },
});

ConsumerPaymentsScreen.navigationOptions = (navData) => {
    return {
        headerTitle: () => (
            <HeaderTitle title="Adicionar Pagamento" />
        ),
        headerBackImage: () => (<BackArrow />),
        headerStyle: {
            backgroundColor: 'transparent',
            position: 'absolute',
            zIndex: 100,
            top: 0,
            left: 0,
            right: 0,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
        }

        // headerBackImageSource: 
        // headerLeft: () => (
        //     <HeaderButtons HeaderButtonComponent={HeaderButton}>
        //         <Item
        //             title="Menu"
        //             iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
        //             onPress={() => {
        //                 navData.navigation.toggleDrawer();
        //             }}
        //         />
        //     </HeaderButtons>
        // )
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

export default withNavigation(ConsumerPaymentsScreen);

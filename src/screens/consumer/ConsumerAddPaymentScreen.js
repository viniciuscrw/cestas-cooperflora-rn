import React, { useEffect, useState, useContext } from 'react'
import { withNavigation } from 'react-navigation';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import HeaderTitle from '../../components/HeaderTitle';
import BackArrow from '../../components/BackArrow';
import Divider from '../../components/Divider';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';
import useUser from '../../hooks/useUser';
import { Context as userContext } from '../../context/UserContext';
import {
    insertDoc,
    insertIntoSubcollection
} from '../../api/firebase';
import firebase from 'firebase';
import GLOBALS from '../../Globals';
import * as ImagePicker from 'expo-image-picker';
import Input from './Input';
import Upload from './Upload';
import CurrencyInput from 'react-native-currency-input';

const ConsumerAddPaymentScreen = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [amountToPay, setAmountToPay] = useState(0.00);
    const [userData, setUserData] = useState();
    const [receiptImage, setReceiptImage] = useState(null);

    // console.log('[ConsumerAddPaymentScreen] amount to pay',amountToPay);

    const user = useUser();
    // console.log('[Consumer Payments Screen] user', user);
    // console.log('[ConsumerAddPaymentScreen] started');
    const orderTotalAmount = props.navigation.state.params.orderTotalAmount;

    const { getUserById } = useContext(userContext);

    useEffect(() => {
        console.log('[ConsumerAddPaymentScreen] amount to pay', amountToPay);
        setIsLoading(true);
        if (user) {
            getUserById(user.id)
                .then((data) => {
                    setUserData(data);
                    console.log('[Consumer Payments Screen] userData', data);
                    setIsLoading(false);
                    setAmountToPay(orderTotalAmount - data.balance);
                    console.log('[ConsumerAddPaymentScreen] amount to pay', amountToPay);
                });
        }
    }, [user]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            // allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        setReceiptImage(result.uri);
        // if (!result.cancelled) {
        //     uploadImage(result.uri)
        //         .then(() => {
        //             console.log('Comprovante armazenado com sucesso!');
        //         }).catch(() => {
        //             console.log('Erro ao gravar o comprovante.')
        //         });
        // }
    }

    const uploadImage = async (uri, date) => {
        const imageName = date;
        let response = await fetch(uri);
        console.log('[response]', response);
        const blob = await response.blob();
        console.log('[blob]', blob);
        let ref = firebase.storage().ref().child(user.id + '/' + imageName);
        return ref.put(blob);
    };

    const handlePayment = async () => {
        console.log('[Consumer Payment Screen] Handle payment');
        console.log('[Consumer Payment Screen] payment', amountToPay);
        console.log('[Consumer Payment Screen] receipt', receiptImage);
        const date = new Date();
        // const date = new Date(
        //     now.getFullYear(),
        //     now.getMonth(),
        //     now.getDate(),
        //     now.getHours(),
        //     now.getMinutes()
        // );
        const newPayment = {
            userId: user.id,
            paymentValue: amountToPay,
            date: date.toISOString()
        }

        const collection = GLOBALS.COLLECTION.PAYMENTS;
        const data = newPayment;
        const idPayment = user.id+'pay';

        insertIntoSubcollection(
            GLOBALS.COLLECTION.USERS, 
            idPayment,
            GLOBALS.SUB_COLLECTION.PAYMENTS,
            newPayment) 
            .then((data) => {
                // console.log('[Order Context] addOrder - order included', data);
                uploadImage(receiptImage, date);
                //Faltou gravar o saldo no user.
                props.navigation.navigate(
                    'ConsumerPaymentsScreen'
                )

            }).catch((error) => {
                console.log('[Consumer Add payment Screen - Add payment] - ERRO', error);
            });
    }

    if (isLoading) {
        console.log('[Consumer Payments Screen] isLoading', isLoading)
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary} />
            </View>
        )
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
                        <CurrencyInput
                            style={styles.input}
                            value={amountToPay}
                            onChangeValue={setAmountToPay}
                            prefix="R$ "
                            delimiter=","
                            separator="."
                            precision={2}
                            onChangeText={(formattedValue) => {
                                console.log(formattedValue); // $2,310.46
                            }}
                        />
                        {/* <Input
                            style={styles.input}
                            id='amount'
                            // errorText='Please enter a valid title!'
                            keyboardType='numeric'
                            returnKeyType='next'
                            onInputChange={inputChangeHandler}
                            initialValue={amountToPay}
                            value={amountToPay}
                            initiallyValid={true}
                            required
                        /> */}
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
                    <Upload
                        user={user}
                        pickImage={pickImage}
                        receiptImage={receiptImage}
                    />
                    {/* </View> */}
                </View>
                <View style={styles.buttonAddPaymentContainer}>
                    <Divider style={{ borderBottomColor: Colors.secondary }} />
                    <Button style={styles.button2}
                        textColor='white'
                        onPress={handlePayment}>
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
        // height: '50%',
        paddingTop: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    input: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        fontFamily: 'Roboto',
        fontWeight: '700',
        fontSize: 16,
        color: '#505050',
        textAlign: 'right',
        width: 80,
        // backgroundColor: 'green'
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
    buttonAddPaymentContainer: {
        position: 'absolute',
        bottom: 0,
        marginBottom: 1,
        // backgroundColor: 'grey'
    },
    button2: {
        marginTop: 5,
        backgroundColor: Colors.primary
    },
});

ConsumerAddPaymentScreen.navigationOptions = (navData) => {
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

export default withNavigation(ConsumerAddPaymentScreen);

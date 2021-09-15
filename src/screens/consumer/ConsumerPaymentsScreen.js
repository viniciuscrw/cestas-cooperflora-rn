import React, { useEffect, useState, useContext } from 'react'
import { withNavigation } from 'react-navigation';
import { format } from 'date-fns';
import { StyleSheet, Text, ScrollView, View, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import HeaderTitle from '../../components/HeaderTitle';
import BackArrow from '../../components/BackArrow';
import Divider from '../../components/Divider';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';
import useUser from '../../hooks/useUser';
import { Context as userContext } from '../../context/UserContext';
import {
    insertDoc
} from '../../api/firebase';
import firebase from 'firebase';
import GLOBALS from '../../Globals';
import * as ImagePicker from 'expo-image-picker';
import Input from './Input';
import Upload from './Upload';
import CurrencyInput from 'react-native-currency-input';
import ClipIcon from '../../../assets/images/icons/clipicon.png'

const ConsumerPaymentsScreen = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState();
    const [userPayments, setUserPayments] = useState([]);

    const { getUserById } = useContext(userContext);
    const user = useUser();

    const fetchPayments = async () => {
        const collection = GLOBALS.COLLECTION.USERS;
        const subcollection = GLOBALS.SUB_COLLECTION.PAYMENTS;
        //Mover para api firebase
        const db = firebase.firestore();
        const ref = db.collection(collection);
        const doc = user.id + 'pay';
        // console.log('[Payments Screen] user.id =', user.id, 'subcollection', subcollection, ' ')
        await ref
            .doc(doc)
            .collection(subcollection)
            .orderBy('date')
            .get()
            .then((snapshot) => {
                let newUserPayments = [];
                snapshot.forEach((doc) => {
                    const date = new Date(doc.data().date);
                    newUserPayments.push(
                        {
                            amount: doc.data().paymentValue,
                            date: date
                        });
                    // console.log('[Payments Screen] New User Payments', newUserPayments);
                    console.log('[Payments Screen] User Payments', userPayments);
                });
                setUserPayments(newUserPayments);
            })
            .catch((err) =>
                console.log('Error while getting data from payments', err)
            );
    }

    useEffect(() => {
        console.log('[ConsumerPaymentsScreen] amount to pay');
        setIsLoading(true);
        if (user) {
            getUserById(user.id)
                .then((data) => {
                    setUserData(data);
                    fetchPayments();
                    setIsLoading(false);
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

    return (
        <View style={styles.screen}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Meu Saldo: {userData.balance.toFixed(2)} </Text>
                </View>
                <Divider style={{ borderBottomColor: Colors.secondary }} />
                <View style={styles.paymentsContainer}>
                    <ScrollView style={styles.paymentsContainer}>
                        {userPayments.map((userPayment) => {
                            return (
                                <View key={userPayment.date}>
                                    <View style={styles.paymentContainer}>
                                        <View style={styles.dateContainer}>
                                            <Text style={styles.dateText}>{format(userPayment.date, GLOBALS.FORMAT.DEFAULT_DATE_TIME)}</Text>
                                            <TouchableOpacity
                                                style={styles.button}
                                                onPress={() => console.log('')}>
                                                <View style={styles.imageIcon}>
                                                    <Image source={ClipIcon} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.payLine}>
                                            <Text>Pagamento Realizado</Text>
                                            <Text style={styles.amountText}>R$ {userPayment.amount.toFixed(2)}</Text>
                                        </View>
                                    </View>
                                    <Divider style={{ borderBottomColor: Colors.tertiary }} />
                                </View>

                            )
                        })}
                    </ScrollView>
                </View>
                <View style={styles.buttonAddPaymentContainer}>
                    <Divider style={{ borderBottomColor: Colors.secondary }} />
                    <Button style={styles.button2}
                        textColor='white'
                        onPress={() => { }}>
                        Adicionar Pagamento
                    </Button>
                </View>

            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginTop: 4,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "black",
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2
    },
    container: {
        flex: 1,
        margin: 20
    },
    titleContainer: {
        // flex: 1,
        alignItems: 'center',
        alignContent: 'center'
    },
    title: {
        fontFamily: 'Roboto',
        fontWeight: '700',
        fontSize: 24,
        color: '#BB2525',
        textShadowColor: 'rgba(0, 0, 0, 0.35)',
        textShadowOffset: { width: -1, height: 3 },
        textShadowRadius: 10
    },
    paymentsContainer: {
        marginTop: 5,
        height: '80%',
    },
    paymentContainer: {
        marginTop: 15,
        marginBottom: 15,
    },
    dateContainer: {
        flexDirection: 'row'
    },
    dateText: {
        fontFamily: 'Roboto',
        fontWeight: '700',
        fontSize: 16,
        color: '#BB2525',
        marginLeft: 10
    },
    imageIcon: {
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    amountText: {
        fontFamily: 'Roboto',
        fontWeight: '700',
        fontSize: 16,
        color: '#505050'
    },
    payLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 10,
        marginRight: 10,
    },
    buttonAddPaymentContainer: {
        position: 'absolute',
        bottom: 0,
        marginBottom: 0,
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
            <HeaderTitle title="Pagamentos" />
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
    };
};

export default withNavigation(ConsumerPaymentsScreen);

import React, { useEffect, useState, useContext } from 'react'
import { withNavigation } from 'react-navigation';
import { format } from 'date-fns';
import { StyleSheet, Text, ScrollView, View, TouchableOpacity, ActivityIndicator, Image, Modal, TouchableHighlight, Alert } from 'react-native';
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
import CurrencyInput from 'react-native-currency-input';
import ClipIcon from '../../../assets/images/icons/clipicon.png'
import ImageModal from 'react-native-image-modal';

const ConsumerPaymentsScreen = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState();
    const [userPayments, setUserPayments] = useState([]);
    const [showReceiptImage, setShowReceiptImage] = useState(false);
    const [receiptImage, setReceiptImage] = useState('https://cdn.pixabay.com/photo/2019/07/25/18/58/church-4363258_960_720.jpg')

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
                            date: date,
                            receiptImage: doc.data().receiptImage,
                            showReceiptImage: false
                        });
                });
                newUserPayments.sort((a, b) => {
                    return (a.date < b.date ? 1 : -1)
                });
                setUserPayments(newUserPayments);
            })
            .catch((err) => {
                Alert.alert('Erro ao carregar os seus pagamentos!', err)
            });
    }

    useEffect(() => {
        // console.log('[ConsumerPaymentsScreen] amount to pay');
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

    const showImage = (index) => {
        // console.log('[show Receipt Image]' , receiptImage);
        const newUserPayments = [...userPayments];
        newUserPayments[index].showReceiptImage = !newUserPayments[index].showReceiptImage;
        setUserPayments(newUserPayments);

        // setUserPayments([...userPayments, userPayments[index].showReceiptImage = true])
    }

    if (isLoading) {
        // console.log('[Consumer Payments Screen] isLoading', isLoading)
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
                        {userPayments.map((userPayment, index) => {
                            return (
                                <View key={userPayment.date}>
                                    <View style={styles.paymentContainer}>
                                        <View style={styles.dateContainer}>
                                            <Text style={styles.dateText}>{format(userPayment.date, GLOBALS.FORMAT.DEFAULT_DATE_TIME)}</Text>
                                            <TouchableOpacity
                                                style={styles.button}
                                                onPress={() => showImage(index)}>
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
                                    {userPayment.showReceiptImage ?
                                        <View style={styles.imageContainer}>
                                            <Image
                                                style={styles.image}
                                                source={{ uri: userPayment.receiptImage }}
                                            />
                                        </View>
                                        : null
                                    }
                                    <Divider style={{ borderBottomColor: Colors.tertiary }} />
                                </View>
                            )
                        })}
                    </ScrollView>
                </View>
                <View style={styles.buttonContainer}>
                    <Divider style={{ borderBottomColor: Colors.secondary }} />
                    <Button style={styles.addPaymentButton}
                        textColor='white'
                        onPress={() => {
                            props.navigation.navigate(
                                'ConsumerAddPaymentScreen',
                                { orderTotalAmount: 0 }
                            )}}>
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
        color: '#505050',
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
    buttonContainer: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
    },
    addPaymentButton: {
        marginTop: 5,
        backgroundColor: Colors.primary,
        alignSelf: 'center',
    },
    imageContainer: {
        flexDirection: 'row',
        margin: 10,
        alignItems: 'center',
        height: 200,
        // borderColor: 'green',
        // borderWidth: 2
        // // backgroundColor: 'green'
    },
    image: {
        flex: 1,
        width: 200,
        height: 200,
        resizeMode: 'contain'
    }
});

ConsumerPaymentsScreen.navigationOptions = (navData) => {
    return {
        headerTitle: () => (
            <HeaderTitle title="Pagamentos" />
        ),
        headerBackImage: () => (<BackArrow />),
        headerStyle: {
            backgroundColor: 'transparent',
            // position: 'absolute',
            // zIndex: 100,
            // top: 0,
            // left: 0,
            // right: 0,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
        }
    };
};

export default withNavigation(ConsumerPaymentsScreen);

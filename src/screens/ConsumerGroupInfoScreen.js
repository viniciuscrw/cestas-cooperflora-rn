import React, { useContext, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Image } from 'react-native';
import TextInformation from '../components/TextInformation';
import Spinner from '../components/Spinner';
import { Context as ConsumerGroupContext } from '../context/ConsumerGroupContext';
import GLOBALS from '../Globals';
// import TextLink from '../components/TextLink';
import { Entypo } from '@expo/vector-icons';
import HeaderTitle from '../components/HeaderTitle';
import { AntDesign } from '@expo/vector-icons';
import BackArrow from '../components/BackArrow';
import useUser from '../hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import localIcon from '../../assets/images/icons/local.jpg';
import greenBasketIcon from '../../assets/images/icons/greenbasket.png';
import watchIcon from '../../assets/images/icons/watch.jpg';
import basketImage from '../../assets/images/basketproducts2.png';

const ConsumerGroupInfoScreen = (props) => {
  const { state, fetchConsumerGroup } = useContext(ConsumerGroupContext);

  let userRole;
  const user = useUser();
  if (user) {
    userRole = user.role;
  } else {
    userRole = 'consumer'
  }
  // console.log('[Consumer Group Info Screen ] user', user);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      fetchConsumerGroup();
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [props.navigation]);

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        {state.loading ? (
          <Spinner />
        ) : (
          <View style={styles.box}>
            <View style={styles.title}>
              <Text style={styles.text}>Informações Gerais:</Text>
              {userRole === GLOBALS.USER.ROLE.ORGANIZER ? (
                <View style={styles.editButtonContainer}>
                  <AntDesign
                    name="form"
                    size={27}
                    color={Colors.secondary}
                    onPress={() =>
                      props.navigation.navigate('EditConsumerGroupInfoScreen', {
                        group: state.consumerGroup,
                      })
                    }
                    style={styles.editButton}
                  />
                </View>
              ) : null}
            </View>
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <Image style={styles.icon}
                  source={localIcon}
                />
              </View>
              <View style={styles.textContainer}>
                {state.consumerGroup && state.consumerGroup.address ? (
                  <TextInformation
                    title="Local"
                    text={state.consumerGroup.address}
                  />
                ) : null}
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <Image style={styles.icon}
                  source={greenBasketIcon}
                />
              </View>
              <View style={styles.textContainer}>
                {state.consumerGroup && state.consumerGroup.deliveryFrequencyText ? (
                  <TextInformation
                    title="Entregas"
                    text={state.consumerGroup.deliveryFrequencyText}
                  />
                ) : null}
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <Image style={styles.icon}
                  source={watchIcon}
                />
              </View>
              <View style={styles.textContainer}>
                {state.consumerGroup && state.consumerGroup.time ? (
                  <TextInformation title="Horário" text={state.consumerGroup.time} />
                ) : null}
              </View>
            </View>
            {state.consumerGroup && state.consumerGroup.notice ? (
              <TextInformation
                title="Observações"
                text={state.consumerGroup.notice}
              />
            ) : null}
            <View style={styles.imageContainer}>
              <Image
                source={basketImage}
                style={styles.image}
              />
            </View>
          </View>
        )}
      </View>
    </View >
  );
};

export const consumerGroupInfoScreenOptions = () => {
  return {
    headerTitle: () => (
      <View style={styles.header}>
        <HeaderTitle title="Grupo de Consumo" subtitle="Barão Geraldo" />
      </View>
    ),
    headerBackImage: () => (<BackArrow />),
    headerBackTitleVisible: false,
    headerStyle: {
      backgroundColor: 'transparent',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    }
  };
};

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
    elevation: 25
  },
  container: {
    flex: 1,
    margin: 25
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
    color: '#505050',
    // alignSelf: 'flex-start',
  },
  editButtonContainer: {
    alignContent: 'flex-end',
  },
  card: {
    flexDirection: 'row',
    marginTop: 20,
  },
  iconContainer: {
    // flex: 1,
    alignContent: 'center',
    height: 40,
    width: '30%'
  },
  textContainer: {
    // flex: 1,
    width: '70%'
  },
  icon: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
  },
  image: {
    width: '150%',
    height: '150%'
  },
  imageContainer: {
    width: 320,
    height: 200,
    elevation: 49,
    // zIndex: 2,
    right: 0,
    marginTop: -25
  },
  header: {
    alignItems: 'flex-start'
  },
});

export default ConsumerGroupInfoScreen;

import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from '@expo/vector-icons';
import Spinner from '../components/Spinner';
import { Context as ConsumerGroupContext } from '../context/ConsumerGroupContext';
import GLOBALS from '../Globals';
import HeaderTitle from '../components/HeaderTitle';
import BackArrow from '../components/BackArrow';
import useUser from '../hooks/useUser';
import Colors from '../constants/Colors';
import basketImage from '../../assets/images/basketproducts2.png';
import { TextContent, TextLabel } from '../components/StandardStyles';

const ConsumerGroupInfoScreen = (props) => {
  const { state, fetchConsumerGroup } = useContext(ConsumerGroupContext);

  let userRole;
  const user = useUser();
  if (user) {
    userRole = user.role;
  } else {
    userRole = 'consumer';
  }

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
              <TextLabel>Informações Gerais:</TextLabel>
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
                <Entypo name="location" size={44} color={Colors.primary} />
              </View>
              <View style={styles.textContainer}>
                {state.consumerGroup && state.consumerGroup.address ? (
                  <>
                    <TextLabel>Local</TextLabel>
                    <TextContent>{state.consumerGroup.address}</TextContent>
                  </>
                ) : null}
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <FontAwesome5
                  name="shopping-basket"
                  size={44}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.textContainer}>
                {state.consumerGroup &&
                state.consumerGroup.deliveryFrequencyText ? (
                  <>
                    <TextLabel>Entregas</TextLabel>
                    <TextContent>
                      {state.consumerGroup.deliveryFrequencyText}
                    </TextContent>
                  </>
                ) : null}
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="time-outline"
                  size={54}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.textContainer}>
                {state.consumerGroup && state.consumerGroup.time ? (
                  <>
                    <TextLabel>Horário</TextLabel>
                    <TextContent>{state.consumerGroup.time}</TextContent>
                  </>
                ) : null}
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <FontAwesome
                  style={{ marginLeft: 12 }}
                  name="dollar"
                  size={44}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.textContainer}>
                {state.consumerGroup && state.consumerGroup.time ? (
                  <>
                    <TextLabel>Preço</TextLabel>
                    <TextContent>
                      {state.consumerGroup.baseProductsPrice.toFixed(2)}
                    </TextContent>
                  </>
                ) : null}
              </View>
            </View>
            {state.consumerGroup && state.consumerGroup.notice ? (
              <>
                <TextLabel style={{ marginTop: 10 }}>Observações</TextLabel>
                <TextContent>{state.consumerGroup.notice}</TextContent>
              </>
            ) : null}
            <View style={styles.imageContainer}>
              <Image source={basketImage} style={styles.image} />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export const consumerGroupInfoScreenOptions = () => {
  return {
    headerTitle: () => (
      <View style={styles.header}>
        <HeaderTitle title="Grupo de Consumo" subtitle="Barão Geraldo" />
      </View>
    ),
    headerBackImage: () => <BackArrow />,
    headerBackTitleVisible: false,
    headerStyle: {
      backgroundColor: 'transparent',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop: 4,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 25,
  },
  container: {
    flex: 1,
    margin: 25,
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
    // alignContent: 'center',
    // height: 40,
    marginLeft: 20,
    width: '20%',
  },
  textContainer: {
    // flex: 1,
    width: '70%',
  },
  icon: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
  image: {
    width: '150%',
    height: '150%',
  },
  imageContainer: {
    width: 320,
    height: 200,
    elevation: 49,
    // zIndex: 2,
    right: 0,
    marginTop: -25,
  },
  header: {
    alignItems: 'flex-start',
  },
});

export default ConsumerGroupInfoScreen;

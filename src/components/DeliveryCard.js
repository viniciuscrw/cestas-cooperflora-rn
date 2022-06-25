import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import { format } from 'date-fns';
import { Feather } from '@expo/vector-icons';
import GLOBALS from '../Globals';
import Colors from '../constants/Colors';
import { resolveWeekDay } from '../helper/HelperFunctions';

const DeliveryCard = ({
  delivery,
  ordersDateText,
  borderColor,
  onPress,
  showEditButton,
  onEditButtonPress,
}) => {
  const weekDayText = resolveWeekDay(delivery.deliveryDate.getDay());

  const formatBaseProducts = (baseProducts) => {
    return baseProducts.toLowerCase().replace(/\n/g, ', ');
  };

  const formatCardTitle = (deliveryDate) => {
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>
          {`${weekDayText}, ${format(
            deliveryDate,
            GLOBALS.FORMAT.DEFAULT_DATE
          )}`}
        </Text>
        {showEditButton ? (
          <Feather
            name="edit"
            size={24}
            color={Colors.secondary}
            onPress={onEditButtonPress}
          />
        ) : null}
      </View>
    );
  };

  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <Card
          containerStyle={{
            borderWidth: 0.25,
            borderRadius: 30,
            backgroundColor: '#F0F5F9',
          }}
        >
          <Card.Title>{formatCardTitle(delivery.deliveryDate)}</Card.Title>
          <View style={styles.contentContainer}>
            <Text>
              <Text style={styles.titleText}>{ordersDateText} </Text>
              <Text style={styles.cardText}>
                {format(delivery.limitDate, 'dd/MM/yyyy')} às{' '}
                {format(delivery.limitDate, 'HH:mm')}
              </Text>
            </Text>
            <Text numberOfLines={3} style={styles.cardTextContainer}>
              <Text style={styles.titleText}>Composição da cesta: </Text>
              <Text style={styles.cardText}>
                {formatBaseProducts(delivery.baseProducts)}
              </Text>
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // titleViewContainer: {
  //   marginVertical: 10,
  // },
  titleContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    marginVertical: 1,
    justifyContent: 'space-evenly',
  },
  titleText: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
    marginRight: 50,
    color: '#505050',
  },
  cardTextStrong: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardText: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 16,
    color: '#505050',
  },
  cardTextContainer: {
    marginTop: 8,
  },
});

export default DeliveryCard;

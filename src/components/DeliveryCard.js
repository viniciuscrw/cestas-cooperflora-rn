import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import { format } from 'date-fns';
import GLOBALS from '../Globals';
import { Feather } from '@expo/vector-icons';

const DeliveryCard = ({
  delivery,
  ordersDateText,
  borderColor,
  onPress,
  showEditButton,
  onEditButtonPress,
}) => {
  const formatBaseProducts = (delivery) => {
    return delivery.baseProducts.toLowerCase().replace(/\n/g, ', ');
  };

  const formatCardTitle = (deliveryDate) => {
    return (
      <View style={styles.titleViewContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            Quarta-feira, {format(deliveryDate, GLOBALS.FORMAT.DEFAULT_DATE)}
          </Text>
          {showEditButton ? (
            <Feather
              name="edit"
              size={20}
              color={borderColor}
              onPress={onEditButtonPress}
            />
          ) : null}
        </View>
        <Divider style={{ backgroundColor: borderColor }} />
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
          title={formatCardTitle(delivery.deliveryDate)}
          dividerStyle={{ backgroundColor: borderColor }}
        >
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
                {formatBaseProducts(delivery)}
              </Text>
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  titleViewContainer: {
    marginVertical: 10,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    marginRight: 3,
    marginBottom: 7,
    top: -7,
  },
  contentContainer: {
    flex: 1,
    marginVertical: 7,
    justifyContent: 'space-evenly',
  },
  titleText: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
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

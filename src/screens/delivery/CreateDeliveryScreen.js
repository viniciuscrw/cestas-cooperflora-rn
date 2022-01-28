import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  Keyboard,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome5 } from '@expo/vector-icons';
import { Context as DeliveryContext } from '../../context/DeliveryContext';
import FormInput from '../../components/FormInput';
import Spacer from '../../components/Spacer';
import GLOBALS from '../../Globals';
import useConsumerGroup from '../../hooks/useConsumerGroup';
import HeaderTitle from '../../components/HeaderTitle';
import BackArrow from '../../components/BackArrow';
import Colors from '../../constants/Colors';
import { accessibilityLabel } from '../../utils';

const CreateDeliveryScreen = ({ route }) => {
  // console.log('[Create Delivery Screen started]');
  const { setDeliveryInfo } = useContext(DeliveryContext);

  const delivery = route && route.params ? route.params.delivery : null;

  const [deliveryDate, setDeliveryDate] = useState(
    delivery ? delivery.deliveryDate : new Date()
  );
  const [showDeliveryDate, setShowDeliveryDate] = useState(false);
  const [ordersLimitDate, setOrdersLimitDate] = useState(
    delivery
      ? delivery.limitDate
      : new Date(
          deliveryDate.getFullYear(),
          deliveryDate.getMonth(),
          deliveryDate.getDate() - 1,
          18
        )
  );
  const [ordersLimitTime, setOrdersLimitTime] = useState(
    delivery
      ? new Date(
          ordersLimitDate.getFullYear(),
          ordersLimitDate.getMonth(),
          ordersLimitDate.getDate(),
          ordersLimitDate.getHours(),
          ordersLimitDate.getMinutes()
        )
      : new Date(
          deliveryDate.getFullYear(),
          deliveryDate.getMonth(),
          deliveryDate.getDate() - 1,
          18
        )
  );
  const [showOrdersDateTime, setShowOrdersDateTime] = useState(false);
  const [dateTimeMode, setDateTimeMode] = useState('date');
  const [baseProducts, setBaseProducts] = useState(
    delivery ? delivery.baseProducts : ''
  );
  const groupInfo = useConsumerGroup();

  useEffect(() => {
    setDeliveryInfo(
      deliveryDate,
      ordersLimitDate,
      ordersLimitTime,
      baseProducts,
      groupInfo?.baseProductsPrice,
      groupInfo?.deliveryFee
    );
  }, []);

  const resolveNextMode = (isDateTimeInput = true) => {
    if (
      isDateTimeInput &&
      showOrdersDateTime &&
      Platform.OS === 'ios' &&
      dateTimeMode === 'time'
    ) {
      setDateTimeMode('date');
    }
  };

  const handleDateInputIconTouch = (showDate, setShowDate, isDateTimeInput) => {
    return (
      <TouchableOpacity
        onPress={() => {
          resolveNextMode(showDate, isDateTimeInput);
          setShowDate(!showDate);
        }}
      >
        {showDate ? (
          <FontAwesome5 name="caret-up" size={24} color="black" />
        ) : (
          <FontAwesome5 name="caret-down" size={24} color="black" />
        )}
      </TouchableOpacity>
    );
  };

  const onDeliveryDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deliveryDate;
    const limitDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 1,
      18
    );
    setShowDeliveryDate(Platform.OS === 'ios');
    setDeliveryDate(currentDate);
    setOrdersLimitDate(limitDate);

    setDeliveryInfo(
      currentDate,
      limitDate,
      limitDate,
      baseProducts,
      groupInfo?.baseProductsPrice,
      groupInfo?.deliveryFee
    );
  };

  const onOrdersDateTimeChange = (event, selectedValue) => {
    setShowOrdersDateTime(Platform.OS === 'ios');
    if (dateTimeMode === 'date') {
      const currentDate = selectedValue || ordersLimitDate;
      setOrdersLimitDate(currentDate);
      setDateTimeMode('time');
      setShowOrdersDateTime(Platform.OS !== 'ios');
      setDeliveryInfo(
        deliveryDate,
        currentDate,
        ordersLimitTime,
        baseProducts,
        groupInfo?.baseProductsPrice,
        groupInfo?.deliveryFee
      );
    } else {
      const selectedTime = selectedValue || ordersLimitTime;
      setOrdersLimitTime(selectedTime);
      setShowOrdersDateTime(Platform.OS === 'ios');
      const nextMode = Platform.OS === 'ios' ? 'time' : 'date';
      setDateTimeMode(nextMode);
      setDeliveryInfo(
        deliveryDate,
        ordersLimitDate,
        selectedTime,
        baseProducts,
        groupInfo?.baseProductsPrice,
        groupInfo?.deliveryFee
      );
    }
  };

  const handleOrdersDateTimeInputPress = () => {
    resolveNextMode();
    setShowOrdersDateTime(!showOrdersDateTime);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}
            behavior={Platform.OS === 'ios' ? 'position' : 'height'}
          >
            <View style={{ justifyContent: 'flex-end' }}>
              <ScrollView>
                <TouchableOpacity
                  onPress={() => setShowDeliveryDate(!showDeliveryDate)}
                >
                  <FormInput
                    id="deliverydate"
                    style={{
                      borderBottomWidth: 2,
                      borderColor: Colors.tertiary,
                    }}
                    label="Data da entrega"
                    value={format(deliveryDate, GLOBALS.FORMAT.DEFAULT_DATE)}
                    editable={false}
                    rightIcon={handleDateInputIconTouch(
                      showDeliveryDate,
                      setShowDeliveryDate,
                      false
                    )}
                    onTouchStart={() => setShowDeliveryDate(!showDeliveryDate)}
                  />
                </TouchableOpacity>
                {showDeliveryDate && (
                  <DateTimePicker
                    value={deliveryDate}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    onChange={onDeliveryDateChange}
                  />
                )}
                <TouchableOpacity onPress={handleOrdersDateTimeInputPress}>
                  <FormInput
                    id="deliverytime"
                    style={{
                      borderBottomWidth: 2,
                      borderColor: Colors.tertiary,
                    }}
                    label="Horário limite para pedidos"
                    value={`${format(
                      ordersLimitDate,
                      GLOBALS.FORMAT.DEFAULT_DATE
                    )} ${format(ordersLimitTime, GLOBALS.FORMAT.DEFAULT_TIME)}`}
                    editable={false}
                    rightIcon={handleDateInputIconTouch(
                      showOrdersDateTime,
                      setShowOrdersDateTime,
                      true
                    )}
                    onTouchStart={handleOrdersDateTimeInputPress}
                  />
                </TouchableOpacity>
                {showOrdersDateTime && (
                  <DateTimePicker
                    value={
                      dateTimeMode === 'date'
                        ? ordersLimitDate
                        : ordersLimitTime
                    }
                    mode={dateTimeMode}
                    is24Hour
                    display="default"
                    minimumDate={dateTimeMode === 'date' ? new Date() : null}
                    maximumDate={dateTimeMode === 'date' ? deliveryDate : null}
                    onChange={onOrdersDateTimeChange}
                  />
                )}
                <Spacer />
                <View style={styles.textAreaContainer}>
                  <TextInput
                    {...accessibilityLabel('basketitens')}
                    style={styles.textArea}
                    value={baseProducts}
                    onChangeText={setBaseProducts}
                    onEndEditing={() =>
                      setDeliveryInfo(
                        deliveryDate,
                        ordersLimitDate,
                        ordersLimitTime,
                        baseProducts,
                        groupInfo?.baseProductsPrice,
                        groupInfo?.deliveryFee
                      )
                    }
                    underlineColorAndroid="transparent"
                    placeholder="Composição da cesta"
                    placeholderTextColor="grey"
                    numberOfLines={10}
                    multiline
                  />
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export const createDeliveryScreenOptions = () => {
  return {
    headerTitle: () => (
      <View style={styles.header}>
        <HeaderTitle title="Nova Entrega" />
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#F0F5F9',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 25,
  },
  container: {
    flex: 1,
    margin: 10,
  },
  text: {
    color: '#101010',
    fontSize: 24,
    fontWeight: 'bold',
  },
  textAreaContainer: {
    borderColor: Colors.tertiary,
    borderWidth: 2,
    padding: 5,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  textArea: {
    fontSize: 16,
    height: 150,
    width: 300,
    textAlignVertical: 'top',
  },
  header: {
    alignItems: 'flex-start',
  },
});

export default CreateDeliveryScreen;

import React, { useContext, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { Context as ConsumerGroupContext } from '../context/ConsumerGroupContext';
import Spinner from '../components/Spinner';
import HeaderTitle from '../components/HeaderTitle';
import Colors from '../constants/Colors';
import { formatCurrency } from '../helper/HelperFunctions';
import BackArrow from '../components/BackArrow';

const EditConsumerGroupScreen = ({ navigation, route }) => {
  // const group = navigation.getParam('group');
  const { group } = route.params;
  const [address, setAddress] = useState(group ? group.address : '');
  const [time, setTime] = useState(group ? group.time : '');
  const [baseProductsPrice, setBaseProductsPrice] = useState(
    group ? formatCurrency(group.baseProductsPrice.toFixed(2)) : ''
  );
  const [deliveryFrequencyText, setDeliveryFrequencyText] = useState(
    group ? group.deliveryFrequencyText : ''
  );
  const [notice, setNotice] = useState(group ? group.notice : '');

  const { state, updateConsumerGroup } = useContext(ConsumerGroupContext);
  // const timeTextInput = React.createRef();
  // const deliveryFrequencyTextInput = React.createRef();
  // const noticeTextInput = React.createRef();

  const updateInfo = () => {
    group.address = address;
    group.time = time;
    group.deliveryFrequencyText = deliveryFrequencyText;
    group.notice = notice;
    group.baseProductsPrice = parseFloat(baseProductsPrice);

    updateConsumerGroup(group).then(navigation.goBack(null));
  };

  console.log(baseProductsPrice);

  const renderButton = () => {
    return state.loading ? (
      <Spinner size="small" />
    ) : (
      <View style={styles.buttonContainer}>
        <Button
          id="updateGroupButton"
          style={styles.button}
          textColor="white"
          onPress={updateInfo}
        >
          Atualizar Informações
        </Button>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          enabled
          keyboardVerticalOffset={100}
        >
          <TouchableHighlight
            onPress={Keyboard.dismiss}
            underlayColor="#f2f2f2"
          >
            <ScrollView>
              <MaterialIcons
                style={styles.cancelIcon}
                name="cancel"
                size={24}
                color={Colors.secondary}
                onPress={() => navigation.goBack(null)}
              />
              <FormInput
                id="address"
                label="Endereço"
                value={address}
                onChangeText={setAddress}
                multiline
                maxLength={200}
                autoCapitalize="words"
                autoCorrect={false}
              />
              <FormInput
                id="time"
                label="Horário"
                value={time}
                onChangeText={setTime}
                maxLength={140}
                autoCapitalize="sentences"
                autoCorrect={false}
              />
              <FormInput
                id="deliveries"
                label="Entregas"
                value={deliveryFrequencyText}
                onChangeText={setDeliveryFrequencyText}
                multiline
                maxLength={140}
                autoCapitalize="sentences"
              />
              <FormInput
                id="baseProductsPrice"
                label="Preço da Cesta - R$"
                value={baseProductsPrice}
                onChangeText={setBaseProductsPrice}
                returnKeyType="done"
                keyboardType="numeric"
                maxLength={7}
              />
              <FormInput
                id="notes"
                label="Observações"
                value={notice}
                multiline
                maxLength={200}
                onChangeText={setNotice}
                autoCapitalize="sentences"
              />
              {renderButton()}
            </ScrollView>
          </TouchableHighlight>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export const editConsumerGroupScreenOptions = (navData) => {
  return {
    headerTitle: () => <HeaderTitle title="Editar Informações" />,
    headerBackImage: () => <BackArrow />,
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
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
  },
  cancelIcon: {
    alignSelf: 'flex-end',
  },
  button: {
    marginTop: 5,
    backgroundColor: Colors.secondary,
    alignSelf: 'center',
  },
});

export default EditConsumerGroupScreen;

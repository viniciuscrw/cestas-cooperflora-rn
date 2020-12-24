import React, { useContext, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Spacer from '../components/Spacer';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { Context as ConsumerGroupContext } from '../context/ConsumerGroupContext';
import Spinner from '../components/Spinner';
import TextLink from '../components/TextLink';

const EditConsumerGroupScreen = ({ navigation }) => {
  const group = navigation.getParam('group');

  const [address, setAddress] = useState(group ? group.address : '');
  const [time, setTime] = useState(group ? group.time : '');
  const [deliveryFrequencyText, setDeliveryFrequencyText] = useState(
    group ? group.deliveryFrequencyText : ''
  );
  const [notice, setNotice] = useState(group ? group.notice : '');

  const { state, updateConsumerGroup } = useContext(ConsumerGroupContext);
  const timeTextInput = React.createRef();
  const deliveryFrequencyTextInput = React.createRef();
  const noticeTextInput = React.createRef();

  const updateInfo = () => {
    group.address = address;
    group.time = time;
    group.deliveryFrequencyText = deliveryFrequencyText;
    group.notice = notice;

    updateConsumerGroup(group).then(navigation.goBack(null));
  };

  const renderButton = () => {
    return state.loading ? (
      <Spinner size="small" />
    ) : (
      <Button onPress={updateInfo}>Atualizar Informações</Button>
    );
  };

  return (
    // <KeyboardAvoidingView
    //   style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //   enabled
    //   keyboardVerticalOffset={100}
    // >
    // <TouchableHighlight onPress={Keyboard.dismiss} underlayColor={'#f2f2f2'}>
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Editar Grupo de Consumo</Text>
          <TextLink
            text="Cancelar"
            onPress={() => navigation.goBack(null)}
            style={styles.cancelButton}
          />
        </View>
        <Spacer />
        <FormInput
          label="Endereço"
          value={address}
          onChangeText={setAddress}
          multiline
          maxLength={200}
          autoCapitalize="words"
          autoCorrect={false}
        />
        <Spacer />
        <FormInput
          label="Horário"
          value={time}
          onChangeText={setTime}
          maxLength={140}
          autoCapitalize="sentences"
          autoCorrect={false}
        />
        <Spacer />
        <FormInput
          label="Entregas"
          value={deliveryFrequencyText}
          onChangeText={setDeliveryFrequencyText}
          multiline
          maxLength={140}
          autoCapitalize="sentences"
        />
        <Spacer />
        <FormInput
          label="Observações"
          value={notice}
          multiline
          maxLength={200}
          onChangeText={setNotice}
          autoCapitalize="sentences"
        />
        <Spacer />
        {renderButton()}
      </View>
    </ScrollView>
    // </TouchableHighlight>
    // </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 10,
  },
  title: {
    color: '#101010',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 3,
    marginLeft: 5,
  },
  cancelButton: {
    marginRight: 15,
  },
});

export default EditConsumerGroupScreen;

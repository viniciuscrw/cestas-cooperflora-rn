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
import HeaderTitle from '../components/HeaderTitle';
import Colors from '../constants/Colors';
// import BackArrow from '../../../components/BackArrow';

const EditConsumerGroupScreen = (props) => {
  // const group = navigation.getParam('group');
  const group = props.route.params.group;

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

    updateConsumerGroup(group).then(props.navigation.goBack(null));
  };

  const renderButton = () => {
    return state.loading ? (
      <Spinner size="small" />
    ) : (
      <View style={styles.buttonContainer}>
        <Button style={styles.button}
          textColor='white'
          onPress={updateInfo}>
          Atualizar Informações
        </Button>
      </View>
    );
  };

  return (
    <View style={styles.screen} >
      <View style={styles.container} >
        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          enabled
          keyboardVerticalOffset={100}
        >
          <TouchableHighlight onPress={Keyboard.dismiss} underlayColor={'#f2f2f2'}>
            <ScrollView>
              <View style={styles.container}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Editar Grupo de Consumo</Text>
                  <TextLink
                    text="Cancelar"
                    onPress={() => props.navigation.goBack(null)}
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
          </TouchableHighlight>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export const editConsumerGroupScreenOptions = (navData) => {
  return {
    headerTitle: () => (
      <HeaderTitle title="Edit COnsumer" />
    ),
    // headerBackImage: () => (<BackArrow />),
    // headerStyle: {
    //     backgroundColor: 'transparent',
    //     elevation: 0,
    //     shadowOpacity: 0,
    //     borderBottomWidth: 0,
    // }
  };
};

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
    backgroundColor: '#F0F5F9',
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 25
  },
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
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  button: {
    marginTop: 5,
    backgroundColor: Colors.secondary,
    alignSelf: 'center',
  },
});

export default EditConsumerGroupScreen;

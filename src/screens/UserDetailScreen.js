import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import {
  FontAwesome,
  FontAwesome5,
  Entypo,
  AntDesign,
  Ionicons,
} from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { TextLabel, TextContent } from '../components/StandardStyles';
import { sendPushNotificationToUser } from '../utils';

const UserDetailScreen = (props) => {
  const [notificationMessage, setNotificationMessage] = useState(
    'Mensagem de Cestas Cooperflora'
  );
  // const user = navigation.getParam('user');
  const { user } = props.route.params;

  const sendUserNotification = () => {
    sendPushNotificationToUser(user.pushNotificationToken, notificationMessage);
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} maximumZoomScale={1.25}>
        <View style={styles.optionsContainer}>
          <Ionicons
            style={styles.iconButton}
            name="chevron-back"
            size={24}
            color={Colors.secondary}
            onPress={() => props.navigation.goBack(null)}
          />
          <AntDesign
            name="form"
            size={27}
            color={Colors.secondary}
            onPress={() =>
              props.navigation.navigate('CreateUserScreen', { user })
            }
            style={styles.iconButton}
          />
        </View>
        <View style={styles.userDataContainer}>
          <View style={styles.dataContainer}>
            <View style={styles.iconContainer}>
              <FontAwesome name="user" size={24} color={Colors.secondary} />
            </View>
            <Text style={styles.text}>{user.name}</Text>
          </View>
          <View style={styles.dataContainer}>
            <View style={styles.iconContainer}>
              <Entypo name="email" size={24} color={Colors.secondary} />
            </View>
            <Text style={styles.text}>{user.email}</Text>
          </View>
          <View style={styles.dataContainer}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="phone" size={24} color={Colors.secondary} />
            </View>
            <Text style={styles.text}>{user.phoneNumber}</Text>
          </View>
          {/* <View style={styles.dataContainer}>
            <View style={styles.iconContainer}>
              <FontAwesome5
                name="dollar-sign"
                size={24}
                color={Colors.secondary}
              />
            </View>
            <Text style={styles.text}>Saldo: {`R$ ${user.balance}`}</Text>
          </View> */}
          {user.pushNotificationToken ? (
            <View>
              <TextLabel>Notificação</TextLabel>
              <TextContent>Digite a mensagem e clique no sininho</TextContent>
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  value={notificationMessage}
                  onChangeText={(text) => setNotificationMessage(text)}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="grey"
                  numberOfLines={3}
                  multiline
                />
                <TouchableHighlight
                  style={styles.notificationIcon}
                  onPress={() => {
                    sendUserNotification();
                  }}
                >
                  <Ionicons
                    name="notifications-sharp"
                    size={24}
                    color={Colors.secondary}
                  />
                </TouchableHighlight>
              </View>
            </View>
          ) : (
            <TextContent>
              Notificação não está habilitada para essa pessoa consumidora
            </TextContent>
          )}
        </View>
      </ScrollView>
    </View>
  );
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
    margin: 10,
    marginTop: 20,
  },
  optionsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  iconButton: {
    padding: 10,
  },
  userDataContainer: {
    marginLeft: 15,
  },
  dataContainer: {
    flexDirection: 'row',
  },
  text: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
    color: '#505050',
    padding: 5,
  },
  iconContainer: {
    alignContent: 'center',
    height: 40,
    width: '10%',
  },
  icon: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
  textAreaContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  textArea: {
    borderColor: Colors.tertiary,
    borderWidth: 1,
    fontSize: 16,
    width: '90%',
    height: 40,
    textAlignVertical: 'top',
    padding: 2,
    paddingLeft: 5,
  },
  notificationIcon: {
    marginLeft: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserDetailScreen;

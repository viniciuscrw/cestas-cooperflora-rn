import { useContext } from 'react';
import Constants from 'expo-constants';
import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Context as UserContext } from './context/UserContext';

export const accessibilityLabel = (id) => {
  if (Platform.OS === 'android') {
    return { accessibilityLabel: id };
  }
  if (Platform.OS === 'ios') {
    return { testID: id };
  }
  return null;
};

export const setPushNotificationToken = async () => {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Falha para conseguir permissão para notificação!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    Alert.alert('Esse recurso não funciona para emuladores.');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return token;
};

export const sendPushNotification = async (users) => {
  console.log('Enviando notificação para as consumidoras e os consumidores!');
  const message = {
    // to: expoPushToken,
    sound: 'default',
    title: 'Nova entrega de cesta orgânica da cooperativa Cooperflora.',
    body: 'Você já pode informar se gostaria de pegar a sua cesta orgânica na próxima entrega!',
    data: { someData: 'goes here' },
  };

  users.map(async (user) => {
    if (user.pushNotificationToken) {
      console.log('Enviando notificação para', user.name);
      message.to = user.pushNotificationToken;
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    }
  });
};

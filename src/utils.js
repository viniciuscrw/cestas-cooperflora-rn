//import Constants from 'expo-constants';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

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
  console.log('[Utils - setPushNotification]');
  let token;

  const isRunningInExpoGo = Constants.executionEnvironment === 'storeClient';

  // ✅ Só tenta obter token se for um build real, não o Expo Go
  if (Device.isDevice && !isRunningInExpoGo) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Falha ao conseguir permissão para notificações!');
      return;
    }

    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo Push Token:', token);
    } catch (error) {
      console.log('Erro ao obter token de push:', error);
      Alert.alert('Erro ao obter token de push.');
    }
  } else {
    // 🚫 Evita erro: não chama o método no Expo Go
    console.log('Executando no Expo Go — notificações push desativadas.');
    Alert.alert('Notificações push não funcionam no Expo Go.');
  }

  // 🔔 Configura canal Android (isso pode rodar em qualquer ambiente)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
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
      fetch('https://exp.host/--/api/v2/push/send', {
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

export const sendPushNotificationToUser = async (
  userExpoNotificationToken,
  notifcationMessage
) => {
  console.log('Token', userExpoNotificationToken);

  console.log('Enviando notificação para usuário único!');
  const message = {
    to: userExpoNotificationToken,
    sound: 'default',
    title: 'Notificação de Cestas Cooperflora',
    body: notifcationMessage,
    data: { someData: 'goes here' },
  };
  fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
    .then((response) => response.json())
    .then((res) => {
      console.log(res.data.status);
      if (res.data.status === 'error') {
        console.log('Erro ao enviar notificação');
        console.log(res);
        Alert.alert('Ocorreu um problema ao enviar a notificação.');
      } else {
        console.log('Notificação enviada com sucesso!');
        console.log(res);
        Alert.alert('Notificação enviada com sucesso!');
      }
    })
    .catch((error) => {
      console.log('Erro ao enviar notificação');
      console.log(error);
      Alert.alert('Ocorreu um problema ao enviar a notificação.');
    });
};

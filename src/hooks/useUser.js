import { useEffect, useState } from 'react';
import { getById } from '../api/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default () => {
  const [currentUser, setCurrentUser] = useState(null);

  const getUser = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const userRole = await AsyncStorage.getItem('userRole');
    const userName = await AsyncStorage.getItem('userName');
    console.log("---", userRole);

    if (!(userId && userRole)) {
      const user = await getById('users', userId);
      await AsyncStorage.setItem('userId', user.id);
      await AsyncStorage.setItem('userRole', user.role);
      await AsyncStorage.setItem('userName', user.name);

      setCurrentUser(user);

    } else {
      setCurrentUser({ id: userId, role: userRole });

    }
  };

  useEffect(() => {
    getUser().catch((err) => console.log(err));
  }, []);

  return currentUser;
};

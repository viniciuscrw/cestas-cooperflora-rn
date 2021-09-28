import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirst } from '../api/firebase';
import GLOBALS from '../Globals';

export default () => {
  const [group, setGroup] = useState(null);

  const getResult = async () => {
    const groupDataStr = await AsyncStorage.getItem('group');
    let groupData = JSON.parse(groupDataStr);

    if (!groupData) {
      groupData = await getFirst(GLOBALS.COLLECTION.GROUPS);
      await AsyncStorage.setItem('group', JSON.stringify(groupData));

      setGroup(groupData);
    } else {
      setGroup(groupData);
    }
  };

  useEffect(() => {
    getResult().catch((err) =>
      console.log(`Error useConsumerGroup hook: ${err}`)
    );
  }, []);

  return group;
};

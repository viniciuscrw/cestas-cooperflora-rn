import { useEffect, useState } from 'react';
import { getFirst } from '../api/firebase';

export default () => {
  const [group, setGroup] = useState(null);

  const getResult = async () => {
    const groupData = await getFirst('groups');
    setGroup(groupData);
  };

  useEffect(() => {
    getResult().catch((err) => console.log(err));
  }, []);

  return group;
};

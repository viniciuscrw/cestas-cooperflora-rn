import React from 'react';
import { View, Image } from 'react-native';
import Arrow from '../../assets/images/icons/backarrow.png';

const BackArrow = () => {
  return (
    <View>
      <Image source={Arrow} />
    </View>
  );
};

export default BackArrow;

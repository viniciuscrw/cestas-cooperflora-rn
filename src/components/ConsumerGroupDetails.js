import React from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import FrontArrow from '../../assets/images/icons/frontarrow.png';
import useUser from '../hooks/useUser';
import HeaderTitle from './HeaderTitle';
import BackArrow from './BackArrow';

const ConsumerGroupDetails = ({ navigation }) => {
  const user = useUser();

  return user ? (
    <TouchableOpacity
      onPress={() => {
        if (user.role === 'organizer') {
          // console.log('[Consumer Group Details Screen] user role', user.role);
          navigation.navigate('ConsumerGroupManagement', {
            userRole: user.role,
          });
        } else if (user.role === 'consumer') {
          // console.log('ConsumerGroupInfoScreen', navigation.navigate);
          // navigation.navigate('ConsumerGroupInfoScreen', { userRole: user.role });
          navigation.navigate('ConsumerGroupInfoScreen', {
            userRole: user.role,
          });
        } else {
          console.log('Ocorreu um erro');
        }
      }}
    >
      <Image source={FrontArrow} />
    </TouchableOpacity>
  ) : null;
};

export const consumerGroupDetailsScreenOptions = () => {
  return {
    headerTitle: () => (
      <HeaderTitle title="Informações sobre o grupo de consumo" />
    ),
    headerBackImage: () => <BackArrow />,
    headerBackTitleVisible: false,
  };
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 10,
  },
});

export default ConsumerGroupDetails;

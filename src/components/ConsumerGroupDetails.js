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
          navigation.navigate('ConsumerGroupManagement', {
            userRole: user.role,
          });
        } else if (user.role === 'consumer') {
          navigation.navigate('ConsumerGroupInfoScreen', {
            userRole: user.role,
          });
        } else {
          console.log('Ocorreu um erro');
        }
      }}
    >
      <Image style={styles.frontArrow} source={FrontArrow} />
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
  frontArrow: {
    marginRight: 10,
  },
});

export default ConsumerGroupDetails;

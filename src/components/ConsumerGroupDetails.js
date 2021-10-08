import React from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { withNavigation } from 'react-navigation';
import FrontArrow from '../../assets/images/icons/frontarrow.png';
import useUser from '../hooks/useUser';

const ConsumerGroupDetails = ({ navigation }) => {
  const user = useUser();
  console.log('Consumer Group Details Screen', navigation);

  return user ? (
    <TouchableOpacity onPress={() => {
      if (user.role === 'organizer') {
        navigation.navigate('ConsumerGroupTopTabNavigator', { userRole: user.role });
      }
      // console.log('ConsumerGroupInfoScreen', navigation.navigate);
      // navigation.navigate('ConsumerGroupInfoScreen', { userRole: user.role });
      navigation.navigate('PaymentsScreen', { userRole: user.role });

    }}>
      <Image
        source={FrontArrow}
      />
    </TouchableOpacity>
    // <AntDesign
    //   name="infocirlceo"
    //   size={22}
    //   color="#2d98d6"
    //   style={styles.icon}
    //   onPress={() => {
    //     if (user.role === 'organizer') {
    //       navigation.navigate('ConsumerGroup', { userRole: user.role });
    //     }
    //     navigation.navigate('ConsumerGroupInfo', { userRole: user.role });
    //   }}
    // />
  ) : null;
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 10,
  },
});

export default ConsumerGroupDetails;

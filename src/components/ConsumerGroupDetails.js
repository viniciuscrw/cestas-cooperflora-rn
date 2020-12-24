import React from 'react';
import { StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { withNavigation } from 'react-navigation';
import useUser from '../hooks/useUser';

const ConsumerGroupDetails = ({ navigation }) => {
  const user = useUser();

  return user ? (
    <AntDesign
      name="infocirlceo"
      size={22}
      color="#2d98d6"
      style={styles.icon}
      onPress={() => {
        if (user.role === 'organizer') {
          navigation.navigate('ConsumerGroup', { userRole: user.role });
        }
        navigation.navigate('ConsumerGroupInfo', { userRole: user.role });
      }}
    />
  ) : null;
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 10,
  },
});

export default withNavigation(ConsumerGroupDetails);

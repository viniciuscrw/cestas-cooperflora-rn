import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/Colors';

const HeaderTitle = ({ title, subtitle }) => {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Roboto',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.headerTitleColor
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 3,
  },
});

export default HeaderTitle;

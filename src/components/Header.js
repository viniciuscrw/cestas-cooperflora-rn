import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const Header = (props) => {
  const { text, view } = styles;

  return (
    <View style={view}>
      <Text style={text}>{props.headerText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative',
  },
  text: {
    fontSize: 30,
    fontFamily: 'DevanagariSangamMN-Bold',
  },
});

export default Header;

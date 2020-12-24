import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ArrowButton = ({ onPress, style }) => {
  const { button, text, arrow } = styles;

  return (
    <TouchableOpacity onPress={onPress} style={[button, style]}>
      <FontAwesome
        name="long-arrow-right"
        size={36}
        color="darkolivegreen"
        style={arrow}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    alignSelf: 'center',
    color: 'darkolivegreen',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10,
  },
  button: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'darkolivegreen',
    marginLeft: 5,
    marginRight: 5,
  },
  arrow: {
    alignSelf: 'center',
    paddingTop: 2,
    paddingBottom: 2,
  },
});

export default ArrowButton;

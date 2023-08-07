import React from 'react';
import { StyleSheet, Text } from 'react-native';

export const TextLabel = ({ style, children }) => {
  return <Text style={{ ...styles.textLabel, ...style }}>{children}</Text>;
};

export const TextContent = ({ children, style }) => {
  return <Text style={{ ...styles.textContent, ...style }}>{children}</Text>;
};

export const Number = ({ children, style }) => {
  return <Text style={{ ...styles.number, ...style }}>{children}</Text>;
};

const styles = StyleSheet.create({
  textLabel: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
    color: '#505050',
  },
  textContent: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '400',
    color: '#505050',
  },
  number: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 16,
    color: '#8898AA',
  },
});

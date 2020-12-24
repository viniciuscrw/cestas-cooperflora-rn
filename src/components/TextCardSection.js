import React, { Children } from 'react';
import { View, StyleSheet, Text } from 'react-native';

const TextCardSection = ({ children, text }) => {
  const isLastChild = (index) => {
    return index === Children.count(children) - 1;
  };

  return (
    <View>
      <Text style={styles.text}>{text}</Text>
      {Children.map(children, (child, index) => (
        <View style={isLastChild(index) ? styles.lastChild : styles.container}>
          {child}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative',
  },
  lastChild: {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative',
  },
  text: {
    fontSize: 17,
    paddingVertical: 10,
    paddingLeft: 20,
  },
});

export default TextCardSection;

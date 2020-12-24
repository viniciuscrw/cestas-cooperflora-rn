import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TextInformation = ({ title, text }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text selectable style={styles.text}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    alignSelf: 'flex-start',
  },
  title: {
    color: '#101010',
    fontSize: 22,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    color: '#595656',
    marginTop: 8,
  },
});

export default TextInformation;

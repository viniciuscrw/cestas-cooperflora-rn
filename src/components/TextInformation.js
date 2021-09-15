import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TextInformation = ({ title, text }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}> {title}</Text>
      <Text style={styles.text}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    //backgroundColor: '#d0d0c4'
  },
  title: {
    color: '#101010',
    fontSize: 15,
    fontWeight: 'bold',
  },
  text: {
    width:210,
    fontSize: 13,
    color: 'black',
    marginTop: 5,
  },
});

export default TextInformation;

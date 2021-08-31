import React from 'react';
import { View, StyleSheet } from 'react-native';

const Divider = (props) => {
    return (
        <View style={{ alignItems: 'center' }}>
            <View style={{...styles.horizontalLine, ...props.style}}>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    horizontalLine: {
        borderBottomWidth: 2,
        width: '95%',
    }
});

export default Divider;

import React, { PropsWithChildren } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

type Props = PropsWithChildren<{
    title: string;
    color?: string;
    onPress: () => void;
    style?: any;
}>;

export default function Button({ title, color, onPress, style }: Props) {
    return (
        <Pressable style={{...styles.button, ...style}} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
    },
    text: {
        fontFamily: 'NunitoBold',
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});

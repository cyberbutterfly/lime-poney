import * as React from 'react';
import {StyleSheet, View} from 'react-native';

export interface CardProps {
    children: JSX.Element[]|JSX.Element;
}

const style = StyleSheet.create({
    wrapper: {
        padding: 2
    },
    card: {
        borderRadius: 2,
        shadowColor: "#000000",
        shadowOpacity: .25,
        shadowRadius: 2,
        shadowOffset: {
            height: 2,
            width: 2,
        }
    }
});

export const Card = (props: CardProps) => (
    <View style={style.wrapper}>
        <View style={style.card}>
            {props.children}
        </View>
    </View>
);

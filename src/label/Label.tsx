import * as React from 'react';
import {Text, TextStyle} from 'react-native';

export interface LabelProps {
    value: string;
    style?: TextStyle;
}

export const Label = (props: LabelProps) => <Text style={props.style}>{props.value}</Text>;

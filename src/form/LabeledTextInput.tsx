import * as React from 'react';
import {StyleSheet, TextInput, TextInputProperties, View} from 'react-native';
import {Label} from '../label/Label';

export interface LabeledTextInputProps extends TextInputProperties {
    label: string;
    stacked?: boolean;
}

export const LabeledTextInput = (props: LabeledTextInputProps) => {
    const {label, stacked, style, ...textInputProps} = props;
    const computedStyle = [styles.default];
    if (!stacked) {
        computedStyle.push(styles.horizontal);
    }
    return (
        <View style={computedStyle}>
            <Label value={label}/>
            <TextInput style={[styles.textInput, style]} {...textInputProps}/>
        </View>
    )
};

const styles = StyleSheet.create({
    default: {
        margin: 1,
    },
    horizontal: {
        flexDirection: 'row'
    },
    textInput: {
        flex: 1,
        marginLeft: 16,
        borderWidth: 1,
        borderStyle: 'solid',
    },
});

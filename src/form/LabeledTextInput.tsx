import * as React from 'react';
import {StyleSheet, TextInput, TextInputProperties, View} from 'react-native';
import {Label} from '../label/Label';

export interface LabeledTextInputProps extends TextInputProperties {
    label: string;
    stacked?: boolean;
}

export const LabeledTextInput = (props: LabeledTextInputProps) => {
    const {label, stacked, style, ...textInputProps} = props;
    const computedStyle = [];
    if (!stacked) {
        computedStyle.push(styles.horizontal);
    }
    return (
        <View style={computedStyle}>
            <Label value={label}/>
            <TextInput style={[{flex: 1, marginLeft: 16}, style]} {...textInputProps}/>
        </View>
    )
};

const styles = StyleSheet.create({
    horizontal: {
        flexDirection: 'row'
    }
});

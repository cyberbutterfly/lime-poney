import * as React from 'react';
import {StyleSheet, TextInput, TextInputProperties, View} from 'react-native';
import {Label} from '../label/Label';

export interface LabeledTextInputProps extends TextInputProperties {
    label: string;
    stacked?: boolean;
    readonly?: boolean;
}

export const LabeledTextInput = (props: LabeledTextInputProps) => {
    const {label, stacked, readonly, style, ...textInputProps} = props;
    const computedStyle = [styles.default];
    const {value, ...labelProps} = textInputProps;
    if (!stacked) {
        computedStyle.push(styles.horizontal);
    }

    return (
        <View style={computedStyle}>
            <Label value={label}/>
            {
                readonly ? (
                    <Label
                        value={value || ''}
                        style={StyleSheet.flatten([styles.value, style])}
                        {...labelProps}
                    />
                ) : (
                    <TextInput
                        style={StyleSheet.flatten([styles.value, styles.textInput, style])}
                        {...textInputProps}
                    />
                )
            }
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
    value: {
        flex: 1,
        marginLeft: 16,
        textAlign: 'right',
    },
    textInput: {
        borderWidth: 1,
        borderStyle: 'solid',
    },
});

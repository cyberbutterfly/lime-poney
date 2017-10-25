import * as React from 'react';
import {StyleSheet, TouchableHighlight, View, ViewStyle} from 'react-native';
import {Label} from '../label/Label';
import * as _ from 'lodash';
import {Theme} from '../theme/Theme';
import {Link} from 'react-router-dom';

export interface CardProps {
    title?: string;
    actions?: CardAction[];
    children: JSX.Element[]|JSX.Element;
    theme?: Theme;
    style?: ViewStyle;
}

export interface CardAction {
    label: string;
    handler?: () => void;
    target?: string;
    disabled?: boolean;
}


export const Card = (props: CardProps) => {
    const theme = props.theme || new Theme();
    const style = StyleSheet.create({
        card: {
            backgroundColor: '#ffffff',
            padding: 8,
            borderRadius: 2,
            shadowColor: '#000000',
            shadowOpacity: .25,
            shadowRadius: 2,
            shadowOffset: {
                height: 2,
                width: 2,
            },
            marginVertical: 4
        },
        title: {
            color: theme.accentColor,
            fontWeight: 'bold',
            borderColor: '#999999',
            borderBottomWidth: 1,
            paddingBottom: 8,
        },
        content: {
            paddingBottom: 8,
            paddingTop: 8,
        },
        actions: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderColor: '#999999',
            borderTopWidth: 1
        },
        action: {
            color: theme.accentColor,
            fontWeight: 'bold',
            paddingTop: 8
        },
        disabled: {
            opacity: .5
        },
        link: {
            textDecorationLine: 'none'
        }
    });
    return (
        <View style={StyleSheet.flatten([style.card, props.style])}>
            {props.title && <View style={style.title}><Label value={props.title}/></View>}
            <View style={style.content}>
                {props.children}
            </View>
            {
                props.actions && (
                    <View style={style.actions}>
                        {
                            _.map(props.actions, (action: CardAction, index: number) => action.disabled ? (
                                <View key={index}>
                                    <Label
                                        value={action.label}
                                        style={StyleSheet.flatten([style.action, style.disabled])}
                                    />
                                </View>
                            ) : action.target ? (
                                <Link key={index} to={action.target} style={{textDecorationLine: 'none'}}>
                                    <TouchableHighlight underlayColor={'rgba(0, 0, 0, .25)'}>
                                        <View>
                                            <Label value={action.label} style={style.action}/>
                                        </View>
                                    </TouchableHighlight>
                                </Link>
                            ) : (
                                <TouchableHighlight
                                    key={index}
                                    onPress={action.handler}
                                    underlayColor={'rgba(0, 0, 0, .25)'}
                                >
                                    <View>
                                        <Label value={action.label} style={style.action}/>
                                    </View>
                                </TouchableHighlight>
                            ))
                        }
                    </View>
                )
            }
        </View>
    );
};

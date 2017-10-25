import * as _ from 'lodash';
import * as React from 'react';
import {StyleSheet, TextStyle, TouchableHighlight, View, ViewStyle} from 'react-native';
import {Label} from '../label/Label';
import {Icon} from '../icon/Icon';
import {Theme} from '../theme/Theme';
import {NavLink} from 'react-router-dom';

export interface FooterProps {
    actionButton?: Action;
    actions?: Action[];
    theme?: Theme;
}

export interface Action {
    icon?: string;
    text?: string;
    isActive?: boolean;
    onPress?: () => void;
    target?: string;
}

export class Footer extends React.Component<FooterProps, {}> {
    private styles: {
        footer: ViewStyle,
        actionBar: ViewStyle,
        actionButton: ViewStyle,
        actionButtonIcon: TextStyle,
        action: ViewStyle,
        actionText: TextStyle,
        actionIcon: TextStyle,
        link: TextStyle,
    };

    public constructor(props: FooterProps) {
        super(props);

        const theme = props.theme || new Theme();

        this.styles = {
            footer: {
            },
            actionBar: {
                height: 49,
                flexDirection: 'row',
                justifyContent: 'space-around',
            },
            actionButton: {
                zIndex: 10,
                position: 'absolute',
                bottom: 10,
                height: 48,
                width: 48,
                borderRadius: 24,
                justifyContent: 'center',
                alignItems: 'center',
                left: 'calc(50% - 24px)',
                borderStyle: 'solid',
                borderWidth: 1,
                backgroundColor: theme.accentColor,
            },
            actionButtonIcon: {
                color: theme.textOnAccentColor,
            },
            action: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            },
            actionIcon: {
                color: theme.accentColor,
                fontSize: 24,
            },
            actionText: {
                color: theme.accentColor,
                fontSize: 10,
            },
            link: {
                display: 'flex',
                textDecorationLine: 'none',
                borderWidth: 0
            }
        };
    }

    public render() {
        const {actions, actionButton} = this.props;
        let styles = this.styles;
        return (
            <View style={styles.footer}>
                {
                    actionButton &&
                        actionButton.target ? (
                            <NavLink
                                to={actionButton.target}
                                style={StyleSheet.flatten([styles.actionButton, styles.link])}
                                replace={true}
                            >
                                <View>
                                    <TouchableHighlight underlayColor={'rgba(0, 0, 0, .25)'}>
                                        <View style={styles.action}>
                                            {actionButton.icon && (
                                                <Icon
                                                    name={actionButton.icon}
                                                    style={[styles.actionIcon, styles.actionButtonIcon]}
                                                />
                                            )}
                                        </View>
                                    </TouchableHighlight>
                                </View>
                            </NavLink>
                        ) : (
                            <View style={styles.actionButton}>
                                <TouchableHighlight onPress={actionButton.onPress} underlayColor={'rgba(0, 0, 0, .25)'}>
                                    <View style={styles.action}>
                                        {actionButton.icon && (
                                            <Icon
                                                name={actionButton.icon}
                                                style={[styles.actionIcon, styles.actionButtonIcon]}
                                            />
                                        )}
                                    </View>
                                </TouchableHighlight>
                            </View>
                        )
                }
                <View style={styles.actionBar}>{
                    _.map(actions, (action: Action, index: number) => {
                        return action.target ? (
                            <NavLink
                                key={'a-' + index}
                                to={action.target}
                                style={StyleSheet.flatten([this.styles.action, styles.link])}
                                isActive={() => location.hash === '#' + action.target}
                                replace={true}
                            >
                                <View>
                                    <TouchableHighlight onPress={action.onPress} underlayColor={'rgba(0, 0, 0, .25)'}>
                                        <View style={this.styles.action}>
                                            {action.icon && <Icon name={action.icon} style={this.styles.actionIcon}/>}
                                            {action.text && <Label value={action.text} style={this.styles.actionText}/>}
                                        </View>
                                    </TouchableHighlight>
                                </View>
                            </NavLink>
                        ) : (
                            <View key={'a-' + index} style={this.styles.action}>
                                <TouchableHighlight onPress={action.onPress} underlayColor={'rgba(0, 0, 0, .25)'}>
                                    <View style={this.styles.action}>
                                        {action.icon && <Icon name={action.icon} style={this.styles.actionIcon}/>}
                                        {action.text && <Label value={action.text} style={this.styles.actionText}/>}
                                    </View>
                                </TouchableHighlight>
                            </View>
                        );
                    })
                }</View>
            </View>
        );
    }
}

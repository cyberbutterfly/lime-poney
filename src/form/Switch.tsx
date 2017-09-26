import * as React from 'react';
import {Switch as NativeSwitch, SwitchProperties} from 'react-native';

export const Switch = (props: SwitchProperties) => <NativeSwitch {...props}/>;

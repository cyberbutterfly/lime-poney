/*
import * as React from 'react';
import {CSSProperties} from 'react';

import './Icon.scss';
import './SvgIconLoader';

export interface IconProps {
    icon: string;
    className?: string;
    onClick?: () => void;
    style?: CSSProperties;
}

export const Icon = (props: IconProps) => (
    <svg
        className={'icon ' + props.icon + ' ' + props.className}
        onClick={props.onClick}
        style={props.style || {}}
    >
        <use xlinkHref={'#' + props.icon}/>
    </svg>
);
*/

// import 'onsenui/css/onsenui.css';
// import 'onsenui/css/onsen-css-components.css';
export {Icon} from 'react-onsenui';

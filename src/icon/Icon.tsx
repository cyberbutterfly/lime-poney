import * as React from 'react';
import {IconProps} from 'react-native-vector-icons/Icon';

const IconJS = require('react-native-vector-icons/dist/FontAwesome').default;
const iconFont = require('react-native-vector-icons/Fonts/FontAwesome.ttf');
// const IconJS = require('react-native-vector-icons/dist/Ionicons').default;
// const iconFont = require('react-native-vector-icons/Fonts/Ionicons.ttf');

const iconFontStyles = `@font-face {
  src: url(${iconFont});
  font-family: FontAwesome;
}`;

if (!document.getElementById('iconFont')) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'iconFont';
    style.appendChild(document.createTextNode(iconFontStyles));
    document.head.appendChild(style);
}


export const Icon = (props: IconProps) => (
    <IconJS {...props}/>
);

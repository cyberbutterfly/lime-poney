import {Location} from 'history';
import * as React from 'react';
import {Label} from '../label';
import {Image, ImageURISource, View} from 'react-native';

export interface HeaderProps {
    children?: JSX.Element|JSX.Element[]|string;
    logo?: ImageURISource;
    title?: string;
    subTitle?: string;
    hideNavigation?: boolean;
    location?: Location;
}


export const Header = (props: HeaderProps) => (
    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch'}}>
        <Image source={props.logo} resizeMode={'contain'} style={{height: 50, width: 100, margin: 5}}/>
        {
            props.title && (
                <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 10}}>
                    <Label value={props.title} style={{fontSize: 28, fontWeight: 'bold'}}/>
                    {props.subTitle && <View><Label value={props.subTitle}/></View>}
                </View>
            )
        }
        {props.children}
    </View>
);

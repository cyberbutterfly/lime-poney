import {Location} from 'history';
import * as React from 'react';
import {Label} from '../label/Label';
import './Header.scss';

export interface HeaderProps {
    children?: JSX.Element|JSX.Element[]|string;
    className?: string;
    title?: string;
    hideNavigation?: boolean;
    location?: Location;
}

export const Header = (props: HeaderProps) => (
    <div className={(props.className || '') + ' Header'}>
        <a href='http://www.twoporeguys.com/' target='_blank' className='Header-logo'/>
        {props.title ? (
                <div className='Header-title'>
                    <Label value={props.title}/>
                </div>
            ) : ''
        }
        {props.children}
    </div>
);

import {Location} from 'history';
import * as React from 'react';
import {Label} from '../label/Label';
import './Header.scss';

export interface HeaderProps {
    children?: JSX.Element|JSX.Element[]|string;
    className?: string;
    logo?: string;
    title?: string;
    subTitle?: string;
    hideNavigation?: boolean;
    location?: Location;
}


export const Header = (props: HeaderProps) => (
    <div className={(props.className || '') + ' Header'}>
        <a
            href='http://www.twoporeguys.com/'
            target='_blank'
            className='Header-logo'
            style={props.logo ?
                {
                    background: 'url(' + props.logo + ')',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '0 center',
                    backgroundSize: 'contain'
                } : {}
            }
        />
        {props.title ? (
                <div className='Header-title'>
                    <Label value={props.title}/>
                    {props.subTitle ? (
                            <div className='Header-sub-title'>
                                <Label value={props.subTitle}/>
                            </div>
                        ) : ''
                    }
                </div>
            ) : ''
        }
        {props.children}
    </div>
);

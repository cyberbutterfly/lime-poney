import * as _ from 'lodash';
import * as React from 'react';
import {NavLink} from 'react-router-dom';
import {Icon} from '../icon/Icon';

import './Navigation.scss';

export interface NavigationProps {
    entries: NavigationEntry[];
    className?: string;
}

export interface NavigationEntry {
    to: string;
    label?: string;
    icon?: string;
    exact?: boolean;
}

export const Navigation = (props: NavigationProps) => (
    <div className={'Navigation' + (props.className || '')}>
        {
            _.map(props.entries,
                (entry: NavigationEntry, index: number) => (
                    <NavLink key={'nav-' + index} to={entry.to} activeClassName='active' exact={entry.exact}>
                        {entry.icon ? <Icon icon={entry.icon}/> : ''}
                        {entry.label || ''}
                    </NavLink>
                )
            )
        }
    </div>
);

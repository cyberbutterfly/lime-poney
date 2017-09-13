/*
import * as _ from 'lodash';
import * as React from 'react';
import {Icon} from '../icon/Icon';

import './ListItem.scss';

export class ListItem extends React.Component<ListItemProps, {}> {
    public constructor(props: ListItemProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    public render() {
        const {leftIcon, rightIcon, primaryText, secondaryText, hideArrow, onSelect, isSelected} = this.props;
        return (
            <li
                className={'list-item' + (isSelected ? ' selected' : '')}
                onClick={this.handleClick}
            >
                {leftIcon || ''}
                <span className='list-item-primary-text'>
                {primaryText}
                    {!_.isUndefined(secondaryText) ?
                        <span className='list-item-secondary-text'>{secondaryText}</span> :
                        ''}
                </span>
                {rightIcon || ''}
                {(_.isFunction(onSelect) && !hideArrow) ?
                    <Icon icon='keyboard_arrow_right' className='list-item-select-icon'/> :
                    ''
                }
            </li>
        );
    }

    private handleClick(event: React.MouseEvent<HTMLLIElement>) {
        if (_.isFunction(this.props.onSelect)) {
            this.props.onSelect(this.props.value, event);
        }
    }
}

export interface ListItemProps {
    value: any;
    primaryText: string|number;
    secondaryText?: string|number;
    leftIcon?: string|React.ReactElement<any>;
    rightIcon?: string|React.ReactElement<any>;
    onSelect?: (value: any, event: React.MouseEvent<HTMLLIElement>) => void;
    hideArrow?: boolean;
    isSelected?: boolean;
}

export default ListItem;
*/

// import 'onsenui/css/onsenui.css';
// import 'onsenui/css/onsen-css-components.css';
export {ListItem} from 'react-onsenui';
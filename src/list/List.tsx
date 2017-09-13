/*
import * as React from 'react';

import './List.scss';

export interface ListProps {
    isPassive?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: JSX.Element|JSX.Element[]|string|boolean[];
    isScrollable?: boolean;
}

export class List extends React.Component<ListProps, {}> {
    public constructor(props: ListProps) {
        super(props);
    }

    public render() {
        return (
            <ul
                className={
                    (this.props.className || '') +
                    (this.props.isPassive ? ' is-passive' : '') +
                    (this.props.isScrollable ? ' is-scrollable' : '') +
                    ' list'
                }
            >
                {this.props.children}
            </ul>
        );
    }
}

export default List;
*/

// import 'onsenui/css/onsenui.css';
// import 'onsenui/css/onsen-css-components.css';
export {List} from 'react-onsenui';

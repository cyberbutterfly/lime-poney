import * as React from 'react';

import './List.scss';

export interface ListProps {
    isPassive?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: JSX.Element|JSX.Element[]|string|boolean[];
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
                    (this.props.isPassive ? 'is-passive' : '') +
                    ' list'
                }
            >
                {this.props.children}
            </ul>
        );
    }
}

export default List;

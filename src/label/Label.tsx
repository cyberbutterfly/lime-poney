import * as React from 'react';

export interface LabelProps {
    value: string;
    className?: string;
    style?: React.CSSProperties;
}

export const Label = (props: LabelProps) => (
    <span className={'label ' + (props.className || '')} style={props.style}>{props.value}</span>
);

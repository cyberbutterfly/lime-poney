import * as _ from 'lodash';
import * as React from 'react';
import {MouseEvent} from 'react';
import {Label} from '../label/Label';
import {List, ListItem, ListHeader} from '../list';
import './CascadingList.scss';
import {Icon} from '../icon/Icon';
import {Checkbox} from '../form/index';

export interface CascadingListValue {
    label: string;
    value: any;
}

export interface CascadingListProps {
    className?: string;
    columns: Array<string[]|CascadingListValue[]>;
    path: any[][];
    onPathChange: (newPath: any[][]) => void;
    headers?: string[];
    multipleSelection?: boolean|'last';
}

export class CascadingList extends React.PureComponent<CascadingListProps, {}> {
    public constructor(props: CascadingListProps) {
        super(props);
    }

    public render() {
        const {className, columns, headers} = this.props;
        return (
            <div className={'cascading-list ' + (className || '')}>
                {_.map(columns,
                    (entries: string[]|CascadingListValue[], columnIndex: number) => {
                        return (
                            <List
                                key={'c-' + columnIndex}
                                dataSource={entries}
                                renderRow={this.getRowRendererAtIndex(columnIndex)}
                                renderHeader={() => headers && headers.length > columnIndex ?
                                    <ListHeader>{headers[columnIndex]}</ListHeader> : null
                                }
                            />
                        );
                    },
                )}
            </div>
        );
    }

    private getRowRendererAtIndex(columnIndex: number): (row: string|CascadingListValue, index: number) => JSX.Element {
        return (row: string|CascadingListValue, index: number): JSX.Element => {
            const isSelected = this.isEntrySelectedAtLevel(this.getRowValue(row), columnIndex);
            return (
                <ListItem
                    key={index}
                    tappable={true}
                    onClick={this.getClickHandler(columnIndex, index)}
                    modifier={
                        (columnIndex < this.props.columns.length -1 ? ' chevron' : '') +
                        (isSelected ? ' selected' : '')
                    }
                >
                    <div className={'left'}>
                        {
                            this.isMultipleSelectionAllowedAtLevel(columnIndex) ?
                                <Checkbox checked={isSelected}/> : ''
                        }
                    </div>
                    <Label value={this.getRowLabel(row)}/>
                </ListItem>
            )
        }
    }

    private getClickHandler(columIndex: number, rowIndex: number): (event: MouseEvent<ListItem>) => void {
        const {columns, path} = this.props;
        const value = this.getRowValue(columns[columIndex][rowIndex]);
        return () => {
            const newPath = _.concat(_.take(path, columIndex), [
                (columIndex === columns.length - 1 && path.length === columns.length) ?
                    _.includes(_.last(path), value) ?
                        _.reject(_.last(path), (oldValue: any) => oldValue === value) :
                        _.concat(_.last(path), value) :
                    [value],
            ]);
            this.props.onPathChange(newPath);
        };
    }

    private isEntrySelectedAtLevel(entry: string, level: number): boolean {
        return _.includes(_.get(this.props.path, level, []), entry);
    }

    private isMultipleSelectionAllowedAtLevel(level: number): boolean {
        const {columns, multipleSelection} = this.props;
        return multipleSelection === true || (multipleSelection === 'last' && level === columns.length - 1);
    }

    private getRowValue(row: string|CascadingListValue): any {
        debugger;
        return typeof row === 'object' ? row.value : row;
    }

    private getRowLabel(row: string|CascadingListValue): any {
        debugger;
        return typeof row === 'object' ? row.label : row;
    }
}

export default CascadingList;

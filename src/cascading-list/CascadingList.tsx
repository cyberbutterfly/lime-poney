import * as _ from 'lodash';
import * as React from 'react';
import {Label} from '../label';
import {List} from '../list';
import {Switch} from '../form';

import './CascadingList.scss';
import {View, TouchableHighlight, StyleSheet, GestureResponderEvent} from 'react-native';

export interface CascadingListValue {
    label?: string;
    value: any;
}

export interface CascadingListProps {
    columns: CascadingListValue[][];
    path: any[][];
    onPathChange: (newPath: any[][]) => void;
    headers?: string[];
    multipleSelection?: boolean|'last';
}

export class CascadingList extends React.PureComponent<CascadingListProps, {}> {
    public render() {
        const {columns} = this.props;
        return (
            <View style={style.wrapper}>
                {_.map(columns, this.renderCascadingListEntry)}
            </View>
        );
    }

    private renderCascadingListEntry = (entries: CascadingListValue[], columnIndex: number) => {
        const {headers} = this.props;
        const title = headers && headers.length > columnIndex ? headers[columnIndex] : null;
        return (
            <View key={'c-' + columnIndex} style={style.columnWrapper}>
                {
                    title  && (
                        <View style={style.columnTitle}>
                            <Label value={_.upperCase(title)}/>
                        </View>
                    )
                }
                <List
                    entries={entries}
                    renderItem={this.getRowRenderer(columnIndex)}
                />
            </View>
        )
    }

    private getRowRenderer = (columnIndex: number): (entry: CascadingListValue, rowIndex: number) => JSX.Element => {
        const isMultipleSelectable = this.isMultipleSelectionAllowedAtLevel(columnIndex);
        return (entry: CascadingListValue, rowIndex: number) => {
            const isSelected = this.isEntrySelectedAtLevel(entry.value, columnIndex);
            return (
                <TouchableHighlight
                    key={'r-' + columnIndex + '-' + rowIndex}
                    onPress={this.getClickHandler(columnIndex, rowIndex)}
                    underlayColor={'rgba(0, 0, 0, .25)'}
                >
                    <View
                        style={[
                            style.entry,
                            isSelected ? style.entrySelected : null,
                            isMultipleSelectable ? style.entryHorizontal : null
                        ]}
                    >
                        {isMultipleSelectable && <Switch value={isSelected} style={style.switch}/>}
                        <Label value={entry.label} style={style.entryText}/>
                    </View>
                </TouchableHighlight>
            )
        };
    }

    private getClickHandler(columIndex: number, rowIndex: number): (event: GestureResponderEvent) => void {
        const {columns, path, multipleSelection} = this.props;
        const value = this.getRowValue(columns[columIndex][rowIndex]);
        return () => {
            const commonPart = _.take(path, columIndex);
            const newPath = _.concat(commonPart, [
                multipleSelection === false || columIndex !== columns.length - 1 || path.length !== columns.length ?
                    [value] :
                    _.includes(_.last(path), value) ?
                        _.reject(_.last(path), (oldValue: any) => oldValue === value) :
                        _.concat(_.last(path), value),
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
        return typeof row === 'object' ? row.value : row;
    }
}

const style = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#dfdfdf',
        borderStyle: 'solid'
    },
    columnWrapper: {
        flex: 1
    },
    columnTitle: {
        backgroundColor: '#dfdfdf',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '75%'
    },
    entry: {
        justifyContent: 'center',
        paddingLeft: 14
    },
    entrySelected: {
        backgroundColor: '#efefef'
    },
    entryHorizontal: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    switch: {
        marginRight: 14
    },
    entryText: {
        flex: 1,
        padding: 14,
        paddingLeft: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#dfdfdf',
        borderStyle: 'solid'
    }
});

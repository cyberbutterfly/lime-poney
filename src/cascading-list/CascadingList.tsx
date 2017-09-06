import * as _ from 'lodash';
import * as React from 'react';
import {List} from '../list/List';
import {ListItem} from '../list/ListItem';
import './CascadingList.scss';

export interface CascadingListProps {
    columns: string[][];
    path: string[][];
    onPathChange: (newPath: string[][]) => void;
}

export class CascadingList extends React.PureComponent<CascadingListProps, {}> {
    public constructor(props: CascadingListProps) {
        super(props);
    }

    public render() {
        return (
            <div className='cascading-list'>
                {_.map(this.props.columns,
                    (entries: string[], columnIndex: number) => {
                        const onSelect = this.handleEntrySelectionAtLevel(columnIndex);
                        return (
                            <List key={'c-' + columnIndex} className='cascading-list-item'>
                                {_.map(entries, (entry: string, entryIndex: number) => {
                                        return (
                                            <ListItem
                                                key={'e-' + entryIndex}
                                                value={entry}
                                                primaryText={entry}
                                                onSelect={onSelect}
                                                hideArrow={true}
                                                isSelected={this.isEntrySelectedAtLevel(entry, columnIndex)}
                                            />
                                        );
                                    }
                                )}
                            </List>
                        );
                    }
                )}
            </div>
        );
    }

    private isEntrySelectedAtLevel(entry: string, level: number): boolean {
        return _.includes(_.get(this.props.path, level, []), entry);
    }

    private handleEntrySelectionAtLevel(level: number): (entry: string) => void {
        const {columns, path} = this.props;
        return (entry: string) => {
            const newPath = _.concat(_.take(path, level), [
                (level === columns.length - 1 && path.length === columns.length) ?
                    _.includes(_.last(path), entry) ?
                        _.reject(_.last(path), (value: string) => value === entry) :
                        _.concat(_.last(path), entry) :
                    [entry]
            ]);
            this.props.onPathChange(newPath);
        };
    }
}

export default CascadingList;

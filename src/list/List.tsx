import * as _ from 'lodash';
import * as React from 'react';
import {ScrollView, View} from 'react-native';
import { WithDisplayName } from '../types/index';

export interface ListProps<T> {
    entries: T[];
    renderItem: (item: T, index: number) => JSX.Element;
}

export type ListFunc = <T extends {}>(props: ListProps<T>) => JSX.Element;

const List: WithDisplayName<ListFunc> = <T extends {}>(props: ListProps<T>) => (
    <ScrollView style={{flex: 1}}>
        {
            _.map(
                props.entries,
                (entry: T, index: number) => (
                    <View key={'e-' + index}>{props.renderItem(entry, index)}</View>
                ),
            )
        }
    </ScrollView>
);

List.displayName = 'List';

export {List};

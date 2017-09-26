import * as _ from 'lodash';
import * as React from 'react';
import {ScrollView, View} from 'react-native';

export interface ListProps<T> {
    entries: T[];
    renderItem: (item: T, index: number) => JSX.Element;
}

export const List = <T extends {}>(props: ListProps<T>) => (
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

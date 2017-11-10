import * as React from 'react';
import {expect} from 'chai';
import {mount, shallow} from 'enzyme';
import * as _ from 'lodash';

import {CascadingList} from '../../src/cascading-list';

describe('CascadingList', () => {
    const columns = [
        [{ value: 'foo'}, { value: 'bar' }],
        [{ value: 'baz' }],
        [{ value: 'qux' }, { value: 'quux' }]
    ];
    const getContainerView = list => {
            const containerView = list.find('View').at(0);
            const parents = containerView.parents();
            if (
                parents.length > 0 // shallow
                && parents.first().name() !== 'CascadingList' // mount
            )
                throw new Error('Couldn\'t find top Container View');

            return containerView;
        };

    describe('when given columns', () => {
        it.only('should display one ist per column', () => {

            const cascadingList = shallow(
                <CascadingList columns={columns} path={[]} onPathChange={_.noop}/>
            );

            expect(cascadingList).to.not.be.undefined;

            const containerView = getContainerView(cascadingList);

            expect(containerView.children()).to.have.length(columns.length);

            const firstColumn = containerView.childAt(0);
            const firstList = firstColumn.find('List');

            expect(firstList.prop('entries')).to.eql(columns[0]);
        });
    });

    describe('when selecting an entry', () => {
        it('should call the callback', () => {
                let callBackCalls = 0;
                const cascadingList = mount(
                    <CascadingList
                        columns={columns}
                        path={[]}
                        onPathChange={() => {
                            callBackCalls++;
                        }}
                    />
                );

                const containerView = getContainerView(cascadingList);

                const firstText = containerView.find('List').first().find('TouchableHighlight').first();

                const { onPress } = firstText.props();

                onPress();

                expect(callBackCalls).to.equal(1);
        });

        it.only('should pass the new path to the callback', () => {
                let path: string[][] = [];
                const cascadingList = mount(
                    <CascadingList
                        columns={columns}
                        path={path}
                        onPathChange={(newPath: string[][]) => {
                            path = newPath;
                        }}
                    />
                );

                const containerView = getContainerView(cascadingList);

                const touchables = containerView.find('List TouchableHighlight');

                // we're expecting the column entries to all be in the texts, loop through click and assert
                const expected = [];
                columns.forEach(column => {
                    column.forEach(item => {
                        expected.push(item.value);
                    })
                });
                touchables.forEach((t, i) => {
                    const { onPress } = t.props();
                    onPress();
                    expect(path).to.eql([[expected[i]]])
                });
        });
    });
});

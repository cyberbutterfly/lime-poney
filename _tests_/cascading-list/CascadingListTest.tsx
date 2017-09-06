import {expect} from 'chai';
import {mount, render, shallow} from 'enzyme';
import * as _ from 'lodash';
import 'mocha';
import * as React from 'react';
import 'reflect-metadata';
import {CascadingList} from '../../src/cascading-list/CascadingList';
import {List} from '../../src/list/List';
import {ListItem} from '../../src/list/ListItem';

jest.mock('../../src/icon/SvgIconLoader', () => {});

describe('CascadingList', () => {
    describe('when given columns', () => {
        it('should display one ist per column', () => {
            const columns = [
                ['foo', 'bar'],
                ['baz'],
                ['qux', 'quux']
            ];

            const cascadingList = shallow(
                <CascadingList columns={columns} path={[]} onPathChange={_.noop}/>
            );

            expect(cascadingList).to.not.be.undefined;
            expect(cascadingList.children()).to.have.length(3);
            expect(cascadingList.childAt(0).type()).to.equal(List);
            expect(cascadingList.childAt(0).children()).to.have.length(2);
            expect(cascadingList.childAt(0).childAt(0).type()).to.equal(ListItem);
            expect(cascadingList.childAt(0).childAt(0).prop('value')).to.equal('foo');
            expect(cascadingList.childAt(0).childAt(1).type()).to.equal(ListItem);
            expect(cascadingList.childAt(0).childAt(1).prop('value')).to.equal('bar');
        });
    });

    describe('when selecting an entry', () => {
        it('should call the callback', () => {
                const columns = [
                    ['foo', 'bar'],
                    ['baz'],
                    ['qux', 'quux']
                ];
                let callBackCalls = 0;
                const cascadingList = shallow(
                    <CascadingList
                        columns={columns}
                        path={[]}
                        onPathChange={() => {
                            callBackCalls++;
                        }}
                    />
                );

                cascadingList.childAt(0).childAt(0).simulate('select');

                expect(callBackCalls).to.equal(1);
        });

        it('should pass the new path to the callback', () => {
                const columns = [
                    ['foo', 'bar'],
                    ['baz'],
                    ['qux', 'quux']
                ];
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

                cascadingList.childAt(0).childAt(0).childAt(0).simulate('click');
                expect(path).to.eql([['foo']]);
                cascadingList.setProps({path: path});
                cascadingList.childAt(1).childAt(0).childAt(0).simulate('click');
                expect(path).to.eql([['foo'], ['baz']]);
                cascadingList.setProps({path: path});
                cascadingList.childAt(2).childAt(1).childAt(0).simulate('click');
                expect(path).to.eql([['foo'], ['baz'], ['quux']]);
                cascadingList.setProps({path: path});
                cascadingList.childAt(2).childAt(0).childAt(0).simulate('click');
                expect(path).to.eql([['foo'], ['baz'], ['quux', 'qux']]);
                cascadingList.setProps({path: path});
                cascadingList.childAt(2).childAt(1).childAt(0).simulate('click');
                expect(path).to.eql([['foo'], ['baz'], ['qux']]);
                cascadingList.setProps({path: path});
                cascadingList.childAt(0).childAt(1).childAt(0).simulate('click');
                expect(path).to.eql([['bar']]);
                cascadingList.setProps({path: path});

        });
    });
});

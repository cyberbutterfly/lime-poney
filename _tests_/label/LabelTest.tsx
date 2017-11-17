import * as React from 'react';
import {shallow} from 'enzyme';
import {View, TouchableHighlight, StyleSheet, GestureResponderEvent} from 'react-native';

import {Label} from '../../src/label';

it('should render value', () => {
	const expected = 'rodrigo';

	const output = shallow(<Label value={expected} />);

	expect(output.children().first().text())
		.toEqual(expected);
});

it('should render with passed styles', () => {
	const style = StyleSheet.create({
		text: { fontSize: 56 },
	});

	const output = shallow(<Label style={style.text} value="" />);

	expect(output.prop('style')).not.toBeUndefined();
});

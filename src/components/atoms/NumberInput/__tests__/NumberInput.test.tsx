import React from 'react';
import {shallow} from 'enzyme';
import {NumberInput, NumberInputProps} from '../NumberInput';


describe('NumberInput', () => {
	const setup = (overrides?: Partial<NumberInputProps>) => {
		const callback = jest.fn();
		const wrapper = shallow(
			<NumberInput
				value={overrides?.value || '0'}
				onChange={callback}
				isDisabled={overrides?.isDisabled}
			/>
		);
		return {wrapper, callback};
	};

	it('should render component', () => {
		const {wrapper} = setup();
		expect(wrapper.exists('input')).toBe(true);
	});

	it('should render correct value', () => {
		const {wrapper} = setup();
		const event = {target: {value: '0.00'}};
		const input = wrapper.find('input');
		input.simulate('change', event);
		expect(input.props().value).toBe('0');
	});

	it('should call callback to have been called with correct args', () => {
		const {wrapper, callback} = setup();
		const event = {target: {value: '15.10'}};
		wrapper.find('input').simulate('change', event);
		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith('15.10');
	});
});
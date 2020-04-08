import React from 'react';
import {shallow} from 'enzyme';
import {Button, ButtonProps} from '../Button';

const BUTTON_SELECTOR = '[data-qa="button"]';

describe('Button.tsx', () => {
	const setup = (overrides?: Partial<ButtonProps>) => {
		const callback = jest.fn();
		const wrapper = shallow(
			<Button
				dataQa='button'
				type={overrides?.type || 'button'}
				onClick={overrides?.onClick || callback}
			>
				{'Test'}
			</Button>
		);
		return {wrapper, callback};
	};

	it('should render component', () => {
		const {wrapper} = setup();
		expect(wrapper.exists(BUTTON_SELECTOR)).toBe(true);
	});

	it('should render text', () => {
		const {wrapper} = setup();
		expect(wrapper.text()).toBe('Test');
	});

	it('should render correct button type', () => {
		const {wrapper} = setup({type: 'submit'});
		expect(wrapper.find(BUTTON_SELECTOR).prop('type')).toBe('submit');
	});

	it('should call callback', () => {
		const {wrapper, callback} = setup();
		wrapper.find(BUTTON_SELECTOR).simulate('click');
		expect(callback).toHaveBeenCalledTimes(1);
	});
});
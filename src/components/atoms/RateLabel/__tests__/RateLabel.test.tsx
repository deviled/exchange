import React from 'react';
import {shallow} from 'enzyme';
import {RateLabelTemplate} from '../RateLabel';

const RATE_SELECTOR = '[data-qa="rateLabel"]';

describe('RateLabel.tsx', () => {
	const setup = (rate: number | null) => {
		const wrapper = shallow(
			<RateLabelTemplate
				exchangeRate={rate}
				basePocketSymbol='€'
				targetPocketSymbol='$'
			/>
		);
		return {wrapper};
	};

	it('should render null if no exchange rate was found', () => {
		const {wrapper} = setup(null);
		expect(wrapper.type()).toBe(null);
	});

	it('should render component if exchange rate is present', () => {
		const {wrapper} = setup(1.123456);
		expect(wrapper.exists(RATE_SELECTOR)).toBe(true);
	});

	it('should render component with correct values', () => {
		const {wrapper} = setup(15.10340000);
		expect(wrapper.text()).toBe('1€ = 15.1034$');
	});
});
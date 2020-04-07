import React from 'react';
import {mount} from 'enzyme';
import {RateLabel} from '../RateLabel';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';

const mockStore = configureMockStore([thunk]);

describe('RateLabel', () => {
	const setup = (rates = {}) => {
		const store = mockStore({
			currency: {rates},
			pockets: {
				basePocket : {type: 'EUR', symbol: '€'},
				targetPocket: {type: 'USD', symbol: '$'}
			}
		});
		const wrapper = mount(
			<Provider store={store}>
				<RateLabel />
			</Provider>
		);
		return {wrapper};
	};

	it('should render null if no exchange rate was found', () => {
		const {wrapper} = setup();
		expect(wrapper.exists('.rate-label')).toBe(false);
	});

	it('should render component with correct values', () => {
		const {wrapper} = setup({USD: 1.123});
		const rateLabel = wrapper.find('.rate-label');
		expect(rateLabel.text()).toBe('1€ = 1.123$');
	});
});
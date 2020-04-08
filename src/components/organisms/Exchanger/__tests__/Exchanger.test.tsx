import React from 'react';
import {shallow} from 'enzyme';
import {ExchangerTemplate, ExchangerTemplateProps} from '../Exchanger';
import {mockBasePocket, mockTargetPocket} from '../__mocks__/Exchanger.mock';

const EXCHANGER = '[data-qa="exchanger"]';
const BASE_POCKET = '[dataQa="basePocket"]';
const EXCHANGE_BUTTON = '[dataQa="exchangeButton"]';
const SWAP_POCKETS_BUTTON = '[dataQa="swapPocketsButton"]';

describe('Exchanger.tsx', () => {
    const setup = (overrides?: Partial<ExchangerTemplateProps>) => {
        const wrapper = shallow(
            <ExchangerTemplate
                basePocket={mockBasePocket}
                targetPocket={mockTargetPocket}
                baseAmount={'0'}
                targetAmount={'0'}
                {...overrides}
            />
        );
        return {wrapper};
    };

    it('should render component', () => {
        const {wrapper} = setup();
        expect(wrapper.exists(EXCHANGER)).toBe(true);
    });

    it('should disable exchange button and show error if exceeds balance', () => {
        const {wrapper} = setup({baseAmount: '15.55'});
        expect(wrapper.find(BASE_POCKET).prop('isError')).toBe(true);
        expect(wrapper.find(EXCHANGE_BUTTON).prop('isDisabled')).toBe( true);
    });

    it('should disable exchange button if base amount is zero', () => {
        const {wrapper} = setup();
        expect(wrapper.find(EXCHANGE_BUTTON).prop('isDisabled')).toBe( true);
    });

    it('should enable exchange button if balance is correct', () => {
        const {wrapper} = setup({baseAmount: '10.00'});
        expect(wrapper.find(BASE_POCKET).prop('isError')).toBe(false);
        expect(wrapper.find(EXCHANGE_BUTTON).prop('isDisabled')).toBe( false);
    });

    it('should call exchange callback', () => {
        const onExchangeButtonClicked = jest.fn();
        const {wrapper} = setup({onExchangeButtonClicked});
        wrapper.find(EXCHANGE_BUTTON).simulate('click');
        expect(onExchangeButtonClicked).toHaveBeenCalledTimes(1);
    });

    it('should call swap pockets callback', () => {
        const onSwapButtonClicked = jest.fn();
        const {wrapper} = setup({onSwapButtonClicked});
        wrapper.find(SWAP_POCKETS_BUTTON).simulate('click');
        expect(onSwapButtonClicked).toHaveBeenCalledTimes(1);
    });
});
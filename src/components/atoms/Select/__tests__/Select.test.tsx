import React from 'react';
import {shallow} from 'enzyme';
import {Select, SelectProps} from '../Select';

const SELECT_INPUT = '[data-qa="selectInput"]';

const optionsMock = [
    {value: 1, label: 'test 1'},
    {value: 2, label: 'test 2'},
];

describe('Select.tsx', () => {
    const setup = (overrides?: Partial<SelectProps>) => {
        const callback = jest.fn();
        const wrapper = shallow(
            <Select
                dataQa='selectInput'
                value={overrides?.value || null}
                options={overrides?.options || optionsMock}
                onChange={callback}
            />
        );
        return {wrapper, callback};
    };

    it('should render component', () => {
        const {wrapper} = setup();
        expect(wrapper.exists(SELECT_INPUT)).toBe(true);
    });

    it('should render select options', () => {
        const {wrapper} = setup();
        optionsMock.forEach(option => {
            const optionElement = wrapper.find(`option[value=${option.value}]`);
            expect(optionElement.text()).toBe(option.label);
        });
    });

    it('should call callback', () => {
        const {wrapper, callback} = setup();
        const event = {target: {value: optionsMock[1]}};
        wrapper.find(SELECT_INPUT).simulate('change', event);
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(optionsMock[1]);
    });
});
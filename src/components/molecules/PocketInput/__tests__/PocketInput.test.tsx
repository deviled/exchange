import React from 'react';
import {shallow} from 'enzyme';
import {PocketInputTemplate, PocketTemplateProps} from '../PocketInput';
import {mockPocket} from '../__mocks__/PocketInput.mock';

const POCKET_ELEMENT = '[data-qa="pocket"]';
const POCKET_ERROR_LABEL = '[data-qa="pocketErrorLabel"]';

describe('PocketInput.tsx', () => {
    const setup = (overrides?: Partial<PocketTemplateProps>) => {
        const wrapper = shallow(
            <PocketInputTemplate
                dataQa={overrides?.dataQa}
                pocketAmount={'10'}
                pocket={mockPocket}
                options={[]}
                onInputChange={() => undefined}
                onPocketChange={() => undefined}
                {...overrides}
            />
        );
        return {wrapper};
    };

    it('should render component', () => {
        const {wrapper} = setup({dataQa: 'pocket'});
        expect(wrapper.exists(POCKET_ELEMENT)).toBe(true);
    });

    it('should not render error', () => {
        const {wrapper} = setup({isError: false});
        expect(wrapper.exists(POCKET_ERROR_LABEL)).toBe(false);
    });

    it('should render error message', () => {
        const {wrapper} = setup({isError: true, errorMessage: 'error message'});
        const errorLabel = wrapper.find(POCKET_ERROR_LABEL);
        expect(errorLabel.text()).toBe('error message');
    });
});
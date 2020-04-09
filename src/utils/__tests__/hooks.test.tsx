import React from 'react';
import {useInterval} from '../hooks'
import {mount} from 'enzyme';

const TestComponent: React.FunctionComponent<{callback: Function}> = props => {
    useInterval(
        props.callback,
        1000,
        [props.callback]
    );
    return null;
};

describe('hooks.ts', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    const setup = () => {
        const callback = jest.fn();
        const setIntervalMock = jest.fn();
        const clearIntervalMock = jest.fn();
        window.setInterval = setIntervalMock;
        window.clearInterval = clearIntervalMock;
        const wrapper = mount(<TestComponent callback={callback}/>);
        return {wrapper, callback, setIntervalMock, clearIntervalMock};
    };

    describe('useInterval', () => {
        it('should construct correct hook', () => {
            const {wrapper, callback, setIntervalMock, clearIntervalMock} = setup();
            expect(callback).toHaveBeenCalledTimes(1);
            expect(setIntervalMock).toHaveBeenCalledTimes(1);
            wrapper.unmount();
            expect(clearIntervalMock).toHaveBeenCalledTimes(1);
        })
    });
});
import {RootState} from '../../index';
import reducer, {initialState, selectCurrentExchangeRate, setCurrencyBase, setCurrencyRates} from '../currencySlice';

describe('currencySlice.ts', () => {
    it('should return the initial state', () => {
        const nextState = initialState;
        const result = reducer(undefined, {type: undefined});
        expect(result).toEqual(nextState);
    });

    describe('setCurrencyBase', () => {
        it('should set currency base', () => {
            const nextState = {...initialState, base: 'USD'};
            const result = reducer(initialState, setCurrencyBase('USD'));
            return expect(result).toEqual(nextState);
        });
    });

    describe('setCurrencyRates', () => {
        it('should set currency rates', () => {
            const nextState = {...initialState, rates: {EUR: 1.115}};
            const result = reducer(initialState, setCurrencyRates({EUR: 1.115}));
            return expect(result).toEqual(nextState);
        });
    });

    describe('selectCurrentExchangeRate', () => {
        it('should return null if targetPocket is not defined', () => {
            const rootState = {pockets: {}, currency: {...initialState}} as RootState;
            expect(selectCurrentExchangeRate(rootState)).toBe(null);
        });
    });
});

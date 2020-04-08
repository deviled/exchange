import thunk, {ThunkDispatch} from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import {AnyAction} from 'redux';
import {CurrencyState} from '../types';
import reducer, {fetchRatesBy, initialState, setCurrencyBase, setCurrencyRates} from '../currencySlice';

type AppDispatch = ThunkDispatch<CurrencyState, void, AnyAction>;

const mockStore = configureMockStore<CurrencyState, AppDispatch>([thunk]);
const mockResult = {base: 'EUR', rates: {USD: 1.23}};
const mockCurrencyRatesUpdated = {type: 'CURRENCY_RATES_UPDATED'};

jest.mock('../../../utils/api.ts', () => ({
    fetchRatesBy: jest.fn(() => Promise.resolve(mockResult)),
}));

jest.mock('../../exchange/exchangeSlice.ts', () => ({
    currencyRatesUpdated: jest.fn(() => mockCurrencyRatesUpdated)
}));

describe('currencySlice.ts', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should return the initial state', () => {
        const nextState = initialState;
        const result = reducer(undefined, {type: undefined});
        expect(result).toEqual(nextState);
    });

    describe('fetchRatesBy', () => {
        it('should dispatch correct actions when rates are fetches', async () => {
            const store = mockStore(initialState);
            await store.dispatch(fetchRatesBy('EUR'));
            const expectedActions =  [
                setCurrencyBase(mockResult.base),
                setCurrencyRates(mockResult.rates),
                mockCurrencyRatesUpdated
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
import {fetchRatesBy, initialState, setCurrencyBase, setCurrencyRates} from '../currencySlice';
import configureMockStore from 'redux-mock-store';
import {CurrencyState} from '../types';
import thunk, {ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';

type AppDispatch = ThunkDispatch<CurrencyState, void, AnyAction>;

const api = require('../../../utils/api');
const exchangeSlice = require('../../exchange/exchangeSlice.ts');
const mockStore = configureMockStore<CurrencyState, AppDispatch>([thunk]);

describe('Currency actions', () => {
    describe('fetchRatesBy', () => {
        it('should dispatch correct actions when rates are fetches', async () => {
            const mockResult = {base: 'EUR', rates: {USD: 1.23}};
            const currencyRatesUpdatedAction = {type: 'CURRENCY_RATES_UPDATED'};
            const store = mockStore(initialState);
            api.fetchRatesBy = jest.fn().mockReturnValueOnce(Promise.resolve(mockResult));
            exchangeSlice.currencyRatesUpdated = jest.fn().mockReturnValueOnce(currencyRatesUpdatedAction);
            await store.dispatch(fetchRatesBy('EUR'));
            const expectedActions =  [
                setCurrencyBase(mockResult.base),
                setCurrencyRates(mockResult.rates),
                currencyRatesUpdatedAction,
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('should not dispatch any actions if request fails', async () => {
            api.fetchRatesBy = jest.fn().mockReturnValueOnce(Promise.reject());
            const store = mockStore();
            await store.dispatch(fetchRatesBy());
            expect(store.getActions()).toEqual([]);
        });
    });
});

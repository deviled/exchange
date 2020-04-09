import {mockPockets, rootState} from '../../__mocks__/rootState.mock';
import {
    basePocketChanged,
    fetchPockets,
    setAllPockets,
    setBasePocket,
    setIsFetching,
    setTargetPocket,
    swapPockets,
    targetPocketChanged,
    updateBasePocketBalance,
    updatePocket,
    updateTargetPocketBalance
} from '../pocketsSlice';
import {Pocket} from '../types';
import thunk, {ThunkDispatch} from 'redux-thunk';
import {RootState} from '../../index';
import {AnyAction} from 'redux';
import configureMockStore from 'redux-mock-store';

type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

const api = require('../../../utils/api');
const exchangeSlice = require('../../exchange/exchangeSlice');
const currencySlice = require('../../currency/currencySlice');
const mockStore = configureMockStore<RootState, AppDispatch>([thunk]);

const fetchRatesBy = (rate: string) => ({type: 'FETCH_RATES', rate});
const setBaseAmount = (amount: string) => ({type: 'SET_BASE_AMOUNT', amount});
const setTargetAmount = (amount: string) => ({type: 'SET_TARGET_AMOUNT', amount});
const setTargetInputEdited = (value: boolean) =>  ({type: 'SET_TARGET_INPUT_EDITED', value});

describe('Pockets actions', () => {
    describe('fetchPockets', () => {
        it('should dispatch correct action when pockets are fetched', async () => {
            api.fetchPockets = jest.fn().mockReturnValueOnce(Promise.resolve(mockPockets));
            const store = mockStore(rootState);
            await store.dispatch(fetchPockets());
            const expectedActions =  [
                setIsFetching(true),
                setAllPockets(mockPockets),
                setBasePocket(mockPockets.find(p => p.isMainPocket)),
                setTargetPocket(mockPockets.find(p => !p.isMainPocket)),
                setIsFetching(false),
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('should dispatch only loading action if request fails', async () => {
            api.fetchPockets = jest.fn().mockReturnValueOnce(Promise.reject());
            const store = mockStore(rootState);
            await store.dispatch(fetchPockets());
            const expectedActions =  [
                setIsFetching(true),
                setIsFetching(false),
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('updateBasePocketBalance', () => {
        it('should update base pocket balance', async () => {
            const {basePocket} = rootState.pockets;
            const store = mockStore(rootState);
            await store.dispatch(updateBasePocketBalance(1.13));
            const expectedActions = [
                updatePocket({...basePocket, balance: '1.13'} as Pocket),
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('should not dispatch any actions if no base pocket', async () => {
            const store = mockStore({
                ...rootState,
                pockets: {...rootState.pockets, basePocket: undefined}
            });
            await store.dispatch(updateBasePocketBalance(1000));
            expect(store.getActions()).toEqual([]);
        });
    });

    describe('updateTargetPocketBalance', () => {
        it('should update target pocket balance', async () => {
            const {targetPocket} = rootState.pockets;
            const store = mockStore(rootState);
            await store.dispatch(updateTargetPocketBalance(180.01));
            const expectedActions = [
                updatePocket({...targetPocket, balance: '180.01'} as Pocket),
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('should not dispatch any actions if no target pocket', async () => {
            const store = mockStore({
                ...rootState,
                pockets: {...rootState.pockets, targetPocket: undefined}
            });
            await store.dispatch(updateTargetPocketBalance(1000));
            expect(store.getActions()).toEqual([]);
        });
    });

    describe('swapPockets', () => {
        const setupSwapPockets = () => {
            const store = mockStore(rootState);
            currencySlice.fetchRatesBy = jest.fn().mockImplementationOnce(fetchRatesBy);
            exchangeSlice.setBaseAmount = jest.fn().mockImplementationOnce(setBaseAmount);
            exchangeSlice.setTargetAmount = jest.fn().mockImplementationOnce(setTargetAmount);
            exchangeSlice.setTargetInputEdited = jest.fn().mockImplementationOnce(setTargetInputEdited);
            const expectedActions = [
                fetchRatesBy('USD'),
                setBasePocket(rootState.pockets.targetPocket),
                setBaseAmount(rootState.exchange.targetAmount),
                setTargetPocket(rootState.pockets.basePocket),
                setTargetAmount(rootState.exchange.baseAmount),
                setTargetInputEdited(!rootState.exchange.isTargetInputEdited),
            ];
            return {store, expectedActions};
        };

        it('should swap base pocket with target pocket', async () => {
            const {store, expectedActions} = setupSwapPockets();
            await store.dispatch(swapPockets());
            expect(store.getActions()).toEqual(expectedActions);
        });

        describe('basePocketChanged', () => {
            it('should change pocket if its not target pocket', async () => {
                currencySlice.fetchRatesBy = jest.fn().mockImplementationOnce(fetchRatesBy);
                exchangeSlice.baseAmountUpdated = jest.fn().mockImplementationOnce(setBaseAmount);
                const store = mockStore(rootState);
                await store.dispatch(basePocketChanged('3'));
                const expectedActions = [
                    fetchRatesBy('GBP'),
                    setBasePocket({...rootState.pockets.all[2]}),
                    setBaseAmount(rootState.exchange.baseAmount),
                ];
                expect(store.getActions()).toEqual(expectedActions);
            });

            it('should dispatch swapPockets', async () => {
                const {store, expectedActions} = setupSwapPockets();
                await store.dispatch(basePocketChanged('2'));
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

        describe('targetPocketChanged', () => {
            it('should change pocket if its not base pocket', async () => {
                exchangeSlice.baseAmountUpdated = jest.fn().mockImplementationOnce(setBaseAmount);
                const store = mockStore(rootState);
                await store.dispatch(targetPocketChanged('3'));
                const expectedActions = [
                    setTargetPocket({...rootState.pockets.all[2]}),
                    setBaseAmount(rootState.exchange.baseAmount),
                ];
                expect(store.getActions()).toEqual(expectedActions);
            });

            it('should dispatch swapPockets', async () => {
                const {store, expectedActions} = setupSwapPockets();
                await store.dispatch(targetPocketChanged('1'));
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

    });
});
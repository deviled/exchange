import {AnyAction} from 'redux';
import thunk, {ThunkDispatch} from 'redux-thunk';
import {rootState} from '../../__mocks__/rootState.mock';
import configureMockStore from 'redux-mock-store';
import {RootState} from '../../index';
import {
    baseAmountUpdated,
    calcBaseAmount,
    calcTargetAmount,
    currencyRatesUpdated,
    exchange,
    setBaseAmount,
    setTargetAmount,
    setTargetInputEdited,
    targetAmountUpdated
} from '../exchangeSlice';

type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

const pocketsSlice = require('../../pockets/pocketsSlice');
const mockStore = configureMockStore<RootState, AppDispatch>([thunk]);
const updateBasePocketBalance = (balance: number) => ({type: 'UPDATE_BASE_POCKET', balance});
const updateTargetPocketBalance = (balance: number) => ({type: 'UPDATE_TARGET_POCKET', balance});
const getCurrencyRate = (type: string) => rootState.currency?.rates && rootState.currency.rates[type];

describe('Exchange actions', () => {
    const setup = ({pockets, exchange}: any) => {
        const state = {
            ...rootState,
            pockets: {...rootState.pockets, ...pockets},
            exchange: {...rootState.exchange, ...exchange},
        };
        return {store: mockStore(state)};
    };

    describe('exchange', () => {
        const setupExchange = (baseAmount: string, targetAmount: string) => {
            pocketsSlice.updateBasePocketBalance = jest.fn().mockImplementationOnce(updateBasePocketBalance);
            pocketsSlice.updateTargetPocketBalance = jest.fn().mockImplementationOnce(updateTargetPocketBalance);
            const {store} = setup({exchange: {baseAmount, targetAmount}});
            return {store};
        };

        it('should not dispatch any actions if basePocket and target', async () => {
            const {store} = setup({pockets: {basePocket: undefined}});
            await store.dispatch(exchange());
            expect(store.getActions()).toEqual([]);
        });

        it('should not dispatch any actions if targetPocket is not defined', async () => {
            const {store} = setup({pockets: {targetPocket: undefined}});
            await store.dispatch(exchange());
            expect(store.getActions()).toEqual([]);
        });

        it('should not dispatch any actions if base amount is higher than base balance', async () => {
            const {store} = setup({exchange: {baseAmount: '15.09'}});
            await store.dispatch(exchange());
            expect(store.getActions()).toEqual([]);
        });

        it('should dispatch correct actions if all conditions are met', async () => {
            const {store} = setupExchange('14', '17.56');
            await store.dispatch(exchange());
            const expectedActions = [
                updateBasePocketBalance(1.08),
                updateTargetPocketBalance(87.56),
                setBaseAmount('0'),
                setTargetAmount('0'),
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('baseAmountUpdated', () => {
        it('should dispatch correct actions', async () => {
            const amount = '15.00';
            const rate = getCurrencyRate('USD');
            const store = mockStore({...rootState});
            await store.dispatch(baseAmountUpdated(amount));
            const expectedActions = [
                setTargetInputEdited(false),
                setBaseAmount(amount),
                calcTargetAmount({amount, rate})
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('targetAmountUpdated', () => {
        it('should dispatch correct actions', async () => {
            const amount = '0';
            const rate = getCurrencyRate('USD');
            const store = mockStore({...rootState});
            await store.dispatch(targetAmountUpdated(amount));
            const expectedActions = [
                setTargetInputEdited(true),
                setTargetAmount(amount),
                calcBaseAmount({amount, rate})
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('currencyRatesUpdated', () => {
        it('should update base amount', async () => {
            const amount = '15.00';
            const rate = getCurrencyRate('USD');
            const {store} = setup({exchange: {baseAmount: amount}});
            await store.dispatch(currencyRatesUpdated());
            const expectedActions = [
                setTargetInputEdited(false),
                setBaseAmount(amount),
                calcTargetAmount({amount, rate})
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('should update target amount', async () => {
            const amount = '100';
            const rate = getCurrencyRate('USD');
            const {store} = setup({exchange: {
                    targetAmount: amount,
                    isTargetInputEdited: true,
                }});
            await store.dispatch(currencyRatesUpdated());
            const expectedActions = [
                setTargetInputEdited(true),
                setTargetAmount(amount),
                calcBaseAmount({amount, rate})
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});

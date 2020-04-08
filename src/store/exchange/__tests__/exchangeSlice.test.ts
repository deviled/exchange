import {AnyAction} from 'redux';
import thunk, {ThunkDispatch} from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import {updatePocket} from '../../pockets/pocketsSlice';
import {RootState} from '../../index';
import {mockBasePocket, mockTargetPocket, RATE, rootState} from '../__mocks__/exchangeSlice.mock';
import {PocketsState} from '../../pockets/types';
import {ExchangeState} from '../types';
import reducer, {
    baseAmountUpdated,
    calcBaseAmount,
    calcTargetAmount,
    currencyRatesUpdated,
    exchange,
    initialState,
    setBaseAmount,
    setTargetAmount,
    setTargetInputEdited,
    targetAmountUpdated,
} from '../exchangeSlice';

type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

const mockStore = configureMockStore<RootState, AppDispatch>([thunk]);

describe('exchangeSlice.ts', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    const setup = (pockets?: Partial<PocketsState>, exchange?: Partial<ExchangeState>) => {
        const state = {
            ...rootState,
            pockets: {...rootState.pockets, ...pockets},
            exchange: {...rootState.exchange, ...exchange},
        };
        return {store: mockStore(state)};
    };

    it('should return the initial state', () => {
        const nextState = initialState;
        const result = reducer(undefined, {type: undefined});
        expect(result).toEqual(nextState);
    });

    describe('exchange', () => {
        it('should not dispatch any actions if basePocket and target', async () => {
            const {store} = setup({basePocket: undefined});
            await store.dispatch(exchange());
            expect(store.getActions()).toEqual([]);
        });

        it('should not dispatch any actions if targetPocket is not defined', async () => {
            const {store} = setup({targetPocket: undefined});
            await store.dispatch(exchange());
            expect(store.getActions()).toEqual([]);
        });

        it('should not dispatch any actions if base amount is higher than base balance', async () => {
            const {store} = setup(undefined, {baseAmount: '15.09'});
            await store.dispatch(exchange());
            expect(store.getActions()).toEqual([]);
        });

        it('should dispatch correct actions if all conditions are met', async () => {
            const {store} = setup(undefined, {
                baseAmount: '14',
                targetAmount: '17.56'
            });
            await store.dispatch(exchange());
            const expectedActions = [
                updatePocket({...mockBasePocket, balance: '1.08'}),
                updatePocket({...mockTargetPocket, balance: '87.56'}),
                setBaseAmount('0'),
                setTargetAmount('0'),
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('baseAmountUpdated', () => {
        it('should dispatch correct actions', async () => {
            const amount = '15.00';
            const store = mockStore({...rootState});
            await store.dispatch(baseAmountUpdated(amount));
            const expectedActions = [
                setTargetInputEdited(false),
                setBaseAmount(amount),
                calcTargetAmount({amount, rate: RATE})
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('targetAmountUpdated', () => {
        it('should dispatch correct actions', async () => {
            const amount = '0';
            const store = mockStore({...rootState});
            await store.dispatch(targetAmountUpdated(amount));
            const expectedActions = [
                setTargetInputEdited(true),
                setTargetAmount(amount),
                calcBaseAmount({amount, rate: RATE})
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('currencyRatesUpdated', () => {
        it('should update base amount', async () => {
            const amount = '15.00';
            const {store} = setup(undefined, {baseAmount: amount});
            await store.dispatch(currencyRatesUpdated());
            const expectedActions = [
                setTargetInputEdited(false),
                setBaseAmount(amount),
                calcTargetAmount({amount, rate: RATE})
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('should update target amount', async () => {
            const amount = '100';
            const {store} = setup(undefined, {
                targetAmount: amount,
                isTargetInputEdited: true,
            });
            await store.dispatch(currencyRatesUpdated());
            const expectedActions = [
                setTargetInputEdited(true),
                setTargetAmount(amount),
                calcBaseAmount({amount, rate: RATE})
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('setBaseAmount', () => {
        it('should set base amount if zero', () => {
            const result = reducer(initialState, setBaseAmount('0'));
            return expect(result).toEqual(initialState);
        });

        it('should set base amount if greater than zero', () => {
            const nextState = {...initialState, baseAmount: '15.041'};
            const result = reducer(initialState, setBaseAmount('15.041'));
            return expect(result).toEqual(nextState);
        });

        it('should not set base amount if negative', () => {
            const result = reducer(initialState, setBaseAmount('-0.001'));
            return expect(result).toEqual(initialState);
        });
    });

    describe('setTargetAmount', () => {
        it('should set target amount if zero', () => {
            const result = reducer(initialState, setTargetAmount('0'));
            return expect(result).toEqual(initialState);
        });

        it('should set target amount if greater than zero', () => {
            const nextState = {...initialState, targetAmount: '17'};
            const result = reducer(initialState, setTargetAmount('17'));
            return expect(result).toEqual(nextState);
        });

        it('should not set target amount if negative', () => {
            const result = reducer(initialState, setTargetAmount('-0.001'));
            return expect(result).toEqual(initialState);
        });
    });

    describe('calcBaseAmount', () => {
        it('should calc correct base amount if amount is zero', () => {
            const payload = {amount: '0', rate: 5.15};
            const result = reducer(initialState, calcBaseAmount(payload));
            return expect(result).toEqual(initialState);
        });

        it('should calc correct base amount if rate is zero', () => {
            const payload = {amount: '14', rate: 0};
            const result = reducer(initialState, calcBaseAmount(payload));
            return expect(result).toEqual(initialState);
        });

        it('should calc correct base amount if amount is negative', () => {
            const payload = {amount: '-7.15', rate: 5};
            const result = reducer(initialState, calcBaseAmount(payload));
            return expect(result).toEqual(initialState);
        });

        it('should calc correct base amount if rate is negative', () => {
            const payload = {amount: '10000.10', rate: -1};
            const result = reducer(initialState, calcBaseAmount(payload));
            return expect(result).toEqual(initialState);
        });

        it('should calc correct base amount if amount and rate are present', () => {
            const payload = {amount: '10.101', rate: 2};
            const nextState = {...initialState, baseAmount: '5.05'};
            const result = reducer(initialState, calcBaseAmount(payload));
            return expect(result).toEqual(nextState);
        });
    });

    describe('calcTargetAmount', () => {
        it('should calc correct target amount if amount is zero', () => {
            const payload = {amount: '0', rate: 5.15};
            const result = reducer(initialState, calcTargetAmount(payload));
            return expect(result).toEqual(initialState);
        });

        it('should calc correct target amount if rate is zero', () => {
            const payload = {amount: '14', rate: 0};
            const result = reducer(initialState, calcTargetAmount(payload));
            return expect(result).toEqual(initialState);
        });

        it('should calc correct target amount if amount is negative', () => {
            const payload = {amount: '-7.15', rate: 5};
            const result = reducer(initialState, calcTargetAmount(payload));
            return expect(result).toEqual(initialState);
        });

        it('should calc correct target amount if rate is negative', () => {
            const payload = {amount: '10000.10', rate: -1};
            const result = reducer(initialState, calcTargetAmount(payload));
            return expect(result).toEqual(initialState);
        });

        it('should calc correct target amount if amount and rate are present', () => {
            const payload = {amount: '10.101', rate: 2};
            const nextState = {...initialState, targetAmount: '20.20'};
            const result = reducer(initialState, calcTargetAmount(payload));
            return expect(result).toEqual(nextState);
        });
    });
});
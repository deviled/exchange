import {initialState} from '../exchangeSlice';
import {RootState} from '../../index';

export const RATE = 1.10;

export const mockBasePocket = {
    id: 1,
    type: 'EUR',
    balance: '15.08',
    symbol: '€',
};

export const mockTargetPocket = {
    id: 3,
    type: 'USD',
    balance: '70.00',
    symbol: '$'
};

export const rootState: RootState = {
    currency: {
        base: 'EUR',
        rates: {
            USD: RATE,
        },
    },
    pockets: {
        basePocket: mockBasePocket,
        targetPocket: mockTargetPocket,
        all: [],
        isFetching: false,
    },
    exchange: initialState,
};
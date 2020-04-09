import {RootState} from '../index';
import {Pocket} from '../pockets/types';

export const mockPockets: Pocket[] = [
    {
        id: 1,
        type: 'EUR',
        balance: '15.08',
        symbol: '€',
    },
    {
        id: 2,
        type: 'USD',
        balance: '70.00',
        symbol: '$'
    },
    {
        id: 3,
        type: 'GBP',
        balance: '0.00',
        symbol: '£'
    }
];

export const rootState: RootState = {
    currency: {
        base: 'EUR',
        rates: {
            USD: 1.10,
            GBP: 1.15,
        },
    },
    pockets: {
        all: [...mockPockets],
        basePocket: {...mockPockets[0]},
        targetPocket: {...mockPockets[1]},
        isFetching: false,
    },
    exchange: {
        baseAmount: '0',
        targetAmount: '0',
        isTargetInputEdited: false,
    },
};
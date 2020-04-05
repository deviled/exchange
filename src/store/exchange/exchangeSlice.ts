import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppDispatch, RootState} from '../index';
import {ExchangeState} from './types';
import * as api from '../../utils/api';
import {Pocket} from '../pockets/types';

const initialState: ExchangeState = {
	fromAmount: '0',
	toAmount: '0',
	base: '',
	rates: {},
	fetchingError: null,
	isFetching: false,
};

const exchangeSlice = createSlice({
	name: 'exchange',
	initialState,
	reducers: {
		setRates: (state, action: PayloadAction<ExchangeState['rates']>) => {
			state.rates = action.payload;
		},
		setBase: (state, action: PayloadAction<string>) => {
			state.base = action.payload;
		},
		setFromAmount: (state, action: PayloadAction<string>) => {
			state.fromAmount = action.payload;
		},
		setToAmount: (state, action: PayloadAction<string>) => {
			state.toAmount = action.payload;
		},
		setIsFetching: (state, action: PayloadAction<boolean>) => {
			state.isFetching = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.fetchingError = action.payload;
		}
	}
});

export const {setRates, setBase, setFromAmount, setToAmount, setError, setIsFetching} = exchangeSlice.actions;

export const fetchRates = (base: ExchangeState['base']) => {
	return async (dispatch: AppDispatch) => {
		dispatch(setIsFetching(true));
		try {
			const result = await api.fetchRates(base);
			if (result) {
				dispatch(setBase(result.base));
				dispatch(setRates(result.rates));
			}
		} catch (error) {
			dispatch(setError('Error while fetching currency rates.'));
		}
		dispatch(setIsFetching(false));
	};
};

export const convertTo = (type: Pocket['type']) => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		const {isFetching, fromAmount, rates, fetchingError} = getState().exchange;
		if (!isFetching && !fetchingError) {
			const rate = rates[type];
			const newAmount = parseFloat(fromAmount) * rate;
			if (rate && newAmount >= 0) {
				dispatch(setToAmount(newAmount.toFixed(2)));
			}
		}
	};
};

export const convertFrom = (type: Pocket['type']) => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		const {isFetching, toAmount, rates, fetchingError} = getState().exchange;
		if (!isFetching && !fetchingError) {
			const rate = rates[type];
			const newAmount = parseFloat(toAmount) / rate;
			if (rate && newAmount >= 0) {
				dispatch(setFromAmount(newAmount.toFixed(2)));
			}
		}
	};
};

export default exchangeSlice.reducer;
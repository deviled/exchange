import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppDispatch, RootState} from '../index';
import {ExchangeState} from './types';
import {setIsLoading} from '../loader/loaderSlice';
import * as api from '../../utils/api';
import {Pocket} from '../pockets/types';

const initialState: ExchangeState = {
	fromAmount: '0',
	toAmount: '0',
	base: '',
	rates: {},
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
	}
});

export const {setRates, setBase, setFromAmount, setToAmount} = exchangeSlice.actions;

export const fetchRates = (base: ExchangeState['base']) => {
	return async (dispatch: AppDispatch) => {
		dispatch(setIsLoading(true));
		try {
			const result = await api.fetchRates(base);
			if (result) {
				dispatch(setBase(result.base));
				dispatch(setRates(result.rates));
			}
		} catch (error) {
			console.error('Error while fetching currency rates.');
		}
		dispatch(setIsLoading(false));
	};
};

export const convertTo = (type: Pocket['type'], fromAmount: number) => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		if (fromAmount >= 0) {
			const rate = getState().exchange.rates[type];
			if (rate) {
				dispatch(setToAmount((fromAmount * rate).toFixed(2)));
			}
		}
	};
};

export const convertFrom = (type: Pocket['type'], toAmount: number) => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		if (toAmount >= 0) {
			const rate = getState().exchange.rates[type];
			if (rate) {
				dispatch(setFromAmount((toAmount / rate).toFixed(2)));
			}
		}
	};
};

export default exchangeSlice.reducer;
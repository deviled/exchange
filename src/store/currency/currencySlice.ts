import to from 'await-to-js';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppDispatch, RootState} from '../index';
import {CurrencyState} from './types';
import * as api from '../../utils/api';
import {currencyRatesUpdated} from '../exchange/exchangeSlice';

export const initialState: CurrencyState = {
	base: '',
	rates: null,
};

const currencySlice = createSlice({
	name: 'currency',
	initialState,
	reducers: {
		setCurrencyBase: (state, action: PayloadAction<string>) => {
			state.base = action.payload;
		},
		setCurrencyRates: (state, action: PayloadAction<CurrencyState['rates']>) => {
			state.rates = action.payload;
		},
	}
});

export const {setCurrencyBase, setCurrencyRates} = currencySlice.actions;

export const selectCurrentExchangeRate = (state: RootState): number | null => {
	if (state.pockets.targetPocket && state.currency.rates) {
		const type = state.pockets.targetPocket.type;
		return state.currency.rates[type];
	}
	return null;
};

export const fetchRatesBy = (base: CurrencyState['base'] = '') => {
	return async (dispatch: AppDispatch) => {
		const [err, result] = await to(api.fetchRatesBy(base));
		if (result) {
			dispatch(setCurrencyBase(result.base));
			dispatch(setCurrencyRates(result.rates));
			dispatch(currencyRatesUpdated());
		}
		return err;
	};
};

export default currencySlice.reducer;
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppDispatch, RootState} from '../index';
import {ExchangeState} from './types';
import {Pocket} from '../pockets/types';

const initialState: ExchangeState = {
	baseAmount: '0',
	targetAmount: '0',
	exchangeError: null,
};

const exchangeSlice = createSlice({
	name: 'exchange',
	initialState,
	reducers: {
		setBaseAmount: (state, action: PayloadAction<string>) => {
			state.baseAmount = action.payload;
		},
		setTargetAmount: (state, action: PayloadAction<string>) => {
			state.targetAmount = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.exchangeError = action.payload;
		}
	}
});

export const {setBaseAmount, setTargetAmount, setError} = exchangeSlice.actions;

export const convertToTarget = (type: Pocket['type']) => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		const {fetchingError, current} = getState().rates;
		const {baseAmount} = getState().exchange;
		if (!fetchingError) {
			const rate = current[type];
			const newAmount = parseFloat(baseAmount) * rate;
			if (rate && newAmount >= 0) {
				dispatch(setTargetAmount(newAmount.toFixed(2)));
			}
		}
	};
};

export const convertToBase = (type: Pocket['type']) => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		const {fetchingError, current} = getState().rates;
		const {targetAmount} = getState().exchange;
		if (!fetchingError) {
			const rate = current[type];
			const newAmount = parseFloat(targetAmount) / rate;
			if (rate && newAmount >= 0) {
				dispatch(setBaseAmount(newAmount.toFixed(2)));
			}
		}
	};
};

export default exchangeSlice.reducer;
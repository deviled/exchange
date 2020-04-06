import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppDispatch, RootState} from '../index';
import {CalcAmount, ExchangeState} from './types';
import {selectCurrentExchangeRate} from '../currency/currencySlice';

const initialState: ExchangeState = {
	baseAmount: '0',
	targetAmount: '0',
	isTargetInputEdited: false,
};

const exchangeSlice = createSlice({
	name: 'exchange',
	initialState,
	reducers: {
		setTargetInputEdited: (state, action: PayloadAction<boolean>) => {
			state.isTargetInputEdited = action.payload;
		},
		setBaseAmount: (state, action: PayloadAction<ExchangeState['baseAmount']>) => {
			if (parseFloat(state.baseAmount) >= 0) {
				state.baseAmount = action.payload;
			}
		},
		setTargetAmount: (state, action: PayloadAction<ExchangeState['targetAmount']>) => {
			if (parseFloat(state.targetAmount) >= 0) {
				state.targetAmount = action.payload;
			}
		},
		calcBaseAmount: (state, action: PayloadAction<CalcAmount>) => {
			if (action.payload.rate) {
				const amount = parseFloat(action.payload.amount);
				state.baseAmount = (amount / action.payload.rate).toString();
			}
		},
		calcTargetAmount: (state, action: PayloadAction<CalcAmount>) => {
			if (action.payload.rate) {
				const amount = parseFloat(action.payload.amount);
				state.targetAmount = (amount * action.payload.rate).toString();
			}
		}
	},
});

export const {setTargetInputEdited, setBaseAmount, setTargetAmount, calcBaseAmount, calcTargetAmount} = exchangeSlice.actions;

export const baseAmountUpdated = (amount: string) => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		const rate = selectCurrentExchangeRate(getState());
		dispatch(setTargetInputEdited(false));
		dispatch(setBaseAmount(amount));
		dispatch(calcTargetAmount({amount, rate}));
	};
};

export const targetAmountUpdated = (amount: string) => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		const rate = selectCurrentExchangeRate(getState());
		dispatch(setTargetInputEdited(true));
		dispatch(setTargetAmount(amount));
		dispatch(calcBaseAmount({amount, rate}));
	};
};

export const currencyRatesUpdated = () => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		const {baseAmount, targetAmount, isTargetInputEdited} = getState().exchange;
		if (isTargetInputEdited) {
			return dispatch(targetAmountUpdated(targetAmount));
		}
		return dispatch(baseAmountUpdated(baseAmount));
	};
};

export default exchangeSlice.reducer;
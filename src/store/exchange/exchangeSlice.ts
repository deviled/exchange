import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppDispatch, RootState} from '../index';
import {CalcAmount, ExchangeState} from './types';
import {selectCurrentExchangeRate} from '../currency/currencySlice';
import {updateBasePocketBalance, updateTargetPocketBalance} from '../pockets/pocketsSlice';

export const initialState: ExchangeState = {
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
			if (parseFloat(action.payload) >= 0) {
				state.baseAmount = action.payload;
			}
		},
		setTargetAmount: (state, action: PayloadAction<ExchangeState['targetAmount']>) => {
			if (parseFloat(action.payload) >= 0) {
				state.targetAmount = action.payload;
			}
		},
		calcBaseAmount: (state, {payload}: PayloadAction<CalcAmount>) => {
			const amount = parseFloat(payload.amount);
			if (amount > 0 && payload.rate && payload.rate > 0) {
				state.baseAmount = (amount / payload.rate).toFixed(2);
			} else {
				state.baseAmount = '0';
			}
		},
		calcTargetAmount: (state, {payload}: PayloadAction<CalcAmount>) => {
			const amount = parseFloat(payload.amount);
			if (amount > 0 && payload.rate && payload.rate > 0) {
				state.targetAmount = (amount * payload.rate).toFixed(2);
			} else {
				state.targetAmount = '0';
			}
		}
	},
});

export const {setTargetInputEdited, setBaseAmount, setTargetAmount, calcBaseAmount, calcTargetAmount} = exchangeSlice.actions;

export const exchange = () => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		const {basePocket,  targetPocket} = getState().pockets;
		if (basePocket && targetPocket) {
			const baseAmount = parseFloat(getState().exchange.baseAmount);
			const targetAmount = parseFloat(getState().exchange.targetAmount);
			const baseBalance = parseFloat(basePocket.balance);
			const targetBalance = parseFloat(targetPocket.balance);
			if (baseAmount <= baseBalance) {
				dispatch(updateBasePocketBalance(baseBalance - baseAmount));
				dispatch(updateTargetPocketBalance(targetBalance + targetAmount));
				dispatch(setBaseAmount('0'));
				dispatch(setTargetAmount('0'));
			}
		}
	};
};

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
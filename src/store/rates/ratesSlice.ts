import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppDispatch} from '../index';
import * as api from '../../utils/api';
import {RatesState} from './types';

const initialState: RatesState = {
	current: {},
	base: '',
	fetchingError: null,
};

const ratesSlice = createSlice({
	name: 'exchange',
	initialState,
	reducers: {
		setCurrent: (state, action: PayloadAction<RatesState['current']>) => {
			state.current = action.payload;
		},
		setBase: (state, action: PayloadAction<string>) => {
			state.base = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.fetchingError = action.payload;
		}
	}
});

export const {setCurrent, setBase, setError} = ratesSlice.actions;

export const fetchRates = (base: RatesState['base']) => {
	return async (dispatch: AppDispatch) => {
		try {
			const result = await api.fetchRates(base);
			if (result) {
				dispatch(setBase(result.base));
				dispatch(setCurrent(result.rates));
			}
		} catch (error) {
			dispatch(setError('Error while fetching currency rates.'));
		}
	};
};

export default ratesSlice.reducer;
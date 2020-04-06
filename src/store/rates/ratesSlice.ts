import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppDispatch} from '../index';
import * as api from '../../utils/api';
import {RatesState} from './types';

const initialState: RatesState = {
	current: {},
	base: '',
	isFetching: false,
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
		setIsFetching: (state, action: PayloadAction<boolean>) => {
			state.isFetching = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.fetchingError = action.payload;
		}
	}
});

export const {setCurrent, setBase, setIsFetching, setError} = ratesSlice.actions;

export const fetchRates = (base: RatesState['base']) => {
	return async (dispatch: AppDispatch) => {
		dispatch(setIsFetching(true));
		try {
			const result = await api.fetchRates(base);
			if (result) {
				dispatch(setBase(result.base));
				dispatch(setCurrent(result.rates));
			}
		} catch (error) {
			dispatch(setError('Error while fetching currency rates.'));
		}
		dispatch(setIsFetching(false));
	};
};

export default ratesSlice.reducer;
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Pocket, PocketsState} from './types';
import {AppDispatch} from '../index';
import * as api from '../../utils/api';

const initialState: PocketsState = {
	isFetching: false,
	all: [],
	basePocket: null,
	targetPocket: null,
};

const pocketsSlice = createSlice({
	name: 'pockets',
	initialState,
	reducers: {
		setIsFetching: (state, action: PayloadAction<boolean>) => {
			state.isFetching = action.payload;
		},
		setAllPockets: (state, action: PayloadAction<Pocket[]>) => {
			state.all = action.payload;
		},
		updatePocket: (state, action: PayloadAction<Pocket>) => {
			const pocketIndex = state.all.findIndex(p => p.id === action.payload?.id);
			if (pocketIndex > -1) {
				state.all[pocketIndex] = action.payload;
			}
		},
		setBasePocket: (state, action: PayloadAction<Pocket | null>) => {
			state.basePocket = action.payload;
		},
		setTargetPocket: (state, action: PayloadAction<Pocket | null>) => {
			state.targetPocket = action.payload;
		},
	}
});

export const {setIsFetching, setBasePocket, setTargetPocket, setAllPockets, updatePocket} = pocketsSlice.actions;

export const fetchAccounts = () => {
	return async (dispatch: AppDispatch) => {
		dispatch(setIsFetching(true));
		try {
			const result = await api.fetchAccounts();
			if (result) {
				dispatch(setAllPockets(result));
			}
		} catch (error) {
			console.error('Error while fetching accounts.');
		}
		dispatch(setIsFetching(false));
	};
};

export default pocketsSlice.reducer;

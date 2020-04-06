import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Pocket, PocketsState} from './types';
import {AppDispatch, RootState} from '../index';
import * as api from '../../utils/api';
import {fetchRates} from '../rates/ratesSlice';
import {convertToTarget} from '../exchange/exchangeSlice';

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
			const pockets = await api.fetchAccounts();
			if (pockets) {
				dispatch(setAllPockets(pockets));
				dispatch(setBasePocket(pockets.find((p: Pocket) => p.isActive)));
				dispatch(setTargetPocket(pockets.find((p:Pocket) => !p.isActive)));
			}
		} catch (error) {
			console.error('Error while fetching accounts.');
		}
		dispatch(setIsFetching(false));
	};
};

export const switchPockets = () => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		const {basePocket, targetPocket} = getState().pockets;
		if (basePocket && targetPocket) {
			dispatch(setBasePocket(targetPocket));
			dispatch(setTargetPocket(basePocket));
			await dispatch(fetchRates(targetPocket.type));
			await dispatch(convertToTarget(basePocket.type))
		}
	};
};

export default pocketsSlice.reducer;

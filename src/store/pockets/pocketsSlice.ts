import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Pocket, PocketsState} from './types';
import {AppDispatch, RootState} from '../index';
import * as api from '../../utils/api';
import {fetchRatesBy} from '../currency/currencySlice';
import {
	baseAmountUpdated,
	setBaseAmount,
	setTargetAmount,
	setTargetInputEdited,
	targetAmountUpdated
} from '../exchange/exchangeSlice';

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
		setBasePocket: (state, action: PayloadAction<Pocket | null>) => {
			state.basePocket = action.payload;
		},
		setTargetPocket: (state, action: PayloadAction<Pocket | null>) => {
			state.targetPocket = action.payload;
		},
		updatePocket: (state, action: PayloadAction<Pocket>) => {
			const pocketIndex = state.all.findIndex(p => p.id === action.payload?.id);
			if (pocketIndex > -1) {
				state.all[pocketIndex] = action.payload;
			}
		},
	}
});

export const {setIsFetching, setBasePocket, setTargetPocket, setAllPockets, updatePocket} = pocketsSlice.actions;

export const selectPocketById = (state: RootState, id: Pocket['id']) => {
	const pocket = state.pockets.all.find(p => p.id === id);
	if (pocket) {
		return pocket;
	}
	return null;
};

export const fetchPockets = () => {
	return async (dispatch: AppDispatch) => {
		dispatch(setIsFetching(true));
		try {
			const pockets = await api.fetchPockets();
			if (pockets) {
				dispatch(setAllPockets(pockets));
				dispatch(setBasePocket(pockets.find((p: Pocket) => p.isActive)));
				dispatch(setTargetPocket(pockets.find((p: Pocket) => !p.isActive)));
			}
		} catch (error) {
			console.error('Error while fetching accounts.');
		}
		dispatch(setIsFetching(false));
	};
};

export const swapPockets = () => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		const {basePocket, targetPocket} = getState().pockets;
		const {baseAmount, targetAmount, isTargetInputEdited} = getState().exchange;
		await dispatch(fetchRatesBy(targetPocket?.type));
		dispatch(setBasePocket(targetPocket));
		dispatch(setBaseAmount(targetAmount));
		dispatch(setTargetPocket(basePocket));
		dispatch(setTargetAmount(baseAmount));
		dispatch(setTargetInputEdited(!isTargetInputEdited));
	};
};

export const basePocketUpdated = (pocketId: string) => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		const newBasePocket = selectPocketById(getState(), parseInt(pocketId));
		if (newBasePocket?.id !== getState().pockets.targetPocket?.id) {
			await dispatch(fetchRatesBy(newBasePocket.type));
			dispatch(setBasePocket(newBasePocket));
			return dispatch(baseAmountUpdated(getState().exchange.baseAmount));
		}
		return dispatch(swapPockets());
	};
};

export const targetPocketUpdated = (pocketId: string) => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		const newTargetPocket = selectPocketById(getState(), parseInt(pocketId));
		if (newTargetPocket?.id !== getState().pockets.basePocket?.id) {
			dispatch(setTargetPocket(newTargetPocket));
			return dispatch(targetAmountUpdated(getState().exchange.targetAmount));
		}
		return dispatch(swapPockets());
	};
};

export default pocketsSlice.reducer;

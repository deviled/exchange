import to from 'await-to-js';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Pocket, PocketsState} from './types';
import {AppDispatch, RootState} from '../index';
import * as api from '../../utils/api';
import {fetchRatesBy} from '../currency/currencySlice';
import {baseAmountUpdated, setBaseAmount, setTargetAmount, setTargetInputEdited} from '../exchange/exchangeSlice';

export const initialState: PocketsState = {
	isFetching: false,
	all: [],
	basePocket: undefined,
	targetPocket: undefined,
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
		setBasePocket: (state, action: PayloadAction<PocketsState['basePocket']>) => {
			if (action.payload) {
				state.basePocket = action.payload;
			}
		},
		setTargetPocket: (state, action: PayloadAction<PocketsState['targetPocket']>) => {
			if (action.payload) {
				state.targetPocket = action.payload;
			}
		},
		updatePocket: (state, action: PayloadAction<Pocket>) => {
			const pocketIndex = state.all.findIndex(p => p.id === action.payload?.id);
			const pocket = state.all[pocketIndex];
			if (pocket) {
				if (pocket.id === state.basePocket?.id) {
					state.basePocket = action.payload;
				}
				if (pocket.id === state.targetPocket?.id) {
					state.targetPocket = action.payload;
				}
				state.all[pocketIndex] = action.payload;
			}
		}
	}
});

export const {updatePocket, setAllPockets, setIsFetching, setBasePocket, setTargetPocket} = pocketsSlice.actions;

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
		const [err, pockets] = await to(api.fetchPockets());
		if (pockets) {
			dispatch(setAllPockets(pockets));
			dispatch(setBasePocket(pockets.find((p: Pocket) => p.isMainPocket)));
			dispatch(setTargetPocket(pockets.find((p: Pocket) => !p.isMainPocket)));
		}
		dispatch(setIsFetching(false));
		return err;
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

export const updateBasePocketBalance = (newBalance: number) => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		const {basePocket} = getState().pockets;
		if (basePocket) {
			const balance = newBalance.toFixed(2);
			dispatch(updatePocket({...basePocket, balance}));
		}
	};
};

export const updateTargetPocketBalance = (newBalance: number) => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		const {targetPocket} = getState().pockets;
		if (targetPocket) {
			const balance = newBalance.toFixed(2);
			dispatch(updatePocket({...targetPocket, balance}));
		}
	};
};

export const basePocketChanged = (pocketId: string) => {
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

export const targetPocketChanged = (pocketId: string) => {
	return async (
		dispatch: AppDispatch, getState: () => RootState) => {
		const newTargetPocket = selectPocketById(getState(), parseInt(pocketId));
		if (newTargetPocket?.id !== getState().pockets.basePocket?.id) {
			dispatch(setTargetPocket(newTargetPocket));
			return dispatch(baseAmountUpdated(getState().exchange.baseAmount));
		}
		return dispatch(swapPockets());
	};
};

export default pocketsSlice.reducer;

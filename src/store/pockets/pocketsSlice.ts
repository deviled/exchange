import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Pocket} from './types';

// Ideally should be retrieved via api
const initialState: Pocket[] = [
	{
		id: 1,
		type: 'EUR',
		balance: 15.08,
		symbol: '€'
	},
	{
		id: 2,
		type: 'GBP',
		balance: 1.99,
		symbol: '£',
	},
	{
		id: 3,
		type: 'USD',
		balance: 0.00,
		symbol: '$'
	}
];

const pocketsSlice = createSlice({
	name: 'pockets',
	initialState,
	reducers: {
		setPockets: (state, action: PayloadAction<Pocket[]>) => {
			return action.payload;
		},
		updatePocket: (state, action: PayloadAction<Pocket>) => {
			const pocketIndex = state.findIndex(pocket => pocket.id === action.payload.id);
			if (pocketIndex > -1) {
				state[pocketIndex] = action.payload;
			}
		}
	}
});

export const {setPockets, updatePocket} = pocketsSlice.actions;

export default pocketsSlice.reducer;

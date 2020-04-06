import {combineReducers, configureStore} from '@reduxjs/toolkit';
import pocketsSlice from './pockets/pocketsSlice';
import exchangeSlice from './exchange/exchangeSlice';
import ratesSlice from './rates/ratesSlice';

const rootReducer = combineReducers({
	rates: ratesSlice,
	pockets: pocketsSlice,
	exchange: exchangeSlice
});

export const store = configureStore({
	reducer: rootReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
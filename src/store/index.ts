import {combineReducers, configureStore} from '@reduxjs/toolkit';
import loaderSlice from './loader/loaderSlice';
import pocketsSlice from './pockets/pocketsSlice';
import exchangeSlice from './exchange/exchangeSlice';

const rootReducer = combineReducers({
	isLoading: loaderSlice,
	pockets: pocketsSlice,
	exchange: exchangeSlice
});

export const store = configureStore({
	reducer: rootReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
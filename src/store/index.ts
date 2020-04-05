import {combineReducers, configureStore} from '@reduxjs/toolkit';
import pocketsSlice from './pockets/pocketsSlice';
import exchangeSlice from './exchange/exchangeSlice';

const rootReducer = combineReducers({
	pockets: pocketsSlice,
	exchange: exchangeSlice
});

export const store = configureStore({
	reducer: rootReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
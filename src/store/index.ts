import {combineReducers, configureStore} from '@reduxjs/toolkit';
import exchangeSlice from './exchange/exchangeSlice';
import currencySlice from './currency/currencySlice';
import pocketsSlice from './pockets/pocketsSlice';

const rootReducer = combineReducers({
	exchange: exchangeSlice,
	currency: currencySlice,
	pockets: pocketsSlice,
});

export const store = configureStore({
	reducer: rootReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
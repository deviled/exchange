import React, {useEffect} from 'react';
import Exchange from './Exchange/Exchange';
import {AppDispatch} from '../store';
import {useDispatch} from 'react-redux';
import {fetchAccounts} from '../store/pockets/pocketsSlice';

export function App() {
	const dispatch: AppDispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchAccounts());
	}, [dispatch]);

	return (
		<Exchange />
	)
}
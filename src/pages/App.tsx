import React, {useEffect} from 'react';
import Exchange from './Exchange/Exchange';
import {AppDispatch, RootState} from '../store';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAccounts} from '../store/pockets/pocketsSlice';

export function App() {
	const dispatch: AppDispatch = useDispatch();
	const pockets = useSelector((state: RootState) => state.pockets);

	useEffect(() => {
		dispatch(fetchAccounts());
	}, [dispatch]);

	if (!pockets.isFetching) {
		return (
			<Exchange />
		)
	}
	return null;
}
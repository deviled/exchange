import React, {useEffect} from 'react';
import Exchange from './Exchange/Exchange';
import {useDispatch, useSelector} from 'react-redux';
import {fetchPockets} from '../store/pockets/pocketsSlice';
import {AppDispatch, RootState} from '../store';

export function App() {
	const dispatch: AppDispatch = useDispatch();
	const pockets = useSelector((state: RootState) => state.pockets);

	useEffect(() => {
		dispatch(fetchPockets());
	}, [dispatch]);

	if (!pockets.isFetching) {
		return (
			<Exchange/>
		);
	}
	return null;
}
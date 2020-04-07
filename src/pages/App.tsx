import React, {useEffect} from 'react';
import Exchanger from '../components/organisms/Exchanger/Exchanger';
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
			<Exchanger/>
		);
	}
	return null;
}
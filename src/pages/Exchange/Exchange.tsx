import React, {useMemo, useState} from 'react';
import debounce from 'lodash.debounce';
import {useDispatch, useSelector} from 'react-redux';
import {CurrencyInput} from '../../components/CurrencyInput/CurrencyInput';
import {Select} from '../../components/Select/Select';
import {pocketsToOptions} from './utils';
import {AppDispatch, RootState} from '../../store';
import {useInterval} from '../../utils/hooks';
import {convertFrom, convertTo, fetchRates, setFromAmount, setToAmount} from '../../store/exchange/exchangeSlice';
import styles from './Exchange.module.scss';

const FETCH_RATES_INTERVAL = 10000;
const CONVERT_DEBOUNCE_TIME = 250;

function Exchange() {
	const dispatch: AppDispatch = useDispatch();
	const isLoading = useSelector((state: RootState) => state.isLoading);
	const pockets = useSelector((state: RootState) => state.pockets);
	const options = useMemo(() => pockets.map(pocketsToOptions), [pockets]);
	const [basePocket, setBasePocket] = useState(pockets[0]);
	const [targetPocket, setTargetPocket] = useState(pockets[1]);
	const {fromAmount, toAmount} = useSelector((state: RootState) => state.exchange);

	useInterval(() => {
		dispatch(fetchRates(basePocket.type));
	}, FETCH_RATES_INTERVAL, [dispatch, basePocket.type]);

	return (
		<div className={styles['exchange']}>
			<div className={styles['exchange__group']}>
				<Select
					value={basePocket.id}
					options={options}
					onChange={(value: string) => {
						const newBasePocket = pockets.find(p => p.id === parseInt(value));
						if (newBasePocket) {
							setBasePocket(newBasePocket);
						}
					}}
				/>
				<CurrencyInput
					dataQa='fromPocketInput'
					value={fromAmount}
					isDisabled={isLoading}
					onChange={(amount: string) => {
						dispatch(setFromAmount(amount));
						debounce(() => {
							dispatch(convertTo(targetPocket?.type, parseFloat(amount)));
						}, CONVERT_DEBOUNCE_TIME)();
					}}
				/>
			</div>

			<div className={styles['exchange__group']}>
				<Select
					value={targetPocket.id}
					options={options}
					onChange={(value: string) => {
						const newTargetPocket = pockets.find(p => p.id === parseInt(value));
						if (newTargetPocket) {
							setTargetPocket(newTargetPocket);
						}
					}}
				/>
				<CurrencyInput
					dataQa='toPocketInput'
					value={toAmount}
					isDisabled={isLoading}
					onChange={(amount: string) => {
						dispatch(setToAmount(amount));
						debounce(() => {
							dispatch(convertFrom(targetPocket?.type, parseFloat(amount)));
						}, CONVERT_DEBOUNCE_TIME)();
					}}
				/>
			</div>
		</div>
	);
}

export default Exchange;

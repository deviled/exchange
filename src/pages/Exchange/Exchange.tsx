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
import {Pocket} from '../../store/pockets/types';

const CONVERT_DEBOUNCE_TIME = 250;
const FETCH_RATES_INTERVAL = 10000;

function Exchange() {
	const dispatch: AppDispatch = useDispatch();
	const pockets = useSelector((state: RootState) => state.pockets);
	const options = useMemo(() => pockets.map(pocketsToOptions), [pockets]);
	const [basePocket, setBasePocket] = useState(pockets[0]);
	const [targetPocket, setTargetPocket] = useState(pockets[1]);
	const {fromAmount, toAmount, isFetching} = useSelector((state: RootState) => state.exchange);

	useInterval(() => {
		dispatch(fetchRates(basePocket.type));
	}, FETCH_RATES_INTERVAL, [dispatch, basePocket.type]);

	const handleSelectChange = (callback: (pocket: Pocket) => void) => {
		return (value: string) => {
			const newPocket = pockets.find(p => p.id === parseInt(value));
			if (newPocket) {
				callback && callback(newPocket);
			}
		};
	};

	return (
		<div className={styles['exchange']}>
			<div className={styles['exchange__group']}>
				<Select
					value={basePocket.id}
					options={options}
					onChange={
						handleSelectChange(async (value: Pocket) => {
							setBasePocket(value);
							await dispatch(fetchRates(value.type));
							dispatch(convertTo(targetPocket.type));
						})
					}
				/>
				<CurrencyInput
					dataQa='fromPocketInput'
					value={fromAmount}
					isDisabled={isFetching}
					onChange={(amount: string) => {
						dispatch(setFromAmount(amount));
						debounce(() => {
							dispatch(convertTo(targetPocket?.type));
						}, CONVERT_DEBOUNCE_TIME)();
					}}
				/>
			</div>
			<div className={styles['exchange__group']}>
				<Select
					value={targetPocket.id}
					options={options}
					onChange={
						handleSelectChange((value: Pocket) => {
							setTargetPocket(value);
							dispatch(convertFrom(value.type));
						})
					}
				/>
				<CurrencyInput
					dataQa='toPocketInput'
					value={toAmount}
					isDisabled={isFetching}
					onChange={(amount: string) => {
						dispatch(setToAmount(amount));
						debounce(() => {
							dispatch(convertFrom(targetPocket?.type));
						}, CONVERT_DEBOUNCE_TIME)();
					}}
				/>
			</div>
		</div>
	);
}

export default Exchange;

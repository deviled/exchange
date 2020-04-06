import React, {useMemo, useState} from 'react';
import debounce from 'lodash.debounce';
import {useDispatch, useSelector} from 'react-redux';
import {CurrencyInput} from '../../components/CurrencyInput/CurrencyInput';
import {Select} from '../../components/Select/Select';
import {pocketsToOptions} from './utils';
import {AppDispatch, RootState} from '../../store';
import {useInterval} from '../../utils/hooks';
import {fetchRates} from '../../store/rates/ratesSlice';
import styles from './Exchange.module.scss';
import {Pocket} from '../../store/pockets/types';
import {convertToBase, convertToTarget, setBaseAmount, setTargetAmount} from '../../store/exchange/exchangeSlice';

const CONVERT_DEBOUNCE_TIME = 250;
const FETCH_RATES_INTERVAL = 10000;

function Exchange() {
	const dispatch: AppDispatch = useDispatch();
	const {isFetching} = useSelector((state: RootState) => state.rates);
	const pockets = useSelector((state: RootState) => state.pockets);
	const options = useMemo(() => pockets.all.map(pocketsToOptions), [pockets]);
	const [basePocket, setBasePocket] = useState(pockets.all[0]);
	const [targetPocket, setTargetPocket] = useState(pockets.all[1]);
	const {baseAmount, targetAmount} = useSelector((state: RootState) => state.exchange);

	useInterval(() => {
		dispatch(fetchRates(basePocket.type));
	}, FETCH_RATES_INTERVAL, [dispatch, basePocket.type]);

	const handleSelectChange = (callback: (pocket: Pocket) => void) => {
		return (value: string) => {
			const newPocket = pockets.all.find(p => p.id === parseInt(value));
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
							dispatch(convertToTarget(targetPocket.type));
						})
					}
				/>
				<CurrencyInput
					dataQa='fromPocketInput'
					value={baseAmount}
					isDisabled={isFetching}
					onChange={(amount: string) => {
						dispatch(setBaseAmount(amount));
						debounce(() => {
							dispatch(convertToTarget(targetPocket?.type));
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
							dispatch(convertToBase(value.type));
						})
					}
				/>
				<CurrencyInput
					dataQa='toPocketInput'
					value={targetAmount}
					isDisabled={isFetching}
					onChange={(amount: string) => {
						dispatch(setTargetAmount(amount));
						debounce(() => {
							dispatch(convertToBase(targetPocket?.type));
						}, CONVERT_DEBOUNCE_TIME)();
					}}
				/>
			</div>
		</div>
	);
}

export default Exchange;

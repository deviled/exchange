import React, {useEffect, useMemo} from 'react';
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
import {setBasePocket, setTargetPocket, switchPockets} from '../../store/pockets/pocketsSlice';

const CONVERT_DEBOUNCE_TIME = 250;
const FETCH_RATES_INTERVAL = 10000;

function Exchange() {
	const dispatch: AppDispatch = useDispatch();
	const allPockets = useSelector((state: RootState) => state.pockets.all);
	const options = useMemo(() => allPockets.map(pocketsToOptions), [allPockets]);
	const {basePocket, targetPocket} = useSelector((state: RootState) => state.pockets);
	const {baseAmount, targetAmount} = useSelector((state: RootState) => state.exchange);

	useEffect(() => {
		if (basePocket) {
			dispatch(fetchRates(basePocket.type));
		}
	});

	useInterval(() => {
		if (basePocket) {
			dispatch(fetchRates(basePocket.type));
		}
	}, FETCH_RATES_INTERVAL, [dispatch, basePocket]);

	const handleSelectChange = (callback: (pocket: Pocket) => void) => {
		return (value: string) => {
			const newPocket = allPockets.find(p => p.id === parseInt(value));
			if (newPocket) {
				callback && callback(newPocket);
			}
		};
	};

	return (
		<div className={styles['exchange']}>
			<div className={styles['exchange__group']}>
				<Select
					value={basePocket?.id}
					options={options}
					onChange={
						handleSelectChange(async (value: Pocket) => {
							if (value.type === targetPocket?.type) {
								await dispatch(switchPockets());
							} else {
								dispatch(setBasePocket(value));
								await dispatch(fetchRates(value.type));
								targetPocket && dispatch(convertToTarget(targetPocket.type));
							}
						})
					}
				/>
				<CurrencyInput
					dataQa='fromPocketInput'
					value={baseAmount}
					onChange={(amount: string) => {
						dispatch(setBaseAmount(amount));
						debounce(() => {
							targetPocket && dispatch(convertToTarget(targetPocket.type));
						}, CONVERT_DEBOUNCE_TIME)();
					}}
				/>
			</div>
			<div className={styles['exchange__group']}>
				<Select
					value={targetPocket?.id}
					options={options}
					onChange={
						handleSelectChange((value: Pocket) => {
							if (value.type === basePocket?.type) {
								dispatch(switchPockets());
							} else {
								dispatch(setTargetPocket(value));
								value && dispatch(convertToTarget(value.type));
							}
						})
					}
				/>
				<CurrencyInput
					dataQa='toPocketInput'
					value={targetAmount}
					onChange={(amount: string) => {
						dispatch(setTargetAmount(amount));
						debounce(() => {
							targetPocket && dispatch(convertToBase(targetPocket.type));
						}, CONVERT_DEBOUNCE_TIME)();
					}}
				/>
			</div>
			<button onClick={() => dispatch(switchPockets())}>Switch pockets</button>
		</div>
	);
}

export default Exchange;

import React, {useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {NumberInput} from '../../components/atoms/NumberInput/NumberInput';
import {Select} from '../../components/atoms/Select/Select';
import {Pocket} from '../../store/pockets/types';
import {AppDispatch, RootState} from '../../store';
import {useInterval} from '../../utils/hooks';
import {fetchRatesBy, selectCurrentExchangeRate} from '../../store/currency/currencySlice';
import styles from './Exchange.module.scss';
import {baseAmountUpdated, targetAmountUpdated} from '../../store/exchange/exchangeSlice';
import {basePocketUpdated, swapPockets, targetPocketUpdated} from '../../store/pockets/pocketsSlice';
import {Button} from '../../components/atoms/Button/Button';
import {formatDecimal} from '../../utils/utils';

const FETCH_RATES_INTERVAL = 10000;

const pocketsToOptions = (pocket: Pocket) => ({
	value: pocket.id,
	label: pocket.type,
});

export function Exchange() {
	const dispatch: AppDispatch = useDispatch();
	const rate = useSelector(selectCurrentExchangeRate);
	const pockets = useSelector((state: RootState) => state.pockets.all);
	const options = useMemo(() => pockets.map(pocketsToOptions), [pockets]);
	const {basePocket, targetPocket} = useSelector((state: RootState) => state.pockets);
	const {baseAmount, targetAmount} = useSelector((state: RootState) => state.exchange);

	useInterval(async () => {
		if (basePocket) {
			dispatch(fetchRatesBy(basePocket.type));
		}
	}, FETCH_RATES_INTERVAL, [dispatch, basePocket]);

	const getBalanceLabel = (pocket: Pocket | null) => {
		if (pocket) {
			return `Balance: ${formatDecimal(pocket?.balance || 0)}${pocket?.symbol}`;
		}
		return '';
	};

	const getExchangeRateTitle = () => {
		if (rate) {
			return `1${basePocket?.symbol} = ${formatDecimal(rate)}${targetPocket?.symbol}`;
		}
		return null;
	};

	return (
		<div className={styles['exchange']}>
			<div className={styles['exchange__group']}>
				<Select
					value={basePocket?.id}
					options={options}
					onChange={(pocketId: string) => {
						dispatch(basePocketUpdated(pocketId));
					}}
				/>
				<NumberInput
					dataQa='fromPocketInput'
					value={baseAmount}
					onChange={(amount: string) => {
						dispatch(baseAmountUpdated(amount));
					}}
				/>
			</div>
			<label>{getBalanceLabel(basePocket)}</label>
			<div className={styles['exchange__group']}>
				<Select
					value={targetPocket?.id}
					options={options}
					onChange={(pocketId: string) => {
						dispatch(targetPocketUpdated(pocketId));
					}}
				/>
				<NumberInput
					dataQa='toPocketInput'
					value={targetAmount}
					onChange={(amount: string) => {
						dispatch(targetAmountUpdated(amount));
					}}
				/>
			</div>
			<label>{getBalanceLabel(targetPocket)}</label>
			<div className={styles['exchange__group']}>
				<Button
					text='Exchange'
					onClick={() => dispatch(swapPockets())}
					tabIndex={0}
				/>
			</div>
			<label>{getExchangeRateTitle()}</label>
		</div>
	);
}

export default Exchange;

import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../store';
import {useInterval} from '../../../utils/hooks';
import {fetchRatesBy} from '../../../store/currency/currencySlice';
import {baseAmountUpdated, exchange, targetAmountUpdated} from '../../../store/exchange/exchangeSlice';
import {basePocketChanged, swapPockets, targetPocketChanged} from '../../../store/pockets/pocketsSlice';
import {Button} from '../../atoms/Button/Button';
import {PocketInput} from '../../molecules/PocketInput/PocketInput';
import {RateLabel} from '../../atoms/RateLabel/RateLabel';
import styles from './Exchanger.module.scss';

const FETCH_RATES_INTERVAL = 10000;

export function Exchanger() {
	const dispatch: AppDispatch = useDispatch();
	const {basePocket, targetPocket} = useSelector((state: RootState) => state.pockets);
	const {baseAmount, targetAmount} = useSelector((state: RootState) => state.exchange);
	const isBalanceExceeded = Boolean(basePocket && parseFloat(baseAmount) > parseFloat(basePocket.balance));

	useInterval(async () => {
		if (basePocket) {
			dispatch(fetchRatesBy(basePocket.type));
		}
	}, FETCH_RATES_INTERVAL, [dispatch, basePocket]);

	return (
		<div className={styles['exchange']}>
			<RateLabel />
			<PocketInput
				pocket={basePocket}
				pocketAmount={baseAmount}
				onInputChange={(amount: string) => {
					dispatch(baseAmountUpdated(amount));
				}}
				onPocketChange={(pocketId: string) => {
					dispatch(basePocketChanged(pocketId));
				}}
				isError={isBalanceExceeded}
				errorMessage={'Exceeds balance'}
			/>
			<PocketInput
				pocket={targetPocket}
				pocketAmount={targetAmount}
				onInputChange={(amount: string) => {
					dispatch(targetAmountUpdated(amount));
				}}
				onPocketChange={(pocketId: string) => {
					dispatch(targetPocketChanged(pocketId));
				}}
			/>
			<Button
				onClick={() => dispatch(exchange())}
				tabIndex={0}
				isDisabled={isBalanceExceeded}
			>
				{'Exchange'}
			</Button>
			<Button
				onClick={() => dispatch(swapPockets())}
				buttonStyles={styles['exchange__swap']}
			>
				{'Swap Pockets'}
				{/*<SwapIcon className={styles['exchange__swap-icon']} />*/}
			</Button>
		</div>
	);
}

export default Exchanger;

import React from 'react';
import styles from './RateLabel.module.scss';
import {formatDecimal} from '../../../utils/utils';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {selectCurrentExchangeRate} from '../../../store/currency/currencySlice';

export function RateLabel() {
	const exchangeRate = useSelector(selectCurrentExchangeRate);
	const {basePocket, targetPocket} = useSelector((state: RootState) => state.pockets);

	if (exchangeRate) {
		return (
			<div className={styles['rate-label']}>
				{`1${basePocket?.symbol} = ${formatDecimal(exchangeRate)}${targetPocket?.symbol}`}
			</div>
		)
	}
	return null;
}
import React from 'react';
import styles from './RateLabel.module.scss';
import {formatDecimal} from '../../../utils/utils';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {selectCurrentExchangeRate} from '../../../store/currency/currencySlice';

interface RateLabelTemplateProps {
	exchangeRate: number | null;
	basePocketSymbol: string | undefined;
	targetPocketSymbol: string | undefined;
}

export const RateLabelTemplate: React.FunctionComponent<RateLabelTemplateProps> = props => {
	const {exchangeRate, basePocketSymbol, targetPocketSymbol} = props;

	if (exchangeRate) {
		return (
			<div
				data-qa='rateLabel'
				className={styles['rate-label']}
			>
				{`1${basePocketSymbol} = ${formatDecimal(exchangeRate, 4)}${targetPocketSymbol}`}
			</div>
		)
	}
	return null;
};

export const RateLabel: React.FunctionComponent = () => {
	const exchangeRate = useSelector(selectCurrentExchangeRate);
	const {basePocket, targetPocket} = useSelector((state: RootState) => state.pockets);

	return (
		<RateLabelTemplate
			exchangeRate={exchangeRate}
			basePocketSymbol={basePocket?.symbol}
			targetPocketSymbol={targetPocket?.symbol}
		/>
	);
};

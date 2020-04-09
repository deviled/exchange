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
import {PocketsState} from '../../../store/pockets/types';

export interface ExchangerTemplateProps {
	basePocket: PocketsState['basePocket'];
	baseAmount: string;
	targetPocket: PocketsState['targetPocket'];
	targetAmount: string;
	onBaseAmountChanged?: (amount: string) => void;
	onBasePocketChanged?: (pocketId: string) => void;
	onTargetAmountChanged?: (amount: string) => void;
	onTargetPocketChanged?: (pocketId: string) => void;
	onExchangeButtonClicked?: () => void;
	onSwapButtonClicked?: () => void;
}

export const ExchangerTemplate: React.FunctionComponent<ExchangerTemplateProps> = props => {
	const {baseAmount, basePocket, targetAmount, targetPocket} = props;
	const isBaseAmountZero = parseFloat(baseAmount) === 0;
	const isBalanceExceeded = Boolean(basePocket && parseFloat(baseAmount) > parseFloat(basePocket?.balance));

	return (
		<div
			data-qa='exchanger'
			className={styles['exchange']}
		>
			<div className={styles['exchange__rates-label']}>
				<RateLabel />
			</div>

			<PocketInput
				dataQa='basePocket'
				pocket={basePocket}
				pocketAmount={baseAmount}
				onInputChange={props.onBaseAmountChanged}
				onPocketChange={props.onBasePocketChanged}
				isError={isBalanceExceeded}
				errorMessage={'Exceeds balance'}
			/>

			<PocketInput
				dataQa='targetPocket'
				pocket={targetPocket}
				pocketAmount={targetAmount}
				onInputChange={props.onTargetAmountChanged}
				onPocketChange={props.onTargetPocketChanged}
			/>

			<Button
				dataQa='exchangeButton'
				onClick={props.onExchangeButtonClicked}
				tabIndex={0}
				isDisabled={isBalanceExceeded || isBaseAmountZero}
			>
				{'Exchange'}
			</Button>

			<Button
				dataQa='swapPocketsButton'
				onClick={props.onSwapButtonClicked}
				buttonStyles={styles['exchange__swap']}
			>
				{'Swap Pockets'}
			</Button>
		</div>
	);
};

const FETCH_RATES_INTERVAL = 10000;

export const Exchanger: React.FunctionComponent = () => {
	const dispatch: AppDispatch = useDispatch();
	const {basePocket, targetPocket} = useSelector((state: RootState) => state.pockets);
	const {baseAmount, targetAmount} = useSelector((state: RootState) => state.exchange);

	useInterval(async () => {
		if (basePocket) {
			dispatch(fetchRatesBy(basePocket.type));
		}
	}, FETCH_RATES_INTERVAL, [dispatch, basePocket]);

	return (
		<ExchangerTemplate
			baseAmount={baseAmount}
			basePocket={basePocket}
			onBaseAmountChanged={(amount: string) => dispatch(baseAmountUpdated(amount))}
			onBasePocketChanged={(pocketId: string) => dispatch(basePocketChanged(pocketId))}
			targetAmount={targetAmount}
			targetPocket={targetPocket}
			onTargetAmountChanged={(amount: string) => dispatch(targetAmountUpdated(amount))}
			onTargetPocketChanged={(pocketId: string) => dispatch(targetPocketChanged(pocketId))}
			onExchangeButtonClicked={() => dispatch(exchange())}
			onSwapButtonClicked={() => dispatch(swapPockets())}
		/>
	);
};

export default Exchanger;

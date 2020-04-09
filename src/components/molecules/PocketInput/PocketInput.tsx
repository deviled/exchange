import {Select} from '../../atoms/Select/Select';
import {NumberInput} from '../../atoms/NumberInput/NumberInput';
import React, {useMemo} from 'react';
import styles from './PocketInput.module.scss';
import {Pocket} from '../../../store/pockets/types';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {getBalanceLabel, pocketsToOptions} from './utils';

export interface PocketProps {
	dataQa?: string;
	pocket: Pocket | undefined;
	pocketAmount: string;
	isError?: boolean;
	errorMessage?: string;
	onInputChange?: (amount: string) => void;
	onPocketChange?: (pocketId: string) => void;
}

export interface PocketTemplateProps extends PocketProps {
	options: Array<{value: any; label: string}>;
}

export const PocketInputTemplate: React.FunctionComponent<PocketTemplateProps> = props => (
	<div
		data-qa={props.dataQa}
		className={styles['pocket']}
	>
		<div className={styles['pocket__row']}>
			<Select
				styles={styles['pocket__select']}
				value={props.pocket?.id}
				options={props.options}
				onChange={props.onPocketChange}
			/>
			<NumberInput
				className={styles['pocket__input']}
				value={props.pocketAmount}
				onChange={props.onInputChange}
			/>
		</div>
		<div className={styles['pocket__row']}>
			<label className={styles['pocket__balance-label']}>
				{getBalanceLabel(props.pocket)}
			</label>
			{
				props.isError &&
				<label
					data-qa='pocketErrorLabel'
					className={styles['pocket__error']}
				>
					{props.errorMessage}
				</label>
			}
		</div>
	</div>
);

export const PocketInput: React.FunctionComponent<PocketProps> = props => {
	const pockets = useSelector((state: RootState) => state.pockets.all);
	const options = useMemo(() => pockets.map(pocketsToOptions), [pockets]);

	return (
		<PocketInputTemplate
			{...props}
			options={options}
		/>
	);
};

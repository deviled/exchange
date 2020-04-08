import React, {ChangeEvent} from 'react';
import {formatInput, isInputCorrect, normalizeInput} from './utils';
import styles from './NumberInput.module.scss';

export interface NumberInputProps {
	dataQa?: string;
	value: string;
	isDisabled?: boolean;
	onChange?: (amount: string) => void;
	className?: string;
}

export const handleChangeEvent = (callback: NumberInputProps['onChange']) => {
	return ({target}: ChangeEvent<HTMLInputElement>) => {
		const amount = normalizeInput(target.value) || '0';
		if (isInputCorrect(amount)) {
			callback && callback(amount);
		}
	};
};

export const NumberInput: React.FunctionComponent<NumberInputProps> = props => (
	<input
		className={[styles['number-input'], props.className].filter(Boolean).join(' ')}
		disabled={props.isDisabled}
		data-qa={props.dataQa || null}
		type='text'
		inputMode='decimal'
		onChange={handleChangeEvent(props.onChange)}
		value={formatInput(props.value)}
	/>
);

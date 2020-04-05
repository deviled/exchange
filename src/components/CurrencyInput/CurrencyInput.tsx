import React, {ChangeEvent} from 'react';
import {formatNumber, isInputCorrect, normalizeInput} from './utils';

interface CurrencyInputProps {
	dataQa?: string;
	value: string;
	isDisabled?: boolean;
	onChange: (amount: string) => void;
}

export const handleChangeEvent = (callback: CurrencyInputProps['onChange']) => {
	return ({target}: ChangeEvent<HTMLInputElement>) => {
		const amount = normalizeInput(target.value) || '0';
		if (isInputCorrect(amount)) {
			callback && callback(amount);
		}
	};
};

export function CurrencyInput(props: CurrencyInputProps) {
	return (
		<input
			disabled={props.isDisabled}
			data-qa={props.dataQa || null}
			type='text'
			inputMode='decimal'
			onChange={handleChangeEvent(props.onChange)}
			value={formatNumber(props.value)}
		/>
	);
}

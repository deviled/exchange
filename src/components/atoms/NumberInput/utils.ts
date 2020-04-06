import {formatDecimal} from '../../../utils/utils';

export const normalizeInput = (value: string) => {
	const withoutLeadingZeros = value.replace(/^0+(?=\d)/, '');
	return withoutLeadingZeros.replace(',', '.');
};

export const isInputCorrect = (value: string) => {
	const regex = new RegExp('^(0|[1-9]\\d*)(\\.\\d{0,2})?$', 'i');
	return regex.test(value.toString());
};

export const formatInput = (value: string) => {
	const isDecimal = /\.\d?\d?$/.test(value);
	if (isDecimal) {
		// Add 1 to the end of string to make sure parseFloat gives full decimal, then strip it.
		return formatDecimal(parseFloat(`${value}1`), 3).slice(0, -1);
	}
	return formatDecimal(parseFloat(value), 2);
};
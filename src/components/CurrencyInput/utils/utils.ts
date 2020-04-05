import {currencyFormatter} from './formatter';

export const normalizeInput = (value: string) => {
	const withoutLeadingZeros = value.replace(/^0+(?=\d)/, '');
	return withoutLeadingZeros.replace(',', '.');
};

export const isInputCorrect = (value: string) => {
	const regex = new RegExp('^(0|[1-9]\\d*)(\\.\\d{0,2})?$', 'i');
	return regex.test(value.toString());
};

export const formatNumber = (value: string) => {
	const isNotComplete = /\.$/.test(value);
	if (isNotComplete) {
		return currencyFormatter.format(parseFloat(`${value}1`)).slice(0, -1);
	}
	return currencyFormatter.format(parseFloat(value));
};
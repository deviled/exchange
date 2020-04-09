import {Pocket} from '../../../store/pockets/types';
import {formatDecimal} from '../../../utils/utils';

export const pocketsToOptions = (pocket: Pocket) => ({
	value: pocket.id,
	label: pocket.type,
});

export const getBalanceLabel = (pocket: Pocket | undefined) => {
	if (pocket) {
		const balance = parseFloat(pocket.balance);
		return `Balance: ${formatDecimal(balance, 2)}${pocket?.symbol}`;
	}
	return null;
};
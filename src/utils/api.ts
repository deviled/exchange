import {ExchangeState} from '../store/exchange/types';

const FETCH_RATES_API = 'https://api.exchangeratesapi.io/latest';

export async function fetchRates(base: ExchangeState['base']) {
	const resp = await fetch(`${FETCH_RATES_API}?base=${base}`, {
		method: 'GET',
	});
	if (resp?.ok) {
		return await resp.json();
	}
	return undefined;
}
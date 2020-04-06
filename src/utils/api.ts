import {CurrencyState} from '../store/currency/types';

const FETCH_RATES_API = 'https://api.exchangeratesapi.io/latest';
const FETCH_POCKETS_API = '/fakePockets.json';

export async function fetchRatesBy(base: CurrencyState['base']) {
	const resp = await fetch(`${FETCH_RATES_API}?base=${base}`, {
		method: 'GET',
	});
	if (resp?.ok) {
		return await resp.json();
	}
	return null;
}

export async function fetchPockets() {
	const resp = await fetch(FETCH_POCKETS_API, {
		method: 'GET',
	});
	if (resp?.ok) {
		return await resp.json();
	}
	return null;
}
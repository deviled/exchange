import {CurrencyState} from '../store/currency/types';

export const FETCH_RATES_API = 'https://api.exchangeratesapi.io/latest';
export const FETCH_POCKETS_API = '/fakePockets.json';

export async function fetchRatesBy(base: CurrencyState['base']) {
	const resp = await fetch(`${FETCH_RATES_API}?base=${base}`, {
		method: 'GET',
	});
	if (resp?.ok) {
		return await resp.json();
	}
	throw new Error('Error while fetching currency rates.');
}

export async function fetchPockets() {
	const resp = await fetch(FETCH_POCKETS_API, {
		method: 'GET',
	});
	if (resp?.ok) {
		return await resp.json();
	}
	throw new Error('Error while fetching pockets.');
}

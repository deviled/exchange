import {CurrencyState} from '../store/currency/types';
import to from 'await-to-js';

export const FETCH_RATES_API = 'https://api.exchangeratesapi.io/latest';
export const FETCH_POCKETS_API = '/fakePockets.json';

export async function fetchRatesBy(base: CurrencyState['base']) {
	const [err, resp] = await to(fetch(`${FETCH_RATES_API}?base=${base}`, {
		method: 'GET',
	}));
	if (resp?.ok) {
		return await resp.json();
	}
	return err;
}

export async function fetchPockets() {
	const [err, resp] = await to(fetch(FETCH_POCKETS_API, {
		method: 'GET',
	}));
	if (resp?.ok) {
		return await resp.json();
	}
	return err;
}

import {RatesState} from '../store/rates/types';

const FETCH_RATES_API = 'https://api.exchangeratesapi.io/latest';
const FETCH_ACCOUNTS_API = '/fakeAccounts.json';

export async function fetchRates(base: RatesState['base']) {
	const resp = await fetch(`${FETCH_RATES_API}?base=${base}`, {
		method: 'GET',
	});
	if (resp?.ok) {
		return await resp.json();
	}
	return null;
}

export async function fetchAccounts() {
	const resp = await fetch(FETCH_ACCOUNTS_API, {
		method: 'GET',
	});
	if (resp?.ok) {
		return await resp.json();
	}
	return null;
}
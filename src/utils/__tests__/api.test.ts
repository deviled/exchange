import {FETCH_RATES_API, fetchRatesBy} from '../api';

const mockFetchReturn = (ok = true, returnValue: any) => {
	return new Promise(resolve => (
		resolve({
			ok,
			json: async () => {
				return returnValue;
			},
		})
	));
};

describe('api.ts', () => {
	const setup = (ok = true) => {
		window.fetch = jest.fn().mockReturnValue(
			mockFetchReturn(ok, 'serverResult')
		);
	};

	describe('fetchRatesBy', () => {
		const setupFetchRates = (ok = true, base = 'EUR') => {
			setup(ok);
			const params = [`${FETCH_RATES_API}?base=${base}`, {
				method: 'GET',
			}];
			return {base, params};
		};

		it('should call with provided arguments', async () => {
			const {base, params} = setupFetchRates(true);
			await fetchRatesBy(base);
			expect(fetch).toHaveBeenCalledTimes(1);
			expect(fetch).toHaveBeenCalledWith(...params);
		});

		it('should return server result', async () => {
			const {base} = setupFetchRates(true);
			const result = await fetchRatesBy(base);
			expect(result).toBe('serverResult');
		});

		it('should throw error if api call fails', async () => {
			const base = '';
			setupFetchRates(false, base);
			await expect(fetchRatesBy(base)).rejects.toThrow('Error while fetching currency rates.');
		});
	});
});




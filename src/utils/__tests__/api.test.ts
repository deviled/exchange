import {FETCH_POCKETS_API, FETCH_RATES_API, fetchPockets, fetchRatesBy} from '../api';

describe('api.ts', () => {
	afterAll(() => {
		jest.clearAllMocks();
	});

	const setup = (ok = true) => {
		window.fetch = jest.fn().mockReturnValueOnce(new Promise(resolve => (
			resolve({
				ok,
				json: async () => {
					return 'result';
				},
			})
		)));
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
			expect(result).toBe('result');
		});

		it('should throw error if api call fails', async () => {
			const base = '';
			setupFetchRates(false, base);
			expect(await fetchRatesBy(base)).toBe(null);
		});
	});

	describe('fetchPockets', () => {
		const setupFetchPockets = (ok = true, base = 'EUR') => {
			setup(ok);
			const params = [FETCH_POCKETS_API, {
				method: 'GET',
			}];
			return {base, params};
		};

		it('should call with provided arguments', async () => {
			const {params} = setupFetchPockets(true);
			await fetchPockets();
			expect(fetch).toHaveBeenCalledTimes(1);
			expect(fetch).toHaveBeenCalledWith(...params);
		});

		it('should return server result', async () => {
			setupFetchPockets(true);
			const result = await fetchPockets();
			expect(result).toBe('result');
		});

		it('should throw error if api call fails', async () => {
			setupFetchPockets(false);
			expect(await fetchPockets()).toBe(null);
		});
	});
});




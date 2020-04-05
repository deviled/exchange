import reducer, { setIsLoading } from './loaderSlice';
import { AnyAction } from '@reduxjs/toolkit';

describe('loaderSlice.ts', () => {
	test('should return initial state', () => {
		const expectedState = false;
		const result = reducer(undefined, {} as AnyAction);
		expect(result).toBe(expectedState);
	});

	test('should set loading state', () => {
		const expectedState = true;
		const result = reducer(undefined, setIsLoading(true));
		expect(result).toBe(expectedState);
	});
});

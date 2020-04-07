import {formatInput, isInputCorrect, normalizeInput} from '../utils';


describe('NumberInput/utils.ts', () => {
	describe('normalizeInput', () => {
		const assertInput = (value: string) => {
			const result = normalizeInput(value);
			return expect(result);
		};

		it('should strip leading zeros from input', () => {
			assertInput('00012300').toBe('12300');
		});

		it('should leave single zero', () => {
			assertInput('0000000').toBe('0');
		});

		it('should replace commas with dots', () => {
			assertInput('0000000,123').toBe('0.123');
		});

		it('should not replace dots', () => {
			assertInput('0010000.123').toBe('10000.123');
		});

		it('should return not complete input', () => {
			assertInput('000,').toBe('0.');
		});
	});

	describe('isInputCorrect', () => {
		const assertInput = (value: string) => {
			const result = isInputCorrect(value);
			return expect(result);
		};

		it('should pass if input is integer', () => {
			assertInput('102').toBe(true);
		});

		it('should pass if input is decimal', () => {
			assertInput('0.3').toBe(true);
		});

		it('should pass if input is decimal with 2 fraction digits', () => {
			assertInput('0.30').toBe(true);
		});

		it('should pass if input is 0', () => {
			assertInput('0').toBe(true);
		});

		it('should pass if input is not complete', () => {
			assertInput('1.').toBe(true);
		});

		it('should fail if input is not a number', () => {
			assertInput('abcdef!#!$').toBe(false);
		});

		it('should fail if input is empty', () => {
			assertInput('').toBe(false);
		});

		it('should fail if input has commas', () => {
			assertInput('1,3').toBe(false);
		});

		it('should fail if inputs fractions digits are more than 2', () => {
			assertInput('100.333').toBe(false);
		});

		it('should fail if input has leading zeros', () => {
			assertInput('0100.0').toBe(false);
		});
	});

	describe('formatInput', () => {
		const assertFormatInput = (value: string) => {
			const result = formatInput(value);
			return expect(result);
		};
		it('should correctly format incomplete value', () => {
			assertFormatInput('0.').toBe('0.');
			assertFormatInput('1.').toBe('1.');
		});
		it('should correctly format integer values', () => {
			assertFormatInput('0').toBe('0');
			assertFormatInput('10').toBe('10');
			assertFormatInput('9101').toBe('9101');
		});
		it('should correctly format decimal values with more than 2 fraction digits', () => {
			assertFormatInput('0.0000').toBe('0');
			assertFormatInput('0.1000').toBe('0.1');
			assertFormatInput('0.154').toBe('0.15');
			assertFormatInput('0.155').toBe('0.16');
			assertFormatInput('100.004').toBe('100');
		});
		it('should correctly format decimal value with zeros', () => {
			assertFormatInput('0.0').toBe('0.0');
			assertFormatInput('1.0').toBe('1.0');
			assertFormatInput('1.00').toBe('1.00');
			assertFormatInput('12.1').toBe('12.1');
			assertFormatInput('1.10').toBe('1.10');
		});
	});
});




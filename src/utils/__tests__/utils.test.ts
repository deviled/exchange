import {formatDecimal} from '../utils';

describe('utils.ts', () => {
    describe('formatDecimal', () => {
        it('should format integer', () => {
            const result = formatDecimal(110);
            expect(result).toBe('110');
        });

        it('should return default maximum fraction digits', () => {
            const result = formatDecimal(101.55135);
            expect(result).toBe('101.551');
        });

        it('should format decimal with zeros as fraction digits', () => {
            const result = formatDecimal(0.00, 2);
            expect(result).toBe('0');
        });

        it('should format decimal with maximum fraction digits', () => {
            const result = formatDecimal(1.15422, 6);
            expect(result).toBe('1.15422');
        });

        it('should round up number', () => {
            const result = formatDecimal(1.1555555, 1);
            expect(result).toBe('1.2');
        });
    });
});
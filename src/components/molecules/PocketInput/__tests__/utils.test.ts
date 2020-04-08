import {getBalanceLabel, pocketsToOptions} from '../utils';
import {mockPocket} from '../__mocks__/PocketInput.mock';

describe('PocketInput/utils.ts', () => {
    describe('pocketsToOptions', () => {
        it('should mock pocket to select option', () => {
            const result = pocketsToOptions(mockPocket);
            expect(result).toEqual({value: mockPocket.id, label: mockPocket.type});
        });
    });

    describe('getBalanceLabel', () => {
        it('should return null if no pocket', () => {
            const result = getBalanceLabel(null);
            expect(result).toBe(null);
        });

        it('should return pocket balance label', () => {
            const result = getBalanceLabel(mockPocket);
            expect(result).toBe(`Balance: ${mockPocket.balance}${mockPocket.symbol}`);
        });
    });
});




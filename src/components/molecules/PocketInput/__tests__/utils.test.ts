import {getBalanceLabel, pocketsToOptions} from '../utils';
import {pocketMock} from '../__mocks__/pocketMock';

describe('PocketInput/utils.ts', () => {
    describe('pocketsToOptions', () => {
        it('should mock pocket to select option', () => {
            const result = pocketsToOptions(pocketMock);
            expect(result).toEqual({value: pocketMock.id, label: pocketMock.type});
        });
    });

    describe('getBalanceLabel', () => {
        it('should return null if no pocket', () => {
            const result = getBalanceLabel(null);
            expect(result).toBe(null);
        });

        it('should return pocket balance label', () => {
            const result = getBalanceLabel(pocketMock);
            expect(result).toBe(`Balance: ${pocketMock.balance}${pocketMock.symbol}`);
        });
    });
});




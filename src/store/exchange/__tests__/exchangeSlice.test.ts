import reducer, {
    calcBaseAmount,
    calcTargetAmount,
    initialState,
    setBaseAmount,
    setTargetAmount,
    setTargetInputEdited
} from '../exchangeSlice';

describe('exchangeSlice.ts', () => {
    it('should return the initial state', () => {
        const nextState = initialState;
        const result = reducer(undefined, {type: undefined});
        expect(result).toEqual(nextState);
    });

    describe('setTargetInputEdited', () => {
        it('should set target input edited', () => {
            const nextState = {...initialState, isTargetInputEdited: true};
            const result = reducer(initialState, setTargetInputEdited(true));
            return expect(result).toEqual(nextState);
        });
    });

    describe('setBaseAmount', () => {
        it('should set base amount if zero', () => {
            const result = reducer(initialState, setBaseAmount('0'));
            return expect(result).toEqual(initialState);
        });

        it('should set base amount if greater than zero', () => {
            const nextState = {...initialState, baseAmount: '15.041'};
            const result = reducer(initialState, setBaseAmount('15.041'));
            return expect(result).toEqual(nextState);
        });

        it('should not set base amount if negative', () => {
            const result = reducer(initialState, setBaseAmount('-0.001'));
            return expect(result).toEqual(initialState);
        });
    });

    describe('setTargetAmount', () => {
        it('should set target amount if zero', () => {
            const result = reducer(initialState, setTargetAmount('0'));
            return expect(result).toEqual(initialState);
        });

        it('should set target amount if greater than zero', () => {
            const nextState = {...initialState, targetAmount: '17'};
            const result = reducer(initialState, setTargetAmount('17'));
            return expect(result).toEqual(nextState);
        });

        it('should not set target amount if negative', () => {
            const result = reducer(initialState, setTargetAmount('-0.001'));
            return expect(result).toEqual(initialState);
        });
    });

    describe('calcBaseAmount', () => {
        it('should calc correct base amount if amount is zero', () => {
            const payload = {amount: '0', rate: 5.15};
            const result = reducer(initialState, calcBaseAmount(payload));
            return expect(result).toEqual(initialState);
        });

        it('should calc correct base amount if rate is zero', () => {
            const payload = {amount: '14', rate: 0};
            const result = reducer(initialState, calcBaseAmount(payload));
            return expect(result).toEqual(initialState);
        });

        it('should calc correct base amount if amount is negative', () => {
            const payload = {amount: '-7.15', rate: 5};
            const result = reducer(initialState, calcBaseAmount(payload));
            return expect(result).toEqual(initialState);
        });

        it('should calc correct base amount if rate is negative', () => {
            const payload = {amount: '10000.10', rate: -1};
            const result = reducer(initialState, calcBaseAmount(payload));
            return expect(result).toEqual(initialState);
        });

        it('should calc correct base amount if amount and rate are present', () => {
            const payload = {amount: '10.101', rate: 2};
            const nextState = {...initialState, baseAmount: '5.05'};
            const result = reducer(initialState, calcBaseAmount(payload));
            return expect(result).toEqual(nextState);
        });
    });

    describe('calcTargetAmount', () => {
        it('should calc correct target amount if amount is zero', () => {
            const payload = {amount: '0', rate: 5.15};
            const result = reducer(initialState, calcTargetAmount(payload));
            return expect(result).toEqual(initialState);
        });

        it('should calc correct target amount if rate is zero', () => {
            const payload = {amount: '14', rate: 0};
            const result = reducer(initialState, calcTargetAmount(payload));
            return expect(result).toEqual(initialState);
        });

        it('should calc correct target amount if amount is negative', () => {
            const payload = {amount: '-7.15', rate: 5};
            const result = reducer(initialState, calcTargetAmount(payload));
            return expect(result).toEqual(initialState);
        });

        it('should calc correct target amount if rate is negative', () => {
            const payload = {amount: '10000.10', rate: -1};
            const result = reducer(initialState, calcTargetAmount(payload));
            return expect(result).toEqual(initialState);
        });

        it('should calc correct target amount if amount and rate are present', () => {
            const payload = {amount: '10.101', rate: 2};
            const nextState = {...initialState, targetAmount: '20.20'};
            const result = reducer(initialState, calcTargetAmount(payload));
            return expect(result).toEqual(nextState);
        });
    });
});
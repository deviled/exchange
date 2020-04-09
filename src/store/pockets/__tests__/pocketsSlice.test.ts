import reducer, {
    initialState,
    selectPocketById,
    setAllPockets,
    setBasePocket,
    setIsFetching,
    setTargetPocket,
    updatePocket
} from '../pocketsSlice';
import {mockPockets, rootState} from '../../__mocks__/rootState.mock';

describe('pocketsSlice.ts', () => {
    it('should return the initial state', () => {
        const nextState = initialState;
        const result = reducer(undefined, {type: undefined});
        expect(result).toEqual(nextState);
    });

    describe('selectPocketById ', () => {
        it('should return null if pocket is not found', () => {
            const pocket = selectPocketById(rootState, 4);
            expect(pocket).toBe(null);
        });
    });

    describe('setIsFetching', () => {
        it('should set all pockets', () => {
            const nextState = {...initialState, isFetching: true};
            const result = reducer(initialState, setIsFetching(true));
            expect(result).toEqual(nextState);
        });
    });

    describe('setAllPockets', () => {
        it('should set all pockets', () => {
            const nextState = {...initialState, all: mockPockets};
            const result = reducer(initialState, setAllPockets(mockPockets));
            expect(result).toEqual(nextState);
        });
    });

    describe('setBasePocket', () => {
        it('should set base pocket', () => {
            const nextState = {...initialState, basePocket: mockPockets[1]};
            const result = reducer(initialState, setBasePocket(mockPockets[1]));
            expect(result).toEqual(nextState);
        });

        it('should not set basePocket if newState is undefined', () => {
            const result = reducer(initialState, setBasePocket(undefined));
            expect(result).toEqual(initialState);
        });
    });

    describe('setTargetPocket', () => {
        it('should set target pocket', () => {
            const nextState = {...initialState, targetPocket: mockPockets[0]};
            const result = reducer(initialState, setTargetPocket(mockPockets[0]));
            expect(result).toEqual(nextState);
        });

        it('should not set target pocket if newState is undefined', () => {
            const result = reducer(initialState, setTargetPocket(undefined));
            expect(result).toEqual(initialState);
        });
    });

    describe('updatePocket', () => {
        it('should update only pockets list', () => {
            const state = {...initialState, all: [...mockPockets]};
            const updatedPocket = {...mockPockets[2], balance: '5.00'};
            const result = reducer(state, updatePocket(updatedPocket));
            expect(result.all[2]).toEqual(updatedPocket);
            expect(result.basePocket).toEqual(state.basePocket);
            expect(result.targetPocket).toEqual(state.targetPocket);
        });

        it('should update pockets and basePocket', () => {
            const state = {...initialState, all: [...mockPockets], basePocket: mockPockets[0]};
            const updatedPocket = {...mockPockets[0], balance: '0.00'};
            const result = reducer(state, updatePocket(updatedPocket));
            expect(result.all[0]).toEqual(updatedPocket);
            expect(result.basePocket).toEqual(updatedPocket);
            expect(result.targetPocket).toEqual(state.targetPocket);
        });

        it('should update pockets and targetPocket', () => {
            const state = {...initialState, all: [...mockPockets], targetPocket: mockPockets[1]};
            const updatedPocket = {...mockPockets[1], balance: '1.00'};
            const result = reducer(state, updatePocket(updatedPocket));
            expect(result.all[1]).toEqual(updatedPocket);
            expect(result.targetPocket).toEqual(updatedPocket);
            expect(result.basePocket).toEqual(state.basePocket);
        });
    });
});
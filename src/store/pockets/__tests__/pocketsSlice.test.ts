import thunk, {ThunkDispatch} from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import {AnyAction} from 'redux';
import {PocketsState} from '../types';
import reducer, {
    fetchPockets,
    initialState,
    setAllPockets,
    setBasePocket,
    setIsFetching,
    setTargetPocket,
    updatePocket
} from '../pocketsSlice';
import {mockPockets} from '../__mocks__/pocketsSlice.mock';

type AppDispatch = ThunkDispatch<PocketsState, void, AnyAction>;

const mockStore = configureMockStore<PocketsState, AppDispatch>([thunk]);

jest.mock('../../../utils/api.ts', () => ({
    fetchPockets: jest.fn(() => Promise.resolve(mockPockets)),
}));

describe('pocketsSlice.ts', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should return the initial state', () => {
        const nextState = initialState;
        const result = reducer(undefined, {type: undefined});
        expect(result).toEqual(nextState);
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

    describe('fetchPockets', () => {
        it('should dispatch correct action when pockets are fetched', async () => {
            const store = mockStore(initialState);
            await store.dispatch(fetchPockets());
            const expectedActions =  [
                setIsFetching(true),
                setAllPockets(mockPockets),
                setBasePocket(mockPockets.find(p => p.isMainPocket)),
                setTargetPocket(mockPockets.find(p => !p.isMainPocket)),
                setIsFetching(false),
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
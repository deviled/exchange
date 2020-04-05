import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const loaderSlice = createSlice({
	name: 'isLoading',
	initialState: false,
	reducers: {
		setIsLoading: (state, action: PayloadAction<boolean>) => action.payload,
	}
});

export const {setIsLoading} = loaderSlice.actions;

export default loaderSlice.reducer;

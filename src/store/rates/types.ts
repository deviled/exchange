export interface RatesState {
	current: Record<string, number>;
	base: string;
	fetchingError: string | null;
	isFetching: boolean;
}
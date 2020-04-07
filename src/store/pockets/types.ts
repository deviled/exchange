export interface Pocket {
	id: number | string;
	type: string;
	balance: string;
	symbol: string;
	isMainPocket?: boolean;
}

export interface PocketsState {
	isFetching: boolean;
	all: Pocket[];
	basePocket: Pocket | null;
	targetPocket: Pocket | null;
}


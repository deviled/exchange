export interface Pocket {
	id: number | string;
	type: string;
	balance: number;
	symbol: string;
}

export interface PocketsState {
	isFetching: boolean;
	all: Pocket[];
	basePocket: Pocket | null;
	targetPocket: Pocket | null;
}


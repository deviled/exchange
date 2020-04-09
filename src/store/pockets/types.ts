export interface Pocket {
	id: number;
	type: string;
	balance: string;
	symbol: string;
	isMainPocket?: boolean;
}

export interface PocketsState {
	isFetching: boolean;
	all: Pocket[];
	basePocket: Pocket | undefined;
	targetPocket: Pocket | undefined;
}


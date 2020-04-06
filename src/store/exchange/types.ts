export interface CalcAmount {
	amount: string;
	rate: number | null;
}

export interface ExchangeState {
	baseAmount: string;
	targetAmount: string;
	isTargetInputEdited: boolean;
}

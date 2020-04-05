export interface ExchangeState {
	fromAmount: string;
	toAmount: string;
	base: string;
	rates: Record<string, number>;
}

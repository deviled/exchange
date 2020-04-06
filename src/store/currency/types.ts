export interface CurrencyState {
	rates: Record<string, number> | null;
	base: string;
}
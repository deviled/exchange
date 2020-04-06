// Depends on browsers language
export const formatDecimal = (number: number, maximumFractionDigits?: number) => {
	return Intl.NumberFormat(navigator.language, {
		maximumFractionDigits,
		useGrouping: false,
	}).format(number);
};

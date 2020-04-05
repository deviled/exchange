// Depends on browsers language
export const currencyFormatter = Intl.NumberFormat(navigator.language, {
	useGrouping: false,
	maximumFractionDigits: 2,
});
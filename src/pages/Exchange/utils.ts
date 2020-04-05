import { Pocket } from "../../store/pockets/types"

export const pocketsToOptions = (pocket: Pocket) => ({
	value: pocket.id,
	label: pocket.type,
});
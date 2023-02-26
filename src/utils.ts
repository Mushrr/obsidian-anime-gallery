export function urlSearchParamSerialize(params: object) {
	let paramStr = "";
	for (const [key, value] of Object.entries(params)) {
		paramStr += `${key}=${value}&`
	}
	return paramStr.slice(0, -1);
}

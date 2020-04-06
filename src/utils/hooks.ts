import useDeepCompareEffect from 'use-deep-compare-effect';
import {useEffect, useRef} from 'react';

export const useInterval = (
	callback: Function,
	milliseconds = 0,
	deps: any[] = []
) => {
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useDeepCompareEffect(() => {
		const intervalId = setInterval(callbackRef.current, milliseconds);
		return () => clearInterval(intervalId);
	}, [milliseconds, ...deps]);
};

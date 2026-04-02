import { useRef, useCallback, useEffect } from 'react';

/**
 * Returns a debounced version of `callback`.
 * Call the returned function freely – it only fires after `delay` ms of silence.
 */
export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
): T {
  const timer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cbRef   = useRef(callback);

  // Keep ref current without restarting the debounce
  useEffect(() => { cbRef.current = callback; }, [callback]);

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => cbRef.current(...args), delay);
    },
    [delay],
  ) as T;

  return debounced;
}

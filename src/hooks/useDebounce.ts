import { useEffect, useState } from "react";

export function useDebounce(value: string | null | undefined, delay: number) {
  const [debounceValue, setDebounceValue] = useState<string | null>();
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debounceValue;
}

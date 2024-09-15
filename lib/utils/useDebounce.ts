import { useState, useEffect } from "react";

// Custom hook to debounce any fast-changing value
export const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
  
    useEffect(() => {
      // Set a timeout to update the debounced value after the delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
  
      // Cleanup the timeout if the effect is called again (e.g., value changes)
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]); // Only re-run if value or delay changes
  
    return debouncedValue;
  };
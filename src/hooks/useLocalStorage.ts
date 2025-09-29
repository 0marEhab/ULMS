import { useState } from "react";

/**
 * Custom hook for managing local storage with state synchronization
 * @param key - The localStorage key
 * @param initialValue - Initial value if nothing in localStorage
 * @returns [value, setValue] tuple
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
) => {
  const [storedValue, setStoredValue] =
    useState<T>(() => {
      try {
        const item =
          window.localStorage.getItem(key);
        return item
          ? JSON.parse(item)
          : initialValue;
      } catch (error) {
        console.error(
          `Error reading localStorage key "${key}":`,
          error
        );
        return initialValue;
      }
    });

  const setValue = (
    value: T | ((val: T) => T)
  ) => {
    try {
      const valueToStore =
        value instanceof Function
          ? value(storedValue)
          : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(
        key,
        JSON.stringify(valueToStore)
      );
    } catch (error) {
      console.error(
        `Error setting localStorage key "${key}":`,
        error
      );
    }
  };

  return [storedValue, setValue] as const;
};

import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        const today = new Date().toDateString();
        // Reset if it's a new day (for daily progress)
        if (parsed.date === today) {
          return parsed.data;
        }
      }
      return initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      const today = new Date().toDateString();
      window.localStorage.setItem(key, JSON.stringify({ date: today, data: valueToStore }));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

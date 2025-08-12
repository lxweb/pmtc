import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para almacenar nuestro valor
  // Pasa la función inicializadora a useState para que solo se ejecute una vez
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Función para obtener el valor actual del localStorage
  const getValue = useCallback(() => {
    if (typeof window === "undefined") {
      return storedValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : storedValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return storedValue;
    }
  }, [key, storedValue]);

  // Función para limpiar el localStorage
  const clearValue = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(key);
        setStoredValue(initialValue);
      } catch (error) {
        console.error(`Error clearing localStorage key "${key}":`, error);
      }
    }
  }, [key, initialValue]);

  // Función para verificar si existe el valor en localStorage
  const hasValue = useCallback(() => {
    if (typeof window === "undefined") {
      return false;
    }
    try {
      return window.localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Error checking localStorage key "${key}":`, error);
      return false;
    }
  }, [key]);

  // Retorna una versión envuelta de la función setter de useState que persiste
  // el nuevo valor en localStorage.
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Permite que el valor sea una función para que tengamos la misma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      // Guarda en localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Sincronizar con cambios en localStorage desde otras pestañas
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, { getValue, clearValue, hasValue }] as const;
}

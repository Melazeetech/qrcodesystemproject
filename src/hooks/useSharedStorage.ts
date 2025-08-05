import { useState, useEffect } from 'react';

// Simulated server storage for demo purposes
// In production, this would be replaced with actual API calls
class SharedStorage {
  private static instance: SharedStorage;
  private storage: Map<string, any> = new Map();
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  static getInstance(): SharedStorage {
    if (!SharedStorage.instance) {
      SharedStorage.instance = new SharedStorage();
    }
    return SharedStorage.instance;
  }

  set(key: string, value: any): void {
    this.storage.set(key, value);
    // Notify all listeners
    const keyListeners = this.listeners.get(key);
    if (keyListeners) {
      keyListeners.forEach(callback => callback(value));
    }
    // Also store in localStorage as backup
    localStorage.setItem(`shared-${key}`, JSON.stringify(value));
  }

  get(key: string): any {
    let value = this.storage.get(key);
    if (!value) {
      // Try to get from localStorage
      const stored = localStorage.getItem(`shared-${key}`);
      if (stored) {
        try {
          value = JSON.parse(stored);
          this.storage.set(key, value);
        } catch (e) {
          console.error('Error parsing stored data:', e);
        }
      }
    }
    return value;
  }

  subscribe(key: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      const keyListeners = this.listeners.get(key);
      if (keyListeners) {
        keyListeners.delete(callback);
      }
    };
  }

  // Simulate real-time sync by polling localStorage
  startSync(): void {
    setInterval(() => {
      // Check for changes in localStorage from other tabs/devices
      for (const [key] of this.listeners) {
        const stored = localStorage.getItem(`shared-${key}`);
        if (stored) {
          try {
            const parsedValue = JSON.parse(stored);
            const currentValue = this.storage.get(key);
            
            // Simple comparison - in production, use proper deep comparison
            if (JSON.stringify(parsedValue) !== JSON.stringify(currentValue)) {
              this.storage.set(key, parsedValue);
              const keyListeners = this.listeners.get(key);
              if (keyListeners) {
                keyListeners.forEach(callback => callback(parsedValue));
              }
            }
          } catch (e) {
            console.error('Error syncing data:', e);
          }
        }
      }
    }, 1000); // Check every second
  }
}

const sharedStorage = SharedStorage.getInstance();
sharedStorage.startSync();

export function useSharedStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const value = sharedStorage.get(key);
    return value !== undefined ? value : initialValue;
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      sharedStorage.set(key, valueToStore);
    } catch (error) {
      console.error(`Error setting shared storage key "${key}":`, error);
    }
  };

  useEffect(() => {
    // Subscribe to changes
    const unsubscribe = sharedStorage.subscribe(key, (newValue) => {
      setStoredValue(newValue);
    });

    return unsubscribe;
  }, [key]);

  return [storedValue, setValue] as const;
}
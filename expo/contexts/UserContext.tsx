import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

const USERNAME_KEY = 'aismartkheti_username';
const LOCATION_KEY = 'aismartkheti_location';

export const [UserProvider, useUser] = createContextHook(() => {
  const [username, setUsernameState] = useState<string | null>(null);
  const [location, setLocationState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(USERNAME_KEY),
      AsyncStorage.getItem(LOCATION_KEY),
    ]).then(([name, loc]) => {
      setUsernameState(name);
      setLocationState(loc);
      setIsLoading(false);
    });
  }, []);

  const setUsername = useCallback((name: string) => {
    const trimmed = name.trim();
    setUsernameState(trimmed);
    AsyncStorage.setItem(USERNAME_KEY, trimmed);
  }, []);

  const setLocation = useCallback((state: string) => {
    setLocationState(state);
    AsyncStorage.setItem(LOCATION_KEY, state);
  }, []);

  const logout = useCallback(() => {
    setUsernameState(null);
    AsyncStorage.removeItem(USERNAME_KEY);
  }, []);

  return {
    username,
    location,
    isLoading,
    isLoggedIn: !!username,
    setUsername,
    setLocation,
    logout,
  };
});

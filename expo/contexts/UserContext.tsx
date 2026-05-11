import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

const USERNAME_KEY = 'aismartkheti_username';

async function loadUsername(): Promise<string | null> {
  return AsyncStorage.getItem(USERNAME_KEY);
}

async function saveUsername(name: string): Promise<void> {
  await AsyncStorage.setItem(USERNAME_KEY, name);
}

async function clearUsername(): Promise<void> {
  await AsyncStorage.removeItem(USERNAME_KEY);
}

export const [UserProvider, useUser] = createContextHook(() => {
  const [username, setUsernameState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsername().then(name => {
      setUsernameState(name);
      setIsLoading(false);
    });
  }, []);

  const setUsername = useCallback((name: string) => {
    const trimmed = name.trim();
    setUsernameState(trimmed);
    saveUsername(trimmed);
  }, []);

  const logout = useCallback(() => {
    setUsernameState(null);
    clearUsername();
  }, []);

  return {
    username,
    isLoading,
    isLoggedIn: !!username,
    setUsername,
    logout,
  };
});

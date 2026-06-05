import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

const USERNAME_KEY = 'aismartkheti_username';
const LOCATION_KEY = 'aismartkheti_location';
const LANGUAGE_KEY = 'aismartkheti_language';
const PROFILE_IMAGE_KEY = 'aismartkheti_profile_image';

export const [UserProvider, useUser] = createContextHook(() => {
  const [username, setUsernameState] = useState<string | null>(null);
  const [location, setLocationState] = useState<string | null>(null);
  const [language, setLanguageState] = useState<string | null>(null);
  const [profileImage, setProfileImageState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(USERNAME_KEY),
      AsyncStorage.getItem(LOCATION_KEY),
      AsyncStorage.getItem(LANGUAGE_KEY),
      AsyncStorage.getItem(PROFILE_IMAGE_KEY),
    ]).then(([name, loc, lang, img]) => {
      setUsernameState(name);
      setLocationState(loc);
      setLanguageState(lang);
      setProfileImageState(img);
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

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
    AsyncStorage.setItem(LANGUAGE_KEY, lang);
  }, []);

  const setProfileImage = useCallback((uri: string | null) => {
    setProfileImageState(uri);
    if (uri) {
      AsyncStorage.setItem(PROFILE_IMAGE_KEY, uri);
    } else {
      AsyncStorage.removeItem(PROFILE_IMAGE_KEY);
    }
  }, []);

  const logout = useCallback(() => {
    setUsernameState(null);
    setProfileImageState(null);
    AsyncStorage.removeItem(USERNAME_KEY);
    AsyncStorage.removeItem(PROFILE_IMAGE_KEY);
  }, []);

  return {
    username,
    location,
    language,
    profileImage,
    isLoading,
    isLoggedIn: !!username,
    setUsername,
    setLocation,
    setLanguage,
    setProfileImage,
    logout,
  };
});

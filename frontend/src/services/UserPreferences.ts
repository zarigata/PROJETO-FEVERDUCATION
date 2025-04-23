/**
 * CODEX: UserPreferences Service
 * Manages user preferences like theme, language, etc.
 * Persists preferences to localStorage and optionally to backend
 */

import api from '../api';

export interface UserPreferences {
  theme: string;
  language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: '/styles/presets/light.css',
  language: 'en'
};

export const savePreferences = async (preferences: Partial<UserPreferences>): Promise<void> => {
  try {
    // Get current preferences from localStorage
    const currentPrefs = getPreferences();
    
    // Merge with new preferences
    const updatedPrefs = { ...currentPrefs, ...preferences };
    
    // Save to localStorage
    localStorage.setItem('userPreferences', JSON.stringify(updatedPrefs));
    
    // If user is logged in, save to backend
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await api.post('/user/preferences', updatedPrefs);
      } catch (error) {
        console.error('Failed to save preferences to server:', error);
        // Continue anyway since we saved to localStorage
      }
    }
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
};

export const getPreferences = (): UserPreferences => {
  try {
    const savedPrefs = localStorage.getItem('userPreferences');
    if (savedPrefs) {
      return JSON.parse(savedPrefs);
    }
  } catch (error) {
    console.error('Error retrieving preferences:', error);
  }
  return DEFAULT_PREFERENCES;
};

export const loadPreferencesFromServer = async (): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const response = await api.get('/user/preferences');
      if (response.data) {
        // Merge with defaults to ensure all fields exist
        const serverPrefs = { ...DEFAULT_PREFERENCES, ...response.data };
        localStorage.setItem('userPreferences', JSON.stringify(serverPrefs));
      }
    }
  } catch (error) {
    console.error('Failed to load preferences from server:', error);
    // Continue with localStorage preferences
  }
};

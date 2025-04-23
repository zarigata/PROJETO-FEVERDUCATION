/**
 * CODEX: Main entry point for FeverDucation application
 * Sets up React with routing, i18n, and theme initialization
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import i18n from './i18n';
import './i18n';

// Import global styles
import './styles/index.css';
import './styles/animations.css';
import './styles/components.css';

// Initialize theme from localStorage or default to light theme
const initializeTheme = () => {
  try {
    const savedPrefs = localStorage.getItem('userPreferences');
    if (savedPrefs) {
      const { theme } = JSON.parse(savedPrefs);
      if (theme) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.id = 'theme-css';
        link.href = theme;
        document.head.appendChild(link);
        return;
      }
    }
    // Default theme if no saved preference
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.id = 'theme-css';
    link.href = '/styles/presets/light.css';
    document.head.appendChild(link);
  } catch (error) {
    console.error('Error initializing theme:', error);
    // Fallback to light theme
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.id = 'theme-css';
    link.href = '/styles/presets/light.css';
    document.head.appendChild(link);
  }
};

// Initialize theme before rendering
initializeTheme();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>
);

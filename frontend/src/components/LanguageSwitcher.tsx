import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPreferences, savePreferences } from '../services/UserPreferences';

/**
 * CODEX: Enhanced LanguageSwitcher Component
 * Provides a visually appealing language selection interface with flags
 * Persists language preferences to localStorage and backend
 */
const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  
  // Initialize language from preferences on component mount
  useEffect(() => {
    const userPrefs = getPreferences();
    if (userPrefs.language && userPrefs.language !== i18n.language) {
      i18n.changeLanguage(userPrefs.language);
    }
  }, []);
  
  // Handle language change and persist preference
  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang);
    savePreferences({ language: lang });
  };
  
  // Language options with flags and labels
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'jp', name: '日本語', flag: '🇯🇵' }
  ];
  
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => changeLang(lang.code)}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${i18n.language === lang.code 
              ? 'bg-[var(--primary-color)] text-white font-medium shadow-md' 
              : 'bg-[var(--bg-color-hover)] text-[var(--text-color)] hover:bg-[var(--border-color)]'}`}
          >
            <span className="mr-2 text-lg" role="img" aria-label={lang.name}>{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-[var(--text-color)] opacity-70">
        {t('language_help_text')}
      </p>
    </div>
  );
};

export default LanguageSwitcher;

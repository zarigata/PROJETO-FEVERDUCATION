import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * CODEX: Language Settings Panel
 * Styled language selector for settings page, matching the UI style in the screenshot
 */
const LANGUAGES = [
  { code: 'en', label: 'English', flag: 'US' },
  { code: 'pt', label: 'Português', flag: 'BR' },
  { code: 'jp', label: '日本語', flag: 'JP' },
  // Add more languages as needed
];

const LanguageSettings: React.FC = () => {
  const { i18n, t } = useTranslation();
  const current = i18n.language;

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
  };

  return (
    <div className="p-8 bg-[var(--card-bg)] rounded-2xl shadow max-w-4xl mx-auto mt-6">
      <h2 className="text-3xl font-bold text-[var(--text-color)] mb-6">{t('language_settings') || 'Language Settings'}</h2>
      <div className="flex gap-8 items-center mb-4">
        {LANGUAGES.map(lang => (
          <button
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className={`px-6 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 border-none transition-all duration-200 focus:outline-none ${current === lang.code ? 'bg-[var(--primary-color)] text-white shadow-lg scale-105' : 'bg-transparent text-[var(--text-color)] hover:bg-[var(--border-color)]'}`}
          >
            <span className="text-base font-bold mr-2">{lang.flag}</span> {lang.label}
          </button>
        ))}
      </div>
      <p className="text-[var(--text-color)] opacity-70 mt-2">{t('choose_language_hint') || 'Choose your preferred language for the interface'}</p>
    </div>
  );
};

export default LanguageSettings;

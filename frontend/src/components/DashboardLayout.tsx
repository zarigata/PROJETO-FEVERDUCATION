import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CSSSettings from './CSSSettings';
import LanguageSwitcher from './LanguageSwitcher';

// CODEX: DashboardLayout.tsx - Provides a consistent dashboard layout with header and logout functionality

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<LayoutProps> = ({ title, children }) => {
  // CODEX: useNavigate hook to redirect users
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const handleLogout = () => {
    // CODEX: Remove user token from storage and navigate to login
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-color)] transition-colors duration-300">
      {/* CODEX: Header section with title and action buttons - Enhanced with Material Design */}
      <header className="bg-[var(--primary-color)] text-white px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-10 transition-colors duration-300">
        <h1 className="text-2xl font-bold tracking-wide">{title}</h1>
        <div className="flex items-center space-x-4">
          {/* CODEX: Settings button to toggle preferences panel */}
          <button 
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="bg-white/20 text-white px-3 py-2 rounded-lg font-medium hover:bg-white/30 flex items-center transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            {t('settings')}
          </button>
          
          {/* CODEX: Logout button to clear session and redirect */}
          <button 
            onClick={handleLogout} 
            className="bg-white text-[var(--primary-color)] px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transform hover:scale-105 transition-all duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 2.414L15.414 7H10V5.414z" clipRule="evenodd" />
              <path d="M10 7h5v2h-5v5h5v-2h2v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h6v2H5v10h10v-4h-5V7z" />
            </svg>
            {t('logout')}
          </button>
        </div>
      </header>
      
      {/* CODEX: Settings panel that slides down when activated */}
      {settingsOpen && (
        <div className="bg-[var(--card-bg)] border-b border-[var(--border-color)] shadow-md transition-all duration-300 animate-slideDown">
          <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-[var(--bg-color)] p-4 rounded-lg shadow-inner border border-[var(--border-color)] transition-colors duration-300">
              <h3 className="text-lg font-medium text-[var(--text-color)] mb-3">{t('theme_settings')}</h3>
              <CSSSettings />
            </div>
            <div className="card bg-[var(--bg-color)] p-4 rounded-lg shadow-inner border border-[var(--border-color)] transition-colors duration-300">
              <h3 className="text-lg font-medium text-[var(--text-color)] mb-3">{t('language_settings')}</h3>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
      
      {/* CODEX: Main content area for dashboard pages - Improved spacing and responsiveness */}
      <main className="p-6 max-w-7xl mx-auto transition-all duration-300 flex-grow">
        {children}
      </main>
      
      {/* CODEX: Footer for additional branding or info - Fixed at bottom */}
      <footer className="bg-[var(--card-bg)] text-[var(--text-color)] py-4 text-sm shadow-inner transition-colors duration-300 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-3 md:mb-0">
            <span className="font-medium">FeverDucation</span>
            <span className="mx-2">©</span>
            <span>{new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors duration-300">{t('terms')}</a>
            <a href="#" className="text-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors duration-300">{t('privacy')}</a>
            <a href="#" className="text-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors duration-300">{t('help')}</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;

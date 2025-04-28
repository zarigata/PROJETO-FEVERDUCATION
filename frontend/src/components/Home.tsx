import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

/**
 * CODEX: Home Component
 * Marketing landing page for FeverDucation with overview and CTAs
 */
const Home: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex flex-col items-center justify-center text-center p-8 space-y-6 transition-colors duration-300">
      <h1 className="text-5xl font-extrabold text-[var(--primary-color)]">FeverDucation</h1>
      <p className="text-xl text-[var(--text-color)] max-w-2xl">
        Empowering educators and students with AI-driven lessons, interactive tutoring, and real-time analytics. Transform learning experiences with the power of tomorrow's technology.
      </p>
      <div className="flex gap-4">
        <Link to="/login" className="bg-[var(--primary-color)] text-white px-6 py-3 rounded-lg hover:bg-[var(--secondary-color)] transition-colors duration-300">
          {t('login')}
        </Link>
        {process.env.REACT_APP_ENABLE_REGISTER === 'true' && (
          <Link to="/register" className="bg-[var(--bg-color-hover)] text-[var(--text-color)] border border-[var(--border-color)] px-6 py-3 rounded-lg hover:bg-[var(--border-color)] transition-colors duration-300">
            {t('register')}
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;

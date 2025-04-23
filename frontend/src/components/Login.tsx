import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);
      const res = await api.post('/auth/login', params);
      const { access_token } = res.data;
      localStorage.setItem('token', access_token);
      // determine user role
      const me = await api.get('/auth/me');
      const role = me.data.role;
      const path = role === 'admin' ? '/admin' : role === 'teacher' ? '/teacher' : '/student';
      navigate(path);
    } catch {
      alert(t('login_error'));
    }
  };

  const [userType, setUserType] = useState<'teacher' | 'student'>('teacher');

  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center transition-colors duration-300 p-4">
      {/* CODEX: Enhanced login card with dynamic segmented control for user type */}
      <div className="relative">
        <div className="absolute -top-12 left-0 right-0 flex justify-center">
          <a href="#" className="flex items-center text-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            {t('back_to_home')}
          </a>
        </div>

        <div className="card w-full max-w-md bg-[var(--card-bg)] p-8 space-y-6 shadow-2xl rounded-2xl animate-fade-in border border-[var(--border-color)] transition-all duration-300">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-[var(--text-color)] transition-colors duration-300">{t('welcome_back')}</h2>
            <p className="mt-2 text-sm text-[var(--text-color)] opacity-80 transition-colors duration-300">
              {t('login_to_your_account')}
            </p>
          </div>
          
          {/* User type selector */}
          <div className="relative bg-[var(--bg-color)] rounded-full p-1 flex shadow-inner border border-[var(--border-color)] transition-all duration-300">
            <button 
              onClick={() => setUserType('teacher')}
              className={`flex-1 py-2 px-4 rounded-full text-center transition-all duration-300 ${userType === 'teacher' ? 'bg-[var(--primary-color)] text-white font-medium shadow-md' : 'text-[var(--text-color)] hover:bg-[var(--bg-color-hover)]'}`}
            >
              {t('teacher')}
            </button>
            <button 
              onClick={() => setUserType('student')}
              className={`flex-1 py-2 px-4 rounded-full text-center transition-all duration-300 ${userType === 'student' ? 'bg-[var(--primary-color)] text-white font-medium shadow-md' : 'text-[var(--text-color)] hover:bg-[var(--bg-color-hover)]'}`}
            >
              {t('student')}
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--text-color)] transition-colors duration-300">{t('email')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--text-color)] opacity-60" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="you.email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 p-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg text-[var(--text-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-[var(--text-color)] transition-colors duration-300">{t('password')}</label>
                <a href="#" className="text-sm text-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors duration-300">
                  {t('forgot_password')}
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--text-color)] opacity-60" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 p-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg text-[var(--text-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[var(--primary-color)] text-white p-3 rounded-lg font-medium hover:bg-[var(--secondary-color)] transform hover:scale-102 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {t('login')}
            </button>
          </form>
          
          <div className="text-center pt-4 border-t border-[var(--border-color)] mt-6">
            <p className="text-sm text-[var(--text-color)] opacity-70 transition-colors duration-300">
              {t('dont_have_account')} 
              <a href="/register" className="text-[var(--primary-color)] hover:text-[var(--secondary-color)] font-medium transition-colors duration-300 ml-1">
                {t('register')}  
              </a>
            </p>
          </div>
          
          <div className="text-center text-xs text-[var(--text-color)] opacity-50 transition-colors duration-300 mt-8">
            <p>FeverDucation © {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

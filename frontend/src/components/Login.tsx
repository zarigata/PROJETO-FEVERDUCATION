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

  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center transition-colors duration-300 p-4">
      <div className="card w-full max-w-md p-8 space-y-8 shadow-2xl animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[var(--text-color)] transition-colors duration-300">{t('login')}</h2>
          <p className="mt-2 text-sm text-[var(--text-color)] opacity-80 transition-colors duration-300">Welcome to FeverDucation</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder={t('email') as string}
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full mb-3 p-3 border rounded-lg text-[var(--text-color)] focus:ring-2 focus:ring-[var(--primary-color)] transition-all duration-200"
          />
          <input
            type="password"
            placeholder={t('password') as string}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full mb-3 p-3 border rounded-lg text-[var(--text-color)] focus:ring-2 focus:ring-[var(--primary-color)] transition-all duration-200"
          />
          <button type="submit" className="w-full bg-[var(--primary-color)] text-white p-3 rounded-lg font-medium hover:bg-[var(--secondary-color)] transform hover:scale-102 transition-all duration-200">
            {t('login')}
          </button>
        </form>
        <div className="text-center text-sm text-[var(--text-color)] opacity-70 transition-colors duration-300">
          <p>FeverDucation {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

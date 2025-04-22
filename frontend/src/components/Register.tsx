import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import api from '../api';
import { useTranslation } from 'react-i18next';

/**
 * CODEX: Simple registration page.
 * Toggle via REACT_APP_ENABLE_REGISTER env var.
 */
const Register: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // send JSON payload to match FastAPI
      const payload = { email, password };
      const res = await api.post('/auth/register', payload);
      console.log('register response', res.data);
      alert(t('register_success'));
      navigate('/login');
    } catch (error) {
      console.error('register error', error);
      alert(t('register_error'));
    }
  };

  if (process.env.REACT_APP_ENABLE_REGISTER !== 'true') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h1 className="text-2xl mb-4 text-center">{t('register')}</h1>
        <input
          type="email"
          placeholder={t('email') as string}
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          placeholder={t('password') as string}
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
          {t('register')}
        </button>
      </form>
    </div>
  );
};

export default Register;

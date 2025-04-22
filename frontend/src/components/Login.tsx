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
      const res = await api.post('/auth/login', null, { params: { username: email, password } });
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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h1 className="text-2xl mb-4 text-center">{t('login')}</h1>
        <input
          type="email"
          placeholder={t('email')}
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          placeholder={t('password')}
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          {t('login')}
        </button>
      </form>
    </div>
  );
};

export default Login;

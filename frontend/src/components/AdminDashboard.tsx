import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api';
import CSSSettings from './CSSSettings';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({ email: '', password: '', role: 'student', timezone: 'UTC', language: 'en' });

  useEffect(() => {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') return;
    api.get('/users').then(res => setUsers(res.data));
    api.get('/audit_logs').then(res => setLogs(res.data));
    api.get('/').then(res => setStatus(res.data.message));
  }, []);

  const createUser = async () => {
    const res = await api.post('/users', form);
    setUsers(prev => [...prev, res.data]);
  };

  const deleteUser = async (id: number) => {
    await api.delete(`/users/${id}`);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return <div className="p-8">{t('access_denied_local')}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">{t('admin_dashboard')}</h1>
      <CSSSettings />
      <section className="mb-6">
        <h2 className="text-xl mb-2">{t('users')}</h2>
        <div className="mb-4 space-y-2">
          <input type="email" placeholder={t('email')} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border p-1 mr-2" />
          <input type="password" placeholder={t('password')} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="border p-1 mr-2" />
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="border p-1 mr-2">
            <option value="student">{t('student_dashboard')}</option>
            <option value="teacher">{t('teacher_dashboard')}</option>
            <option value="admin">{t('admin_dashboard')}</option>
          </select>
          <select value={form.timezone} onChange={e => setForm({ ...form, timezone: e.target.value })} className="border p-1 mr-2">
            <option value="UTC">UTC</option>
          </select>
          <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} className="border p-1 mr-2">
            <option value="en">EN</option>
            <option value="pt">PT</option>
            <option value="jp">JP</option>
          </select>
          <button onClick={createUser} className="bg-green-500 text-white px-3 rounded">{t('generate')}</button>
        </div>
        <ul className="list-disc list-inside">
          {users.map(u => (
            <li key={u.id} className="flex justify-between">
              <span>{u.email} ({u.role})</span>
              <button onClick={() => deleteUser(u.id)} className="text-red-500 ml-2">X</button>
            </li>
          ))}
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl mb-2">{t('audit_logs')}</h2>
        <ul className="list-disc list-inside">
          {logs.map((log, i) => (
            <li key={i}>{JSON.stringify(log)}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl mb-2">{t('system_status')}</h2>
        <p>{status}</p>
      </section>
    </div>
  );
};

export default AdminDashboard;

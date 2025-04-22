import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api';
import DashboardLayout from './DashboardLayout';
import TabNav from './TabNav';
import CSSSettings from './CSSSettings';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const tabs = [
    { key: 'users', label: t('users') },
    { key: 'audit_logs', label: t('audit_logs') },
    { key: 'system_status', label: t('system_status') },
    { key: 'settings', label: 'Settings' },
  ];
  const [activeTab, setActiveTab] = useState<string>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [status, setStatus] = useState<string>('');
  const [form, setForm] = useState({ email: '', password: '', role: 'student', timezone: 'UTC', language: 'en' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, logsRes, statusRes] = await Promise.all([
          api.get('/users'),
          api.get('/audit'),
          api.get('/status'),
        ]);
        setUsers(usersRes.data);
        setLogs(logsRes.data);
        setStatus(JSON.stringify(statusRes.data, null, 2));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/users', form);
      setUsers(prev => [...prev, res.data]);
      setForm({ email: '', password: '', role: 'student', timezone: 'UTC', language: 'en' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout title={t('admin_dashboard')}>
      <div className="space-y-6 transition-all duration-300">
        <TabNav tabs={tabs} active={activeTab} onChange={setActiveTab} />
        <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-md card transition-colors duration-300">
          {activeTab === 'users' && (
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">{t('user_management')}</h2>
              <form onSubmit={createUser} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="email" value={form.email} onChange={handleInput} placeholder="Email" className="p-2 border rounded-lg" />
                <input name="password" type="password" value={form.password} onChange={handleInput} placeholder="Password" className="p-2 border rounded-lg" />
                <select name="role" value={form.role} onChange={handleInput} className="p-2 border rounded-lg text-[var(--text-color)] transition-colors duration-300">
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="md:col-span-3">
                  <button type="submit" className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--secondary-color)] transition-all duration-200 font-medium transform hover:scale-102">
                    Create User
                  </button>
                </div>
              </form>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-[var(--border-color)] transition-colors duration-300">
                  <thead className="bg-[var(--bg-color)] transition-colors duration-300">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">Timezone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">Language</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[var(--card-bg)] divide-y divide-[var(--border-color)] transition-colors duration-300">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-[var(--bg-color)] transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">{user.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">{user.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">{user.timezone || 'UTC'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">{user.language || 'en'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          {activeTab === 'audit_logs' && (
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">{t('audit_logs')}</h2>
              <div className="max-h-96 overflow-y-auto border border-[var(--border-color)] rounded-lg transition-colors duration-300">
                <ul className="divide-y divide-[var(--border-color)] transition-colors duration-300">
                  {logs.map((log, i) => (
                    <li key={i} className="p-4 text-[var(--text-color)] hover:bg-[var(--bg-color)] transition-colors duration-200">{JSON.stringify(log)}</li>
                  ))}
                </ul>
              </div>
            </section>
          )}
          {activeTab === 'system_status' && (
            <section>
              <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">{t('system_status')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[var(--bg-color)] p-4 rounded-lg shadow-inner border border-[var(--border-color)] transition-colors duration-300">
                  <h3 className="font-medium text-[var(--text-color)] mb-2">System Metrics</h3>
                  <pre className="whitespace-pre-wrap text-[var(--text-color)]">{status}</pre>
                </div>
                <div className="bg-[var(--bg-color)] p-4 rounded-lg shadow-inner border border-[var(--border-color)] transition-colors duration-300">
                  <h3 className="font-medium text-[var(--text-color)] mb-2">Placeholder: Database Status</h3>
                  <p className="text-[var(--text-color)] opacity-70">This section will display database connection status and performance metrics.</p>
                </div>
                <div className="bg-[var(--bg-color)] p-4 rounded-lg shadow-inner border border-[var(--border-color)] transition-colors duration-300">
                  <h3 className="font-medium text-[var(--text-color)] mb-2">Placeholder: Server Uptime</h3>
                  <p className="text-[var(--text-color)] opacity-70">This section will show server uptime and load statistics.</p>
                </div>
                <div className="bg-[var(--bg-color)] p-4 rounded-lg shadow-inner border border-[var(--border-color)] transition-colors duration-300">
                  <h3 className="font-medium text-[var(--text-color)] mb-2">Placeholder: API Endpoints Health</h3>
                  <p className="text-[var(--text-color)] opacity-70">This section will provide health checks for all API endpoints.</p>
                </div>
              </div>
            </section>
          )}
          {activeTab === 'settings' && (
            <section>
              <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">Admin Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-[var(--bg-color)] p-6 rounded-lg shadow-md border border-[var(--border-color)] transition-colors duration-300">
                  <h3 className="text-xl font-medium text-[var(--text-color)] mb-4">CSS Theme Settings</h3>
                  <CSSSettings />
                </div>
                <div className="card bg-[var(--bg-color)] p-6 rounded-lg shadow-md border border-[var(--border-color)] transition-colors duration-300">
                  <h3 className="text-xl font-medium text-[var(--text-color)] mb-4">Placeholder: Advanced Settings</h3>
                  <p className="text-[var(--text-color)] opacity-70 mb-4">This section will allow configuration of advanced system settings and user permissions.</p>
                  <button className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--secondary-color)] transition-all duration-200 font-medium transform hover:scale-102 opacity-50" disabled>
                    Configure Advanced Settings
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

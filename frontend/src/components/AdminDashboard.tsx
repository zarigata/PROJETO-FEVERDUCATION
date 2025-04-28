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
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Trigger global search on server
  const handleSearch = async () => {
    try {
      const res = await api.get('/users', { params: { search: searchTerm } });
      setUsers(res.data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Fetch users independently
      try {
        const usersRes = await api.get('/users');
        setUsers(usersRes.data);
      } catch (err) {
        console.error('Failed to load users:', err);
      }
      // Fetch audit logs
      try {
        const logsRes = await api.get('/audit');
        setLogs(logsRes.data);
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      }
      // Fetch system status
      try {
        const statusRes = await api.get('/status');
        setStatus(JSON.stringify(statusRes.data, null, 2));
      } catch (err) {
        console.error('Failed to load system status:', err);
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

  const handleEditClick = (user: any) => {
    setEditingUser(user);
    setForm({ email: user.email, password: '', role: user.role, timezone: user.timezone || 'UTC', language: user.language || 'en' });
  };

  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put(`/users/${editingUser.id}`, form);
      setUsers(prev => prev.map(u => u.id === res.data.id ? res.data : u));
      setEditingUser(null);
      setForm({ email: '', password: '', role: 'student', timezone: 'UTC', language: 'en' });
    } catch (err) {
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setForm({ email: '', password: '', role: 'student', timezone: 'UTC', language: 'en' });
  };

  const deleteUser = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(prev => prev.filter(u => u.id !== id));
      } catch (err) {
        console.error(err);
      }
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
              {editingUser && (
                <form onSubmit={updateUser} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-[var(--bg-color)] p-4 rounded-lg border border-[var(--border-color)]">
                  <input name="email" value={form.email} onChange={handleInput} placeholder="Email" className="p-2 border rounded-lg" />
                  <input name="password" type="password" value={form.password} onChange={handleInput} placeholder="New Password" className="p-2 border rounded-lg" />
                  <select name="role" value={form.role} onChange={handleInput} className="p-2 border rounded-lg">
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                  <input name="timezone" value={form.timezone} onChange={handleInput} placeholder="Timezone" className="p-2 border rounded-lg" />
                  <select name="language" value={form.language} onChange={handleInput} className="p-2 border rounded-lg">
                    <option value="en">English</option>
                    <option value="pt">Português</option>
                    <option value="jp">日本語</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                  <div className="md:col-span-3 flex gap-2">
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg">Save</button>
                    <button type="button" onClick={cancelEdit} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>
                  </div>
                </form>
              )}
              {/* Global user search */}
              <div className="mb-4 flex items-center gap-2">
                <input
                  type="text"
                  placeholder={t('search_users') as string}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="border p-2 rounded w-full max-w-sm"
                />
                <button onClick={handleSearch} className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg">
                  {t('search')}
                </button>
              </div>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-[var(--border-color)] transition-colors duration-300">
                  <thead className="bg-[var(--bg-color)] transition-colors duration-300">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">Timezone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">Language</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">Classrooms</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">Actions</th>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">
                          {/* CODEX: Show classrooms for each user */}
                          {user.role === 'teacher' && user.taught_classrooms && user.taught_classrooms.length > 0
                            ? user.taught_classrooms.map((c: any) => c.name).join(', ')
                            : user.classrooms && user.classrooms.length > 0
                              ? user.classrooms.map((c: any) => c.name).join(', ')
                              : <span className="opacity-60">-</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">
                          <button onClick={() => handleEditClick(user)} className="text-blue-500 mr-2">Edit</button>
                          <button onClick={() => deleteUser(user.id)} className="text-red-500">Delete</button>
                        </td>
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

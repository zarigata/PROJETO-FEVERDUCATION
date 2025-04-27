import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api';
import DashboardLayout from './DashboardLayout';
import TabNav from './TabNav';
import CSSSettings from './CSSSettings';

// CODEX: SystemStatus type for Admin Dashboard
interface SystemStatus { timestamp: string; db_alive: boolean; user_count: number; }

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const tabs = [
    { key: 'users', label: t('users') as string },
    { key: 'audit_logs', label: t('audit_logs') as string },
    { key: 'system_status', label: t('system_status') as string },
    { key: 'settings', label: t('settings') as string },
  ];
  const [activeTab, setActiveTab] = useState<string>('users');
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [filterEmail, setFilterEmail] = useState<string>('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [logs, setLogs] = useState<any[]>([]);
  const [form, setForm] = useState({ email: '', password: '', role: 'student', timezone: 'UTC', language: 'en' });
  const [editingUser, setEditingUser] = useState<any | null>(null);

  // Compute users based on email and role filters
  const displayedUsers = users.filter(u => u.email.includes(filterEmail) && (filterRole === 'all' || u.role === filterRole));

  // CODEX: Bulk selection and pagination state
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const totalPages = Math.ceil(displayedUsers.length / pageSize);
  const paginatedUsers = displayedUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // CODEX: Bulk actions
  const deleteSelected = async () => {
    if (window.confirm(t('confirm_bulk_delete') as string)) {
      for (const id of selectedUsers) await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)));
      setSelectedUsers([]);
    }
  };
  const exportCSV = () => {
    const rows = users.filter(u => selectedUsers.includes(u.id));
    let csv = 'id,email,role,timezone,language\n';
    rows.forEach(u => { csv += `${u.id},${u.email},${u.role},${u.timezone||'UTC'},${u.language||'en'}\n`; });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'users.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, logsRes, statusRes] = await Promise.all([
          api.get('/users'),
          api.get('/audit_logs'),
          api.get('/status'),
        ]);
        setUsers(usersRes.data);
        setLogs(logsRes.data);
        setSystemStatus(statusRes.data);
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
    <DashboardLayout title={t('admin_dashboard') as string}>
      <div className="space-y-6 transition-all duration-300">
        <TabNav tabs={tabs} active={activeTab} onChange={setActiveTab} />
        <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-md card transition-colors duration-300">
          {activeTab === 'users' && (
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">{t('user_management') as string}</h2>
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  placeholder={t('search_placeholder') as string}
                  value={filterEmail}
                  onChange={e => setFilterEmail(e.target.value)}
                  className="p-2 border rounded"
                  aria-label="Filter by email"
                />
                <select
                  value={filterRole}
                  onChange={e => setFilterRole(e.target.value)}
                  className="p-2 border rounded"
                  aria-label="Filter by role"
                >
                  <option value="all">{t('all') as string}</option>
                  <option value="student">{t('student') as string}</option>
                  <option value="teacher">{t('teacher') as string}</option>
                  <option value="admin">{t('admin') as string}</option>
                </select>
              </div>
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
              {selectedUsers.length > 0 && (
                <div className="flex gap-2 mb-4">
                  <button onClick={deleteSelected} className="bg-red-500 text-white px-4 py-2 rounded">
                    {t('bulk_delete') as string}
                  </button>
                  <button onClick={exportCSV} className="bg-blue-500 text-white px-4 py-2 rounded">
                    {t('export_csv') as string}
                  </button>
                </div>
              )}
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-[var(--border-color)] transition-colors duration-300">
                  <thead className="bg-[var(--bg-color)] transition-colors duration-300">
                    <tr>
                      <th className="px-6 py-3">
                        <input
                          type="checkbox"
                          checked={paginatedUsers.length > 0 && paginatedUsers.every(u => selectedUsers.includes(u.id))}
                          onChange={e => e.target.checked ? setSelectedUsers(paginatedUsers.map(u => u.id)) : setSelectedUsers([])}
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">Timezone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">Language</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[var(--card-bg)] divide-y divide-[var(--border-color)] transition-colors duration-300">
                    {paginatedUsers.map(user => (
                      <tr key={user.id} className="hover:bg-[var(--bg-color)] transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={e => {
                              const checked = e.target.checked;
                              setSelectedUsers(prev =>
                                checked ? [...prev, user.id] : prev.filter(id => id !== user.id)
                              );
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">{user.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">{user.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">{user.timezone || 'UTC'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">{user.language || 'en'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">
                          <button onClick={() => handleEditClick(user)} className="text-blue-500 mr-2">Edit</button>
                          <button onClick={() => deleteUser(user.id)} className="text-red-500">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  {t('previous') as string}
                </button>
                <span>
                  {t('page') as string} {currentPage}/{totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  {t('next') as string}
                </button>
              </div>
            </section>
          )}
          {activeTab === 'audit_logs' && (
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">{t('audit_logs') as string}</h2>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-[var(--border-color)] transition-colors duration-300">
                  <thead className="bg-[var(--bg-color)]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[var(--card-bg)] divide-y divide-[var(--border-color)]">
                    {logs.map(log => (
                      <tr key={log.id} className="hover:bg-[var(--bg-color)] transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">{log.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">{log.user_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">{log.action}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">{new Date(log.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          {activeTab === 'system_status' && (
            <section>
              <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">{t('system_status') as string}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {systemStatus ? (
                  <>
                    <div className="p-4 bg-[var(--bg-color)] rounded-lg border border-[var(--border-color)] transition-colors duration-300">
                      <h3 className="font-medium text-[var(--text-color)] mb-2">{t('db_alive') as string}</h3>
                      <p className="text-lg text-[var(--primary-color)]">{systemStatus.db_alive ? t('active') as string : t('inactive') as string}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-color)] rounded-lg border border-[var(--border-color)] transition-colors duration-300">
                      <h3 className="font-medium text-[var(--text-color)] mb-2">{t('user_count') as string}</h3>
                      <p className="text-lg text-[var(--primary-color)]">{systemStatus.user_count}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-color)] rounded-lg border border-[var(--border-color)] transition-colors duration-300">
                      <h3 className="font-medium text-[var(--text-color)] mb-2">{t('last_checked') as string}</h3>
                      <p className="text-sm text-[var(--text-color)]">{new Date(systemStatus.timestamp).toLocaleString()}</p>
                    </div>
                  </>
                ) : <p className="text-[var(--text-color)]">{t('loading') as string}</p>}
              </div>
            </section>
          )}
          {activeTab === 'settings' && (
            <section>
              <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">{t('settings') as string}</h2>
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

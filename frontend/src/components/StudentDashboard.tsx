import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api';
import DashboardLayout from './DashboardLayout';
import TabNav from './TabNav';

const StudentDashboard: React.FC = () => {
  const { t } = useTranslation();
  const tabs = [
    { key: 'analytics', label: t('analytics') },
    { key: 'classrooms', label: t('classrooms') },
    { key: 'grades', label: t('grades') },
    { key: 'ai_tutor', label: t('ai_tutor') },
  ];
  const [activeTab, setActiveTab] = useState<string>('analytics');
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);

  useEffect(() => {
    api.get('/analytics').then(res => setAnalytics(res.data));
    api.get('/classrooms').then(res => setClassrooms(res.data));
    api.get('/grades').then(res => setGrades(res.data));
  }, []);

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: chatInput }]);
    const res = await api.post('/ai/tutor', { prompt: chatInput });
    const text = res.data.text || res.data;
    setMessages(prev => [...prev, { sender: 'bot', text }]);
    setChatInput('');
  };

  return (
    <DashboardLayout title={t('student_dashboard')}>
      <div className="p-4">
        <TabNav tabs={tabs} active={activeTab} onChange={setActiveTab} />
        <div className="mt-4">
          {activeTab === 'analytics' && (
            <section>
              <h2 className="text-xl mb-2">{t('analytics')}</h2>
              <ul className="list-disc list-inside">
                {analytics.map((a, i) => (<li key={i}>{JSON.stringify(a)}</li>))}
              </ul>
            </section>
          )}
          {activeTab === 'classrooms' && (
            <section>
              <h2 className="text-xl mb-2">{t('classrooms')}</h2>
              <ul className="list-disc list-inside">
                {classrooms.map(c => (<li key={c.id}>{c.name}</li>))}
              </ul>
            </section>
          )}
          {activeTab === 'grades' && (
            <section>
              <h2 className="text-xl mb-2">{t('grades')}</h2>
              <ul className="list-disc list-inside">
                {grades.map(g => (<li key={g.id}>{g.score} ({g.assignment_id})</li>))}
              </ul>
            </section>
          )}
          {activeTab === 'ai_tutor' && (
            <section>
              <h2 className="text-xl mb-2">{t('ai_tutor')}</h2>
              <div className="border p-4 bg-white">
                <div className="space-y-2 mb-2 max-h-40 overflow-y-auto">
                  {messages.map((m, i) => (
                    <div key={i} className={m.sender === 'user' ? 'text-right' : 'text-left'}>
                      <span className="inline-block p-2 rounded bg-gray-200">{m.text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    className="flex-1 border p-2 rounded-l"
                    placeholder={t('ai_tutor') as string}
                  />
                  <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded-r">
                    {t('generate')}
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

export default StudentDashboard;

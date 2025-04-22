import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api';
import DashboardLayout from './DashboardLayout';
import TabNav from './TabNav';
import CSSSettings from './CSSSettings';

const TeacherDashboard: React.FC = () => {
  const { t } = useTranslation();
  const tabs = [
    { key: 'analytics', label: t('analytics') },
    { key: 'classrooms', label: t('classrooms') },
    { key: 'lesson_generator', label: t('lesson_generator') },
  ];
  const [activeTab, setActiveTab] = useState<string>('analytics');
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [newName, setNewName] = useState('');
  const [lessonPrompt, setLessonPrompt] = useState('');
  const [lesson, setLesson] = useState('');

  useEffect(() => {
    api.get('/analytics').then(res => setAnalytics(res.data));
    api.get('/classrooms').then(res => setClassrooms(res.data));
  }, []);

  const createClassroom = async () => {
    if (!newName) return;
    const res = await api.post('/classrooms', { name: newName });
    setClassrooms(prev => [...prev, res.data]);
    setNewName('');
  };

  const generateLesson = async () => {
    if (!lessonPrompt) return;
    const res = await api.post('/ai/lesson', { prompt: lessonPrompt });
    setLesson(res.data.text || res.data);
  };

  return (
    <DashboardLayout title={t('teacher_dashboard')}>
      <div className="p-4">
        <CSSSettings />
        <TabNav tabs={tabs} active={activeTab} onChange={setActiveTab} />
        <div className="mt-4">
          {activeTab === 'analytics' && (
            <section className="mb-6">
              <h2 className="text-xl mb-2">{t('analytics')}</h2>
              <ul className="list-disc list-inside">
                {analytics.map((a, i) => (<li key={i}>{JSON.stringify(a)}</li>))}
              </ul>
            </section>
          )}
          {activeTab === 'classrooms' && (
            <section className="mb-6">
              <h2 className="text-xl mb-2">{t('classrooms')}</h2>
              <div className="flex mb-2">
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder={t('classrooms') as string} className="border p-1 mr-2" />
                <button onClick={createClassroom} className="bg-green-500 text-white px-3 rounded">{t('generate')}</button>
              </div>
              <ul className="list-disc list-inside">
                {classrooms.map(c => (<li key={c.id}>{c.name}</li>))}
              </ul>
            </section>
          )}
          {activeTab === 'lesson_generator' && (
            <section className="mb-6">
              <h2 className="text-xl mb-2">{t('lesson_generator')}</h2>
              <textarea value={lessonPrompt} onChange={e => setLessonPrompt(e.target.value)} className="w-full border p-2 mb-2" />
              <button onClick={generateLesson} className="bg-blue-500 text-white px-3 rounded">{t('generate')}</button>
              {lesson && <div className="mt-4 p-2 bg-white border">{lesson}</div>}
            </section>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;

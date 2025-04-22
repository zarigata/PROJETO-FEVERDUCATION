import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api';
import CSSSettings from './CSSSettings';

const TeacherDashboard: React.FC = () => {
  const { t } = useTranslation();
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
    <div className="p-8">
      <h1 className="text-2xl mb-4">{t('teacher_dashboard')}</h1>
      <CSSSettings />
      <section className="mb-6">
        <h2 className="text-xl mb-2">{t('analytics')}</h2>
        <ul className="list-disc list-inside">
          {analytics.map((a, i) => <li key={i}>{JSON.stringify(a)}</li>)}
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl mb-2">{t('classrooms')}</h2>
        <div className="flex mb-2">
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder={t('classrooms') as string} className="border p-1 mr-2" />
          <button onClick={createClassroom} className="bg-green-500 text-white px-3 rounded">{t('generate')}</button>
        </div>
        <ul className="list-disc list-inside">
          {classrooms.map(c => <li key={c.id}>{c.name}</li>)}
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl mb-2">{t('lesson_generator')}</h2>
        <textarea value={lessonPrompt} onChange={e => setLessonPrompt(e.target.value)} placeholder="" className="w-full border p-2 mb-2" />
        <button onClick={generateLesson} className="bg-blue-500 text-white px-3 rounded">{t('generate')}</button>
        {lesson && <div className="mt-4 p-2 bg-white border">{lesson}</div>}
      </section>
    </div>
  );
};

export default TeacherDashboard;

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
    { key: 'settings', label: 'Settings' },
  ];
  const [activeTab, setActiveTab] = useState<string>('analytics');
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [newName, setNewName] = useState('');
  const [lessonPrompt, setLessonPrompt] = useState('');
  const [lesson, setLesson] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, classroomsRes] = await Promise.all([
          api.get('/teacher/analytics'),
          api.get('/classrooms'),
        ]);
        setAnalytics(analyticsRes.data);
        setClassrooms(classroomsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const createClassroom = async () => {
    if (!newName) return;
    const res = await api.post('/classrooms', { name: newName });
    setClassrooms(prev => [...prev, res.data]);
    setNewName('');
  };

  const generateLesson = async () => {
    if (!lessonPrompt) return;
    try {
      const res = await api.post('/ollama/generate', { model: 'llama3.2', prompt: lessonPrompt });
      setLesson(res.data.response);
    } catch (err) {
      console.error(err);
      setLesson('Error generating lesson content.');
    }
  };

  return (
    <DashboardLayout title={t('teacher_dashboard')}>
      <div className="space-y-6 transition-all duration-300">
        <TabNav tabs={tabs} active={activeTab} onChange={setActiveTab} />
        <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-md card transition-colors duration-300">
          {activeTab === 'analytics' && (
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">{t('analytics')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analytics.length > 0 ? analytics.map((item, i) => (
                  <div key={i} className="bg-[var(--bg-color)] p-4 rounded-lg shadow-inner border border-[var(--border-color)] transition-colors duration-300">
                    <h3 className="font-medium text-[var(--text-color)]">{item.label}</h3>
                    <p className="text-3xl text-[var(--primary-color)] transition-colors duration-300">{item.value}</p>
                  </div>
                )) : 
                <>
                  <div className="bg-[var(--bg-color)] p-4 rounded-lg shadow-inner border border-[var(--border-color)] transition-colors duration-300">
                    <h3 className="font-medium text-[var(--text-color)]">Student Progress</h3>
                    <p className="text-xl text-[var(--primary-color)] transition-colors duration-300">Placeholder</p>
                    <p className="text-[var(--text-color)] opacity-70">This will show overall student progress metrics.</p>
                  </div>
                  <div className="bg-[var(--bg-color)] p-4 rounded-lg shadow-inner border border-[var(--border-color)] transition-colors duration-300">
                    <h3 className="font-medium text-[var(--text-color)]">Classroom Activity</h3>
                    <p className="text-xl text-[var(--primary-color)] transition-colors duration-300">Placeholder</p>
                    <p className="text-[var(--text-color)] opacity-70">This will display activity levels in your classrooms.</p>
                  </div>
                  <div className="bg-[var(--bg-color)] p-4 rounded-lg shadow-inner border border-[var(--border-color)] transition-colors duration-300">
                    <h3 className="font-medium text-[var(--text-color)]">Lesson Engagement</h3>
                    <p className="text-xl text-[var(--primary-color)] transition-colors duration-300">Placeholder</p>
                    <p className="text-[var(--text-color)] opacity-70">This will show engagement metrics for your lessons.</p>
                  </div>
                </>
                }
              </div>
            </section>
          )}
          {activeTab === 'classrooms' && (
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">{t('classrooms')}</h2>
              <div className="mb-4 flex flex-col md:flex-row gap-4">
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="New Classroom Name" className="flex-1 p-2 border rounded-lg text-[var(--text-color)] transition-colors duration-300" />
                <button onClick={createClassroom} className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--secondary-color)] transition-all duration-200 font-medium transform hover:scale-102">Add</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classrooms.map((room) => (
                  <div key={room.id} className="bg-[var(--bg-color)] p-6 rounded-lg shadow-md border border-[var(--border-color)] transition-colors duration-300 hover:shadow-lg transition-shadow duration-200">
                    <h3 className="font-bold text-xl text-[var(--text-color)] mb-2">{room.name}</h3>
                    <p className="text-[var(--text-color)] opacity-80">ID: {room.id}</p>
                    <div className="mt-4 flex gap-2">
                      <button className="bg-[var(--primary-color)] text-white px-3 py-1 rounded-lg hover:bg-[var(--secondary-color)] transition-all duration-200 transform hover:scale-105">Manage</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105">Delete</button>
                    </div>
                  </div>
                ))}
                <div className="bg-[var(--bg-color)] p-6 rounded-lg shadow-md border border-[var(--border-color)] transition-colors duration-300 opacity-70 italic">
                  <h3 className="font-bold text-xl text-[var(--text-color)] mb-2">Placeholder Classroom</h3>
                  <p className="text-[var(--text-color)] opacity-80">This is how a classroom card will look.</p>
                </div>
              </div>
            </section>
          )}
          {activeTab === 'lesson_generator' && (
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">{t('lesson_generator')}</h2>
              <textarea value={lessonPrompt} onChange={e => setLessonPrompt(e.target.value)} placeholder="Enter lesson topic or requirements for AI generation..." className="w-full border p-3 mb-3 rounded-lg text-[var(--text-color)] transition-colors duration-300 min-h-40" />
              <button onClick={generateLesson} className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--secondary-color)] transition-all duration-200 font-medium transform hover:scale-102">{t('generate')}</button>
              {lesson && <div className="mt-4 p-4 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg text-[var(--text-color)] transition-colors duration-300 shadow-inner">{lesson}</div>}
            </section>
          )}
          {activeTab === 'settings' && (
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">Teacher Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-[var(--bg-color)] p-6 rounded-lg shadow-md border border-[var(--border-color)] transition-colors duration-300">
                  <h3 className="text-xl font-medium text-[var(--text-color)] mb-4">CSS Theme Settings</h3>
                  <CSSSettings />
                </div>
                <div className="card bg-[var(--bg-color)] p-6 rounded-lg shadow-md border border-[var(--border-color)] transition-colors duration-300">
                  <h3 className="text-xl font-medium text-[var(--text-color)] mb-4">Placeholder: Profile Settings</h3>
                  <p className="text-[var(--text-color)] opacity-70 mb-4">This section will allow customization of your teacher profile and preferences.</p>
                  <button className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--secondary-color)] transition-all duration-200 font-medium transform hover:scale-102 opacity-50" disabled>
                    Edit Profile
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

export default TeacherDashboard;

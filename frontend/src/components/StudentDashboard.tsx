import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api';
import DashboardLayout from './DashboardLayout';
import TabNav from './TabNav';
import AIChat from './AIChat'; // Import AIChat component
import ChatSidebar from './ChatSidebar';

const StudentDashboard: React.FC = () => {
  const { t } = useTranslation();
  const tabs = [
    { key: 'analytics', label: t('analytics') },
    { key: 'classrooms', label: t('classrooms') },
    { key: 'grades', label: t('grades') },
    { key: 'ai_tutor', label: t('ai_tutor') },
    { key: 'profile', label: t('profile') },
  ];
  const [activeTab, setActiveTab] = useState<string>('analytics');
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [profileForm, setProfileForm] = useState<{ name: string; birthday: string; profile_photo: string }>({ name: '', birthday: '', profile_photo: '' });
  const [joinCode, setJoinCode] = useState<string>('');
  const [sessionId, setSessionId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, classroomsRes, gradesRes, userRes] = await Promise.all([
          api.get('/analytics'),
          api.get('/classrooms'),
          api.get('/grades'),
          api.get('/auth/me'),
        ]);
        setAnalytics(analyticsRes.data);
        setClassrooms(classroomsRes.data);
        setGrades(gradesRes.data);
        setUser(userRes.data);
        setProfileForm({
          name: userRes.data.name || '',
          birthday: userRes.data.birthday || '',
          profile_photo: userRes.data.profile_photo || '',
        });
      } catch (err) {
        console.error('Error fetching student data:', err);
      }
    };
    fetchData();
  }, []);

  const handleProfileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileForm(prev => ({ ...prev, profile_photo: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const res = await api.put(`/users/${user.id}`, profileForm);
      setUser(res.data);
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  const joinClassroom = async () => {
    try {
      const res = await api.post('/classrooms/join', { join_code: joinCode });
      setClassrooms(prev => [...prev, res.data]);
      setJoinCode('');
    } catch (err) {
      console.error('Error joining classroom:', err);
    }
  };

  return (
    <DashboardLayout title={t('student_dashboard')}>
      <div className="space-y-6 transition-all duration-300">
        <TabNav tabs={tabs} active={activeTab} onChange={setActiveTab} />
        <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-md card transition-colors duration-300">
          {activeTab === 'analytics' && (
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">{t('analytics')}</h2>
              
              {/* CODEX: Student profile and level section with gamification */}
              <div className="card-neumorphic p-6 mb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] flex items-center justify-center text-white text-2xl font-bold">
                      {/* Student initials or avatar */}
                      JS
                    </div>
                    <div className="absolute -bottom-2 -right-2 badge badge-intermediate achievement-unlocked">
                      Lvl 12
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[var(--text-color)] mb-2">{t('student_name')}</h3>
                    <p className="text-[var(--text-color)] opacity-80 mb-4">{t('student_description')}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-[var(--text-color)]">{t('experience')}</span>
                        <span className="text-sm font-medium text-[var(--primary-color)]">1,250 / 2,000 XP</span>
                      </div>
                      <div className="progress-container">
                        <div className="progress-bar" style={{ width: '62.5%' }}></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <div className="badge badge-beginner">{t('python_novice')}</div>
                      <div className="badge badge-intermediate">{t('math_enthusiast')}</div>
                      <div className="badge">{t('five_day_streak')}</div>
                    </div>
                  </div>
                  
                  <div className="text-center md:text-right">
                    <div className="text-4xl font-bold text-[var(--primary-color)] mb-1">87</div>
                    <div className="text-sm text-[var(--text-color)] opacity-70">{t('overall_score')}</div>
                  </div>
                </div>
              </div>
              
              {/* CODEX: Analytics cards with visual representations */}
              <h3 className="text-xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">{t('your_progress')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analytics.length > 0 ? analytics.map((item, i) => (
                  <div key={i} className="card-neumorphic p-5 hover-scale">
                    <h3 className="font-medium text-[var(--text-color)] mb-2">{item.label}</h3>
                    <p className="text-3xl text-[var(--primary-color)] transition-colors duration-300">{item.value}</p>
                    {item.change && (
                      <div className={`text-sm mt-2 ${parseFloat(item.change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {parseFloat(item.change) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(item.change))}% from last week
                      </div>
                    )}
                  </div>
                )) : 
                <>
                  <div className="card-neumorphic p-5 hover-scale">
                    <h3 className="font-medium text-[var(--text-color)] mb-2">{t('course_progress')}</h3>
                    <div className="progress-container">
                      <div className="progress-bar" style={{ width: '65%' }}></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <p className="text-lg font-medium text-[var(--primary-color)]">65%</p>
                      <p className="text-sm text-[var(--text-color)] opacity-70">+5% this week</p>
                    </div>
                  </div>
                  
                  <div className="card-neumorphic p-5 hover-scale">
                    <h3 className="font-medium text-[var(--text-color)] mb-2">{t('assignments')}</h3>
                    <div className="flex items-end gap-2">
                      <p className="text-3xl text-[var(--primary-color)] transition-colors duration-300">7</p>
                      <p className="text-xl text-[var(--text-color)] opacity-70 mb-1">/10</p>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <p className="text-[var(--text-color)] opacity-70">{t('completed')}</p>
                      <p className="text-sm text-green-500">2 days ahead of schedule</p>
                    </div>
                  </div>
                  
                  <div className="card-neumorphic p-5 hover-scale">
                    <h3 className="font-medium text-[var(--text-color)] mb-2">{t('study_time')}</h3>
                    <p className="text-3xl text-[var(--primary-color)] transition-colors duration-300">12.5h</p>
                    <div className="mt-2 flex justify-between">
                      <p className="text-[var(--text-color)] opacity-70">{t('this_week')}</p>
                      <p className="text-sm text-green-500">↑ 2.5h from last week</p>
                    </div>
                  </div>
                </>
                }
              </div>
              
              {/* CODEX: Recent achievements section */}
              <h3 className="text-xl font-semibold text-[var(--text-color)] mt-8 mb-4 transition-colors duration-300">{t('recent_achievements')}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div className="card-neumorphic p-4 text-center hover-scale">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-[var(--primary-color)] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-[var(--text-color)]">{t('quick_learner')}</h4>
                  <p className="text-xs text-[var(--text-color)] opacity-70">{t('completed_three_lessons')}</p>
                </div>
                
                <div className="card-neumorphic p-4 text-center hover-scale">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-[var(--secondary-color)] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-[var(--text-color)]">{t('early_bird')}</h4>
                  <p className="text-xs text-[var(--text-color)] opacity-70">{t('studied_before_seven')}</p>
                </div>
                
                <div className="card-neumorphic p-4 text-center hover-scale">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-green-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-[var(--text-color)]">{t('perfect_score')}</h4>
                  <p className="text-xs text-[var(--text-color)] opacity-70">{t('math_quiz')}</p>
                </div>
                
                <div className="card-neumorphic p-4 text-center hover-scale">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-purple-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-[var(--text-color)]">{t('team_player')}</h4>
                  <p className="text-xs text-[var(--text-color)] opacity-70">{t('helped_five_classmates')}</p>
                </div>
              </div>
            </section>
          )}
          
          {activeTab === 'classrooms' && (
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">{t('classrooms')}</h2>
              
              {/* CODEX: Weekly schedule timeline */}
              <div className="card-neumorphic p-5 mb-6">
                <h3 className="text-xl font-semibold text-[var(--text-color)] mb-3">{t('this_week_schedule')}</h3>
                <div className="flex overflow-x-auto pb-2 space-x-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => (
                    <div key={day} className={`flex-shrink-0 w-40 ${index === 1 ? 'border-l-4 border-[var(--primary-color)]' : ''} p-3 rounded-lg ${index === 1 ? 'bg-[var(--bg-color-hover)]' : 'bg-[var(--bg-color)]'}`}>
                      <div className="font-medium text-[var(--text-color)] mb-2">{day}</div>
                      {index === 0 && (
                        <div className="p-2 mb-2 rounded bg-purple-100 border-l-4 border-purple-500">
                          <p className="text-sm font-medium text-purple-800">{t('mathematics_101')}</p>
                          <p className="text-xs text-purple-600">{t('ten_to_eleven_thirty')}</p>
                        </div>
                      )}
                      {index === 1 && (
                        <>
                          <div className="p-2 mb-2 rounded bg-blue-100 border-l-4 border-blue-500">
                            <p className="text-sm font-medium text-blue-800">{t('computer_science')}</p>
                            <p className="text-xs text-blue-600">{t('nine_to_ten_thirty')}</p>
                          </div>
                          <div className="p-2 mb-2 rounded bg-green-100 border-l-4 border-green-500">
                            <p className="text-sm font-medium text-green-800">{t('biology_lab')}</p>
                            <p className="text-xs text-green-600">{t('two_to_three_thirty')}</p>
                          </div>
                        </>
                      )}
                      {index === 3 && (
                        <div className="p-2 mb-2 rounded bg-orange-100 border-l-4 border-orange-500">
                          <p className="text-sm font-medium text-orange-800">{t('history')}</p>
                          <p className="text-xs text-orange-600">{t('one_to_two_thirty')}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* CODEX: Classroom cards with visual indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {classrooms.length > 0 ? classrooms.map((room, idx) => (
                  <div key={room.id} className="card-neumorphic p-0 overflow-hidden hover-scale">
                    <div className="h-24 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] relative">
                      <div className="absolute bottom-0 left-0 p-4 w-full">
                        <h3 className="font-bold text-xl text-white mb-1">{room.name}</h3>
                        <p className="text-white text-opacity-90">{t('professor')} {room.teacher || 'Johnson'}</p>
                      </div>
                      <div className="absolute top-4 right-4 bg-white bg-opacity-90 text-xs font-medium px-2.5 py-1 rounded-full">
                        {room.status || (idx % 3 === 0 ? t('active') : idx % 3 === 1 ? t('upcoming') : t('completed'))}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center text-[var(--text-color)]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                          <span>{room.students || '24'} {t('students')}</span>
                        </div>
                        <div className="text-[var(--text-color)] text-opacity-70 text-sm">
                          <span>{t('next_class')}: {room.nextClass || t('tomorrow_ten')}</span>
                        </div>
                      </div>
                      
                      {/* Progress indicator */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[var(--text-color)]">{t('course_progress')}</span>
                          <span className="text-[var(--primary-color)]">{room.progress || (idx % 3 === 0 ? '45%' : idx % 3 === 1 ? '12%' : '78%')}</span>
                        </div>
                        <div className="progress-container h-2">
                          <div className="progress-bar" style={{ width: room.progress || (idx % 3 === 0 ? '45%' : idx % 3 === 1 ? '12%' : '78%') }}></div>
                        </div>
                      </div>
                      
                      {/* Assignment status */}
                      <div className="flex gap-2 mb-4">
                        <div className="badge badge-beginner">
                          <span className="mr-1">●</span> {room.assignments?.pending || (idx % 3 + 1)} {t('pending')}
                        </div>
                        <div className="badge badge-intermediate">
                          <span className="mr-1">●</span> {room.assignments?.completed || (idx % 2 + 2)} {t('completed')}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--secondary-color)] transition-all duration-200 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          {t('enter')}
                        </button>
                        <button className="bg-[var(--bg-color-hover)] text-[var(--text-color)] px-4 py-2 rounded-lg hover:bg-[var(--border-color)] transition-all duration-200 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          {t('materials')}
                        </button>
                      </div>
                    </div>
                  </div>
                )) : 
                <>
                  {/* Mathematics classroom */}
                  <div className="card-neumorphic p-0 overflow-hidden hover-scale">
                    <div className="h-24 bg-gradient-to-r from-purple-500 to-indigo-600 relative">
                      <div className="absolute bottom-0 left-0 p-4 w-full">
                        <h3 className="font-bold text-xl text-white mb-1">{t('mathematics_101')}</h3>
                        <p className="text-white text-opacity-90">{t('professor')} Johnson</p>
                      </div>
                      <div className="absolute top-4 right-4 bg-white bg-opacity-90 text-xs font-medium px-2.5 py-1 rounded-full">
                        {t('active')}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center text-[var(--text-color)]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                          <span>24 {t('students')}</span>
                        </div>
                        <div className="text-[var(--text-color)] text-opacity-70 text-sm">
                          <span>{t('next_class')}: {t('tomorrow_ten')}</span>
                        </div>
                      </div>
                      
                      {/* Progress indicator */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[var(--text-color)]">{t('course_progress')}</span>
                          <span className="text-[var(--primary-color)]">45%</span>
                        </div>
                        <div className="progress-container h-2">
                          <div className="progress-bar" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      
                      {/* Assignment status */}
                      <div className="flex gap-2 mb-4">
                        <div className="badge badge-beginner">
                          <span className="mr-1">●</span> 2 {t('pending')}
                        </div>
                        <div className="badge badge-intermediate">
                          <span className="mr-1">●</span> 3 {t('completed')}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--secondary-color)] transition-all duration-200 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          {t('enter')}
                        </button>
                        <button className="bg-[var(--bg-color-hover)] text-[var(--text-color)] px-4 py-2 rounded-lg hover:bg-[var(--border-color)] transition-all duration-200 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          {t('materials')}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Computer Science classroom */}
                  <div className="card-neumorphic p-0 overflow-hidden hover-scale">
                    <div className="h-24 bg-gradient-to-r from-blue-500 to-cyan-600 relative">
                      <div className="absolute bottom-0 left-0 p-4 w-full">
                        <h3 className="font-bold text-xl text-white mb-1">{t('computer_science')}</h3>
                        <p className="text-white text-opacity-90">{t('professor')} Williams</p>
                      </div>
                      <div className="absolute top-4 right-4 bg-white bg-opacity-90 text-xs font-medium px-2.5 py-1 rounded-full">
                        {t('upcoming')}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center text-[var(--text-color)]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                          <span>18 {t('students')}</span>
                        </div>
                        <div className="text-[var(--text-color)] text-opacity-70 text-sm">
                          <span>{t('next_class')}: {t('today_two')}</span>
                        </div>
                      </div>
                      
                      {/* Progress indicator */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[var(--text-color)]">{t('course_progress')}</span>
                          <span className="text-[var(--primary-color)]">12%</span>
                        </div>
                        <div className="progress-container h-2">
                          <div className="progress-bar" style={{ width: '12%' }}></div>
                        </div>
                      </div>
                      
                      {/* Assignment status */}
                      <div className="flex gap-2 mb-4">
                        <div className="badge badge-beginner">
                          <span className="mr-1">●</span> 1 {t('pending')}
                        </div>
                        <div className="badge badge-intermediate">
                          <span className="mr-1">●</span> 2 {t('completed')}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--secondary-color)] transition-all duration-200 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          {t('enter')}
                        </button>
                        <button className="bg-[var(--bg-color-hover)] text-[var(--text-color)] px-4 py-2 rounded-lg hover:bg-[var(--border-color)] transition-all duration-200 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          {t('materials')}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
                }
              </div>
              {activeTab === 'classrooms' && (
                <div className="mb-4 flex gap-2">
                  <input
                    placeholder={`${t('enter_join_code')}`}
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value)}
                    className="p-2 border rounded"
                  />
                  <button onClick={joinClassroom} className="bg-blue-500 text-white px-4 py-2 rounded">
                    {t('join_classroom')}
                  </button>
                </div>
              )}
            </section>
          )}
          {activeTab === 'grades' && (
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">{t('grades')}</h2>
              
              {/* CODEX: Grades displayed in a more visual way */}
              <div className="overflow-x-auto bg-[var(--bg-color)] rounded-lg border border-[var(--border-color)] transition-colors duration-300">
                <table className="min-w-full divide-y divide-[var(--border-color)]">
                  <thead className="bg-[var(--bg-color-hover)]">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">{t('assignment')}</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">{t('course')}</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">{t('score')}</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[var(--bg-color)] divide-y divide-[var(--border-color)]">
                    {grades.length > 0 ? grades.map((grade) => (
                      <tr key={grade.id} className="hover:bg-[var(--bg-color-hover)] transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">{grade.assignment_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">{grade.course || t('n_a')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--primary-color)]">{grade.score}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${parseInt(grade.score) >= 70 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {parseInt(grade.score) >= 70 ? t('passed') : t('needs_improvement')}
                          </span>
                        </td>
                      </tr>
                    )) : [
                      { id: 1, assignment_id: t('midterm_exam'), course: t('mathematics_101'), score: '85' },
                      { id: 2, assignment_id: t('research_paper'), course: t('history_of_science'), score: '92' },
                      { id: 3, assignment_id: t('lab_report'), course: t('physics'), score: '78' },
                      { id: 4, assignment_id: t('group_project'), course: t('computer_science'), score: '95' }
                    ].map((grade) => (
                      <tr key={grade.id} className="hover:bg-[var(--bg-color-hover)] transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">{grade.assignment_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">{grade.course}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--primary-color)]">{grade.score}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${parseInt(grade.score) >= 70 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {parseInt(grade.score) >= 70 ? t('passed') : t('needs_improvement')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          
          {activeTab === 'ai_tutor' && (
            <section className="mb-6 flex space-x-4 h-[600px]">
              <ChatSidebar sessionId={sessionId} setSessionId={setSessionId} />
              <div className="flex-1 flex flex-col">
                <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">{t('ai_tutor')}</h2>
                <AIChat endpoint="tutor" sessionId={sessionId ?? undefined} title={t('ai_tutor')} placeholder={t('ai_assistant_placeholder')} poweredBy="FeVe" />
              </div>
            </section>
          )}
          {activeTab === 'profile' && (
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">{t('profile')}</h2>
              <form onSubmit={saveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">{t('name')}</label>
                  <input name="name" value={profileForm.name} onChange={handleProfileInput} className="p-2 border rounded-lg w-full" />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">{t('birthday')}</label>
                  <input name="birthday" type="date" value={profileForm.birthday} onChange={handleProfileInput} className="p-2 border rounded-lg w-full" />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm font-medium">{t('profile_photo')}</label>
                  <input name="profile_photo" type="file" accept="image/*" onChange={handlePhotoChange} className="p-2 border rounded-lg w-full" />
                  {profileForm.profile_photo && <img src={profileForm.profile_photo} alt={t('profile') as string} className="mt-2 w-32 h-32 object-cover rounded-full" />}
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--secondary-color)] transition-all duration-200">{t('save')}</button>
                </div>
              </form>
            </section>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;

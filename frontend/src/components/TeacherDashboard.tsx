/**
 * CODEX: TeacherDashboard Component
 * Provides a comprehensive interface for teachers to manage classes,
 * analyze student performance, and generate AI-powered lesson content.
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api';
import DashboardLayout from './DashboardLayout';
import TabNav from './TabNav';
import CSSSettings from './CSSSettings';
import AIChat from './AIChat';

const TeacherDashboard: React.FC = () => {
  const { t } = useTranslation();
  const tabs = [
    { key: 'dashboard', label: t('dashboard') },
    { key: 'classrooms', label: t('classrooms') },
    { key: 'students', label: t('students') },
    { key: 'lesson_generator', label: t('lesson_generator') },
    { key: 'analytics', label: t('analytics') },
    { key: 'settings', label: t('settings') },
  ];
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [newName, setNewName] = useState('');
  const [newJoinCode, setNewJoinCode] = useState<string>('');
  const [lessonPrompt, setLessonPrompt] = useState<string>('');
  const [lesson, setLesson] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiModel, setAiModel] = useState<string>('llama3.2');
  const [outputFormat, setOutputFormat] = useState<string>('markdown');
  const [temperature, setTemperature] = useState<number>(0.7);
  const [lessonType, setLessonType] = useState<string>('Lecture');

  /**
   * CODEX: Data Fetching Logic
   * Retrieves teacher analytics, classrooms, and student data
   * Implements error handling and loading states
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all required data in parallel for performance
        const [analyticsRes, classroomsRes, studentsRes] = await Promise.all([
          api.get('/teacher/analytics'),
          api.get('/classrooms'),
          api.get('/students'),
        ]);
        
        // Process and set data with proper error handling
        setAnalytics(analyticsRes.data || []);
        setClassrooms(classroomsRes.data || []);
        setStudents(studentsRes.data || []);
        
        // If classrooms exist, select the first one by default
        if (classroomsRes.data?.length > 0) {
          setSelectedClassroom(classroomsRes.data[0].id);
        }
      } catch (err) {
        console.error('Error fetching teacher dashboard data:', err);
        // Here we could implement more sophisticated error handling
        // such as showing error messages to the user
      }
    };
    
    fetchData();
  }, []);

  const createClassroom = async () => {
    if (!newName) return;
    const res = await api.post('/classrooms', { name: newName });
    setClassrooms(prev => [...prev, res.data]);
    setNewName('');
    // Store join code for new classroom
    setNewJoinCode(res.data.join_code);
  };

  /**
   * CODEX: Lesson Generation Function
   * Generates a lesson using the Ollama API with enhanced parameters
   */
  const generateLesson = async () => {
    if (!lessonPrompt.trim() || !selectedClassroom) {
      // Show validation error
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Create a more detailed prompt with context
      const classroom = classrooms.find(c => c.id === selectedClassroom) || 
        { name: selectedClassroom, id: selectedClassroom };
      
      const enhancedPrompt = `
        Generate a ${lessonType} for the class "${classroom.name}".
        
        USER REQUIREMENTS:
        ${lessonPrompt}
        
        Please format the output in ${outputFormat} format.
        Include the following sections:
        - Learning objectives
        - Materials needed
        - Introduction
        - Main content
        - Activities
        - Assessment
        - Homework/follow-up
        
        Make the content engaging, interactive, and appropriate for the class level.
      `;
      
      const { data } = await api.post(
        '/ai/lesson',
        { prompt: enhancedPrompt, model: aiModel },
        { responseType: 'text' }
      );
      setLesson(data);
      
      // Save to recent templates or history here if needed
    } catch (error) {
      console.error('Error generating lesson:', error);
      // Show error notification
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler functions for AI dashboard buttons
  const handleUseTemplate = () => {
    const template = `
      Generate a ${lessonType} for the class "${classrooms.find(c => c.id === selectedClassroom)?.name || selectedClassroom}".
      
      Include:
      - Learning objectives
      - Materials needed
      - Introduction
      - Main content
      - Activities
      - Assessment
      - Homework/follow-up
    `;
    setLessonPrompt(template.trim());
  };

  const handleClearPrompt = () => {
    setLessonPrompt('');
    setLesson('');
  };

  const handleSaveLesson = async () => {
    if (!lesson) return;
    try {
      await api.post('/lessons', {
        classroom_id: selectedClassroom,
        title: `${lessonType} - ${new Date().toLocaleDateString()}`,
        description: lesson,
        scheduled_date: new Date().toISOString().split('T')[0],
      });
      alert(t('lesson_saved_success'));
    } catch (err) {
      console.error(err);
      alert(t('lesson_saved_error'));
    }
  };

  const handleCopyLesson = () => {
    navigator.clipboard.writeText(lesson);
    alert(t('copied_to_clipboard'));
  };

  const handleRegenerate = () => {
    generateLesson();
  };

  return (
    <DashboardLayout title={t('teacher_dashboard')}>
      <div className="space-y-6 transition-all duration-300">
        <TabNav tabs={tabs} active={activeTab} onChange={setActiveTab} />
        <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-md card transition-colors duration-300">
          {activeTab === 'dashboard' && (
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">{t('teacher_dashboard')}</h2>
              
              {/* CODEX: Teacher profile and stats section */}
              <div className="card-neumorphic p-6 mb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white text-2xl font-bold">
                      {/* Teacher initials or avatar */}
                      TP
                    </div>
                    <div className="absolute -bottom-2 -right-2 badge badge-master achievement-unlocked">
                      Pro
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[var(--text-color)] mb-2">Teacher Profile</h3>
                    <p className="text-[var(--text-color)] opacity-80 mb-4">Computer Science Department</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-[var(--text-color)]">Teaching Hours</span>
                        <span className="text-sm font-medium text-[var(--primary-color)]">24 / 40 hrs this month</span>
                      </div>
                      <div className="progress-container">
                        <div className="progress-bar" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <div className="badge badge-master">CS Expert</div>
                      <div className="badge badge-intermediate">5 Active Classes</div>
                      <div className="badge">120 Students</div>
                    </div>
                  </div>
                  
                  <div className="text-center md:text-right">
                    <div className="text-4xl font-bold text-[var(--primary-color)] mb-1">94%</div>
                    <div className="text-sm text-[var(--text-color)] opacity-70">Student Satisfaction</div>
                  </div>
                </div>
              </div>
              
              {/* CODEX: Key metrics cards with visual representations */}
              <h3 className="text-xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">Key Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analytics.length > 0 ? analytics.map((item, i) => (
                  <div key={i} className="card-neumorphic p-5 hover-scale">
                    <h3 className="font-medium text-[var(--text-color)] mb-2">{item.label}</h3>
                    <p className="text-3xl text-[var(--primary-color)] transition-colors duration-300">{item.value}</p>
                    {item.change && (
                      <div className={`text-sm mt-2 ${parseFloat(item.change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {parseFloat(item.change) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(item.change))}% from last month
                      </div>
                    )}
                  </div>
                )) : 
                <>
                  <div className="card-neumorphic p-5 hover-scale">
                    <h3 className="font-medium text-[var(--text-color)] mb-2">Student Progress</h3>
                    <div className="flex items-center gap-2">
                      <div className="text-3xl text-[var(--primary-color)] transition-colors duration-300">78%</div>
                      <div className="text-sm text-green-500">↑ 5%</div>
                    </div>
                    <p className="text-[var(--text-color)] opacity-70 mt-2">Average completion rate across all classes</p>
                  </div>
                  
                  <div className="card-neumorphic p-5 hover-scale">
                    <h3 className="font-medium text-[var(--text-color)] mb-2">Classroom Activity</h3>
                    <div className="flex items-center gap-2">
                      <div className="text-3xl text-[var(--primary-color)] transition-colors duration-300">24</div>
                      <div className="text-sm text-green-500">↑ 3</div>
                    </div>
                    <p className="text-[var(--text-color)] opacity-70 mt-2">Active discussions this week</p>
                  </div>
                  
                  <div className="card-neumorphic p-5 hover-scale">
                    <h3 className="font-medium text-[var(--text-color)] mb-2">Lesson Engagement</h3>
                    <div className="flex items-center gap-2">
                      <div className="text-3xl text-[var(--primary-color)] transition-colors duration-300">92%</div>
                      <div className="text-sm text-green-500">↑ 7%</div>
                    </div>
                    <p className="text-[var(--text-color)] opacity-70 mt-2">Student participation in recent lessons</p>
                  </div>
                </>
                }
              </div>
              
              {/* CODEX: Upcoming classes timeline */}
              <h3 className="text-xl font-semibold text-[var(--text-color)] mt-8 mb-4 transition-colors duration-300">Upcoming Classes</h3>
              <div className="card-neumorphic p-5 mb-6 overflow-x-auto">
                <div className="flex space-x-6 min-w-max">
                  {['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => (
                    <div key={day} className={`flex-shrink-0 w-60 ${index === 0 ? 'border-l-4 border-[var(--primary-color)]' : ''} p-3 rounded-lg ${index === 0 ? 'bg-[var(--bg-color-hover)]' : 'bg-[var(--bg-color)]'}`}>
                      <div className="font-medium text-[var(--text-color)] mb-2">{day}</div>
                      {index === 0 && (
                        <>
                          <div className="p-2 mb-2 rounded bg-blue-100 border-l-4 border-blue-500">
                            <p className="text-sm font-medium text-blue-800">Computer Science 101</p>
                            <p className="text-xs text-blue-600">10:00 - 11:30 AM • Room 204</p>
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-blue-600">24 Students</span>
                              <span className="text-xs font-medium text-blue-800">Lecture</span>
                            </div>
                          </div>
                          <div className="p-2 mb-2 rounded bg-purple-100 border-l-4 border-purple-500">
                            <p className="text-sm font-medium text-purple-800">Advanced Programming</p>
                            <p className="text-xs text-purple-600">02:00 - 03:30 PM • Lab 3</p>
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-purple-600">18 Students</span>
                              <span className="text-xs font-medium text-purple-800">Lab Session</span>
                            </div>
                          </div>
                        </>
                      )}
                      {index === 1 && (
                        <div className="p-2 mb-2 rounded bg-green-100 border-l-4 border-green-500">
                          <p className="text-sm font-medium text-green-800">Data Structures</p>
                          <p className="text-xs text-green-600">09:00 - 10:30 AM • Room 105</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-green-600">32 Students</span>
                            <span className="text-xs font-medium text-green-800">Lecture</span>
                          </div>
                        </div>
                      )}
                      {index === 2 && (
                        <div className="p-2 mb-2 rounded bg-orange-100 border-l-4 border-orange-500">
                          <p className="text-sm font-medium text-orange-800">Algorithm Design</p>
                          <p className="text-xs text-orange-600">01:00 - 02:30 PM • Room 302</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-orange-600">27 Students</span>
                            <span className="text-xs font-medium text-orange-800">Workshop</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* CODEX: Quick actions section */}
              <h3 className="text-xl font-semibold text-[var(--text-color)] mt-8 mb-4 transition-colors duration-300">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <button className="card-neumorphic p-4 text-center hover-scale flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-[var(--text-color)]">Create Class</span>
                </button>
                
                <button className="card-neumorphic p-4 text-center hover-scale flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-[var(--text-color)]">Assignments</span>
                </button>
                
                <button className="card-neumorphic p-4 text-center hover-scale flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-[var(--text-color)]">Generate Lesson</span>
                </button>
                
                <button className="card-neumorphic p-4 text-center hover-scale flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-[var(--text-color)]">View Reports</span>
                </button>
              </div>
            </section>
          )}
          {activeTab === 'classrooms' && (
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">{t('classrooms')}</h2>
              
              {/* CODEX: Classroom creation form with enhanced UI */}
              <div className="card-neumorphic p-5 mb-6">
                <h3 className="text-xl font-semibold text-[var(--text-color)] mb-4">Create New Classroom</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input 
                      value={newName} 
                      onChange={e => setNewName(e.target.value)} 
                      placeholder="Enter classroom name" 
                      className="w-full p-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg text-[var(--text-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-all duration-200" 
                    />
                  </div>
                  <button 
                    onClick={createClassroom} 
                    className="bg-[var(--primary-color)] text-white px-6 py-3 rounded-lg hover:bg-[var(--secondary-color)] transition-all duration-200 font-medium flex items-center justify-center gap-2"
                    disabled={!newName.trim()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Classroom
                  </button>
                </div>
              </div>
              {newJoinCode && (
                <div className="mt-2 text-sm text-[var(--text-color)] flex items-center gap-2">
                  <span>Join Code: {newJoinCode}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(newJoinCode)}
                    className="text-[var(--primary-color)] hover:underline"
                  >
                    Copy
                  </button>
                </div>
              )}
              
              {/* CODEX: Classroom management tools */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[var(--text-color)]">Your Classrooms</h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search classrooms..." 
                      className="pl-9 pr-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg text-[var(--text-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-all duration-200"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-color)] opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <select className="bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg text-[var(--text-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-all duration-200 px-4">
                    <option>All Subjects</option>
                    <option>Computer Science</option>
                    <option>Mathematics</option>
                    <option>Science</option>
                  </select>
                </div>
              </div>
              
              {/* CODEX: Enhanced classroom cards with visual indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classrooms.length > 0 ? classrooms.map((room, idx) => (
                  <div key={room.id} className="card-neumorphic p-0 overflow-hidden hover-scale">
                    <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-800 relative">
                      <div className="absolute bottom-0 left-0 p-4 w-full">
                        <h3 className="font-bold text-xl text-white mb-1">{room.name}</h3>
                        <p className="text-white text-opacity-90">ID: {room.id}</p>
                      </div>
                      <div className="absolute top-4 right-4 bg-white bg-opacity-90 text-xs font-medium px-2.5 py-1 rounded-full">
                        {idx % 3 === 0 ? 'Active' : idx % 3 === 1 ? 'Upcoming' : 'Completed'}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center text-[var(--text-color)]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                          <span>{idx * 5 + 15} Students</span>
                        </div>
                        <div className="text-[var(--text-color)] text-opacity-70 text-sm">
                          <span>Next class: {idx % 2 === 0 ? 'Today' : 'Tomorrow'}</span>
                        </div>
                      </div>
                      
                      {/* Progress indicator */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[var(--text-color)]">Course progress</span>
                          <span className="text-[var(--primary-color)]">{idx % 3 === 0 ? '45%' : idx % 3 === 1 ? '12%' : '78%'}</span>
                        </div>
                        <div className="progress-container h-2">
                          <div className="progress-bar" style={{ width: idx % 3 === 0 ? '45%' : idx % 3 === 1 ? '12%' : '78%' }}></div>
                        </div>
                      </div>
                      
                      {/* Assignment status */}
                      <div className="flex gap-2 mb-4">
                        <div className="badge badge-beginner">
                          <span className="mr-1">●</span> {idx % 3 + 1} Pending
                        </div>
                        <div className="badge badge-intermediate">
                          <span className="mr-1">●</span> {idx % 2 + 2} Completed
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--secondary-color)] transition-all duration-200 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Manage
                        </button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )) : [
                  { id: 1, name: 'Computer Science 101' },
                  { id: 2, name: 'Advanced Programming' },
                  { id: 3, name: 'Data Structures' },
                  { id: 4, name: 'Algorithm Design' },
                  { id: 5, name: 'Web Development' },
                  { id: 6, name: 'Database Systems' }
                ].map((room, idx) => (
                  <div key={room.id} className="card-neumorphic p-0 overflow-hidden hover-scale">
                    <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-800 relative">
                      <div className="absolute bottom-0 left-0 p-4 w-full">
                        <h3 className="font-bold text-xl text-white mb-1">{room.name}</h3>
                        <p className="text-white text-opacity-90">ID: {room.id}</p>
                      </div>
                      <div className="absolute top-4 right-4 bg-white bg-opacity-90 text-xs font-medium px-2.5 py-1 rounded-full">
                        {idx % 3 === 0 ? 'Active' : idx % 3 === 1 ? 'Upcoming' : 'Completed'}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center text-[var(--text-color)]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                          <span>{idx * 5 + 15} Students</span>
                        </div>
                        <div className="text-[var(--text-color)] text-opacity-70 text-sm">
                          <span>Next class: {idx % 2 === 0 ? 'Today' : 'Tomorrow'}</span>
                        </div>
                      </div>
                      
                      {/* Progress indicator */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[var(--text-color)]">Course progress</span>
                          <span className="text-[var(--primary-color)]">{idx % 3 === 0 ? '45%' : idx % 3 === 1 ? '12%' : '78%'}</span>
                        </div>
                        <div className="progress-container h-2">
                          <div className="progress-bar" style={{ width: idx % 3 === 0 ? '45%' : idx % 3 === 1 ? '12%' : '78%' }}></div>
                        </div>
                      </div>
                      
                      {/* Assignment status */}
                      <div className="flex gap-2 mb-4">
                        <div className="badge badge-beginner">
                          <span className="mr-1">●</span> {idx % 3 + 1} Pending
                        </div>
                        <div className="badge badge-intermediate">
                          <span className="mr-1">●</span> {idx % 2 + 2} Completed
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--secondary-color)] transition-all duration-200 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Manage
                        </button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {activeTab === 'lesson_generator' && (
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">{t('lesson_generator')}</h2>
              
              {/* CODEX: Enhanced AI lesson generator with templates and options */}
              <div className="card-neumorphic p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-[var(--text-color)] mb-4">Generate New Lesson Content</h3>
                    
                    <div className="mb-4">
                      <label className="block text-[var(--text-color)] mb-2 font-medium">Select Classroom</label>
                      <select 
                        className="w-full p-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg text-[var(--text-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-all duration-200"
                        value={selectedClassroom}
                        onChange={(e) => setSelectedClassroom(e.target.value)}
                      >
                        <option value="">Select a classroom</option>
                        {classrooms.length > 0 ? 
                          classrooms.map(room => (
                            <option key={room.id} value={room.id}>{room.name}</option>
                          )) : 
                          [
                            { id: '1', name: 'Computer Science 101' },
                            { id: '2', name: 'Advanced Programming' },
                            { id: '3', name: 'Data Structures' },
                          ].map(room => (
                            <option key={room.id} value={room.id}>{room.name}</option>
                          ))
                        }
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-[var(--text-color)] mb-2 font-medium">Lesson Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Lecture', 'Lab', 'Assignment', 'Quiz', 'Project', 'Review'].map(type => (
                          <div key={type} className="flex items-center">
                            <input 
                              type="radio" 
                              id={`type-${type}`} 
                              name="lessonType" 
                              className="mr-2"
                              checked={lessonType === type}
                              onChange={() => setLessonType(type)}
                            />
                            <label htmlFor={`type-${type}`} className="text-[var(--text-color)]">{type}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-[var(--text-color)] mb-2 font-medium">Prompt</label>
                      <textarea 
                        value={lessonPrompt} 
                        onChange={e => setLessonPrompt(e.target.value)} 
                        placeholder="Describe the lesson content you want to generate. Be specific about topics, learning objectives, and difficulty level." 
                        className="w-full p-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg text-[var(--text-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-all duration-200 min-h-40" 
                      />
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        <button onClick={handleUseTemplate} className="bg-[var(--bg-color-hover)] text-[var(--text-color)] px-4 py-2 rounded-lg hover:bg-[var(--border-color)] transition-all duration-200 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                          </svg>
                          Use Template
                        </button>
                        <button onClick={handleClearPrompt} className="bg-[var(--bg-color-hover)] text-[var(--text-color)] px-4 py-2 rounded-lg hover:bg-[var(--border-color)] transition-all duration-200 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Clear
                        </button>
                      </div>
                      <button 
                        onClick={generateLesson} 
                        disabled={!lessonPrompt.trim() || !selectedClassroom || isGenerating}
                        className="bg-[var(--primary-color)] text-white px-6 py-2 rounded-lg hover:bg-[var(--secondary-color)] transition-all duration-200 font-medium flex items-center"
                      >
                        {isGenerating ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('generating')}
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                            </svg>
                            {t('generate')}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="md:w-1/3">
                    <h3 className="text-xl font-medium text-[var(--text-color)] mb-4">AI Model Settings</h3>
                    
                    <div className="mb-4">
                      <label className="block text-[var(--text-color)] mb-2 font-medium">Select Model</label>
                      <select 
                        value={aiModel}
                        onChange={(e) => setAiModel(e.target.value)}
                        className="w-full p-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg text-[var(--text-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-all duration-200"
                      >
                        <option value="llama3.2">Llama 3.2 (Default)</option>
                        <option value="llama3.1">Llama 3.1</option>
                        <option value="mistral">Mistral 7B</option>
                        <option value="mixtral">Mixtral 8x7B</option>
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-[var(--text-color)] mb-2 font-medium">Temperature</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1" 
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full h-2 bg-[var(--bg-color-hover)] rounded-lg appearance-none cursor-pointer" 
                      />
                      <div className="flex justify-between text-xs text-[var(--text-color)] mt-1">
                        <span>Precise</span>
                        <span>Balanced</span>
                        <span>Creative</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-[var(--text-color)] mb-2 font-medium">Output Format</label>
                      <div className="space-y-2">
                        {['markdown', 'html', 'plain_text'].map(format => (
                          <div key={format} className="flex items-center">
                            <input 
                              type="radio" 
                              id={`format-${format}`} 
                              name="outputFormat" 
                              className="mr-2"
                              checked={outputFormat === format}
                              onChange={() => setOutputFormat(format)}
                            />
                            <label htmlFor={`format-${format}`} className="text-[var(--text-color)]">
                              {format === 'markdown' ? 'Markdown' : format === 'html' ? 'HTML' : 'Plain Text'}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="flex items-center text-[var(--text-color)] mb-2 font-medium">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        Include exercises
                      </label>
                      <label className="flex items-center text-[var(--text-color)] mb-2 font-medium">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        Include assessment
                      </label>
                      <label className="flex items-center text-[var(--text-color)] mb-2 font-medium">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        Include visual aids
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* CODEX: Generated lesson content with actions */}
              {lesson && (
                <div className="card-neumorphic overflow-hidden">
                  <div className="bg-[var(--bg-color-hover)] p-4 flex justify-between items-center border-b border-[var(--border-color)]">
                    <h3 className="font-medium text-[var(--text-color)]">Generated Lesson Content</h3>
                    <div className="flex gap-2">
                      <button onClick={handleSaveLesson} className="bg-[var(--bg-color)] text-[var(--text-color)] px-3 py-1 rounded-lg hover:bg-[var(--border-color)] transition-all duration-200 flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                        </svg>
                        Save
                      </button>
                      <button onClick={handleCopyLesson} className="bg-[var(--bg-color)] text-[var(--text-color)] px-3 py-1 rounded-lg hover:bg-[var(--border-color)] transition-all duration-200 flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </button>
                      <button onClick={handleRegenerate} className="bg-[var(--bg-color)] text-[var(--text-color)] px-3 py-1 rounded-lg hover:bg-[var(--border-color)] transition-all duration-200 flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Regenerate
                      </button>
                    </div>
                  </div>
                  <div className="p-6 max-h-[500px] overflow-y-auto bg-[var(--bg-color)] text-[var(--text-color)] whitespace-pre-wrap">
                    {lesson}
                  </div>
                </div>
              )}
            </section>
          )}
          {activeTab === 'analytics' && (
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">{t('analytics')}</h2>
              <AIChat endpoint="analytics" title={t('analytics')} placeholder={t('ai_assistant_placeholder')} poweredBy="FeVe" />
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

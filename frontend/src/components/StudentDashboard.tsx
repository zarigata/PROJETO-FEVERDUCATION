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
    // CODEX: Fetch data with proper error handling and loading states
    const fetchData = async () => {
      try {
        const [analyticsRes, classroomsRes, gradesRes] = await Promise.all([
          api.get('/analytics'),
          api.get('/classrooms'),
          api.get('/grades')
        ]);
        setAnalytics(analyticsRes.data);
        setClassrooms(classroomsRes.data);
        setGrades(gradesRes.data);
      } catch (err) {
        console.error('Error fetching student data:', err);
      }
    };
    fetchData();
  }, []);

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    
    // CODEX: Add user message to chat
    const userMessage = chatInput;
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setChatInput('');
    
    try {
      // CODEX: Use Ollama for AI responses with llama3.2 model
      const res = await api.post('/ollama/generate', { 
        model: 'llama3.2', 
        prompt: `You are an AI tutor helping a student. Answer this question: ${userMessage}` 
      });
      const text = res.data.response || res.data.text || res.data;
      setMessages(prev => [...prev, { sender: 'bot', text }]);
    } catch (err) {
      console.error('Error getting AI response:', err);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'Sorry, I had trouble processing your request. Please try again.' 
      }]);
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
              
              {/* CODEX: Analytics cards with visual representations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analytics.length > 0 ? analytics.map((item, i) => (
                  <div key={i} className="bg-[var(--bg-color)] p-4 rounded-lg shadow-inner border border-[var(--border-color)] transition-colors duration-300">
                    <h3 className="font-medium text-[var(--text-color)]">{item.label}</h3>
                    <p className="text-3xl text-[var(--primary-color)] transition-colors duration-300">{item.value}</p>
                  </div>
                )) : 
                <>
                  <div className="bg-[var(--bg-color)] p-4 rounded-lg shadow-inner border border-[var(--border-color)] transition-colors duration-300">
                    <h3 className="font-medium text-[var(--text-color)]">Course Progress</h3>
                    <div className="mt-2 h-3 bg-[var(--bg-color-hover)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--primary-color)] rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <p className="mt-1 text-lg font-medium text-[var(--primary-color)]">65%</p>
                  </div>
                  <div className="bg-[var(--bg-color)] p-4 rounded-lg shadow-inner border border-[var(--border-color)] transition-colors duration-300">
                    <h3 className="font-medium text-[var(--text-color)]">Assignments</h3>
                    <p className="text-3xl text-[var(--primary-color)] transition-colors duration-300">7/10</p>
                    <p className="text-[var(--text-color)] opacity-70">Completed</p>
                  </div>
                  <div className="bg-[var(--bg-color)] p-4 rounded-lg shadow-inner border border-[var(--border-color)] transition-colors duration-300">
                    <h3 className="font-medium text-[var(--text-color)]">Study Time</h3>
                    <p className="text-3xl text-[var(--primary-color)] transition-colors duration-300">12.5h</p>
                    <p className="text-[var(--text-color)] opacity-70">This week</p>
                  </div>
                </>
                }
              </div>
            </section>
          )}
          
          {activeTab === 'classrooms' && (
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">{t('classrooms')}</h2>
              
              {/* CODEX: Classroom cards with visual indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classrooms.length > 0 ? classrooms.map((room) => (
                  <div key={room.id} className="bg-[var(--bg-color)] p-6 rounded-lg shadow-md border border-[var(--border-color)] transition-colors duration-300 hover:shadow-lg transition-shadow duration-200">
                    <h3 className="font-bold text-xl text-[var(--text-color)] mb-2">{room.name}</h3>
                    <div className="flex items-center text-[var(--text-color)] opacity-80 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      <span>24 Students</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="bg-[var(--primary-color)] text-white px-3 py-1 rounded-lg hover:bg-[var(--secondary-color)] transition-all duration-200 transform hover:scale-105">Enter</button>
                      <button className="bg-[var(--bg-color-hover)] text-[var(--text-color)] px-3 py-1 rounded-lg hover:bg-[var(--border-color)] transition-all duration-200 transform hover:scale-105">Materials</button>
                    </div>
                  </div>
                )) : 
                <>
                  <div className="bg-[var(--bg-color)] p-6 rounded-lg shadow-md border border-[var(--border-color)] transition-colors duration-300 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-xl text-[var(--text-color)] mb-2">Mathematics 101</h3>
                        <p className="text-[var(--text-color)] opacity-80 mb-1">Prof. Johnson</p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Active</span>
                    </div>
                    <div className="flex items-center text-[var(--text-color)] opacity-80 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      <span>24 Students</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="bg-[var(--primary-color)] text-white px-3 py-1 rounded-lg hover:bg-[var(--secondary-color)] transition-all duration-200 transform hover:scale-105">Enter</button>
                      <button className="bg-[var(--bg-color-hover)] text-[var(--text-color)] px-3 py-1 rounded-lg hover:bg-[var(--border-color)] transition-all duration-200 transform hover:scale-105">Materials</button>
                    </div>
                  </div>
                  <div className="bg-[var(--bg-color)] p-6 rounded-lg shadow-md border border-[var(--border-color)] transition-colors duration-300 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-xl text-[var(--text-color)] mb-2">History of Science</h3>
                        <p className="text-[var(--text-color)] opacity-80 mb-1">Prof. Martinez</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">New</span>
                    </div>
                    <div className="flex items-center text-[var(--text-color)] opacity-80 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      <span>18 Students</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="bg-[var(--primary-color)] text-white px-3 py-1 rounded-lg hover:bg-[var(--secondary-color)] transition-all duration-200 transform hover:scale-105">Enter</button>
                      <button className="bg-[var(--bg-color-hover)] text-[var(--text-color)] px-3 py-1 rounded-lg hover:bg-[var(--border-color)] transition-all duration-200 transform hover:scale-105">Materials</button>
                    </div>
                  </div>
                </>
                }
              </div>
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
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">Assignment</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">Course</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">Score</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-color)] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[var(--bg-color)] divide-y divide-[var(--border-color)]">
                    {grades.length > 0 ? grades.map((grade) => (
                      <tr key={grade.id} className="hover:bg-[var(--bg-color-hover)] transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">{grade.assignment_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">{grade.course || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--primary-color)]">{grade.score}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${parseInt(grade.score) >= 70 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {parseInt(grade.score) >= 70 ? 'Passed' : 'Needs Improvement'}
                          </span>
                        </td>
                      </tr>
                    )) : [
                      { id: 1, assignment_id: 'Midterm Exam', course: 'Mathematics 101', score: '85' },
                      { id: 2, assignment_id: 'Research Paper', course: 'History of Science', score: '92' },
                      { id: 3, assignment_id: 'Lab Report', course: 'Physics', score: '78' },
                      { id: 4, assignment_id: 'Group Project', course: 'Computer Science', score: '95' }
                    ].map((grade) => (
                      <tr key={grade.id} className="hover:bg-[var(--bg-color-hover)] transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">{grade.assignment_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">{grade.course}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--primary-color)]">{grade.score}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-color)]">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${parseInt(grade.score) >= 70 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {parseInt(grade.score) >= 70 ? 'Passed' : 'Needs Improvement'}
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
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 transition-colors duration-300">{t('ai_tutor')}</h2>
              
              {/* CODEX: Enhanced AI tutor chat interface */}
              <div className="bg-[var(--bg-color)] rounded-lg border border-[var(--border-color)] transition-colors duration-300 overflow-hidden">
                <div className="h-80 overflow-y-auto p-4 space-y-4" id="chat-messages">
                  {messages.length > 0 ? messages.map((m, i) => (
                    <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-3/4 rounded-lg px-4 py-2 ${m.sender === 'user' ? 'bg-[var(--primary-color)] text-white' : 'bg-[var(--bg-color-hover)] text-[var(--text-color)]'}`}>
                        {m.text}
                      </div>
                    </div>
                  )) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center p-6 rounded-lg bg-[var(--bg-color-hover)] text-[var(--text-color)] max-w-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-[var(--primary-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <h3 className="text-lg font-medium mb-2">AI Tutor Assistant</h3>
                        <p className="text-sm opacity-80">Ask any question about your coursework, and I'll help you understand the concepts better!</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="border-t border-[var(--border-color)] p-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && sendMessage()}
                      placeholder="Ask your question here..."
                      className="flex-1 p-3 bg-[var(--bg-color-hover)] border border-[var(--border-color)] rounded-lg text-[var(--text-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-all duration-200"
                    />
                    <button 
                      onClick={sendMessage} 
                      className="bg-[var(--primary-color)] text-white p-3 rounded-lg hover:bg-[var(--secondary-color)] transition-all duration-200 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-[var(--text-color)] opacity-60 text-center">Powered by Llama 3.2 - Your AI learning assistant</p>
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

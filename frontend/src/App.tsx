import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import Register from './components/Register';
import { loadPreferencesFromServer } from './services/UserPreferences';

/**
 * CODEX: Main App Component
 * Handles routing and user preference initialization
 */
function App() {
  // CODEX: Load user preferences from server on app start
  useEffect(() => {
    loadPreferencesFromServer();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-color)] transition-colors duration-300">
      <Routes>
        <Route path="/login" element={<Login />} />
        {process.env.REACT_APP_ENABLE_REGISTER === 'true' && (
          <Route path="/register" element={<Register />} />
        )}
        <Route path="/student" element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />
        <Route path="/teacher" element={<PrivateRoute role="teacher"><TeacherDashboard /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;

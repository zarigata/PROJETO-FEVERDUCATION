import React from 'react';
import { useNavigate } from 'react-router-dom';

// CODEX: DashboardLayout.tsx - Provides a consistent dashboard layout with header and logout functionality

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<LayoutProps> = ({ title, children }) => {
  // CODEX: useNavigate hook to redirect users
  const navigate = useNavigate();
  const handleLogout = () => {
    // CODEX: Remove user token from storage and navigate to login
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] transition-colors duration-300">
      {/* CODEX: Header section with title and logout button - Enhanced with Material Design */}
      <header className="bg-[var(--primary-color)] text-white px-6 py-5 flex justify-between items-center shadow-lg sticky top-0 z-10 transition-colors duration-300">
        <h1 className="text-2xl font-bold tracking-wide">{title}</h1>
        <button onClick={handleLogout} className="bg-white text-[var(--primary-color)] px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transform hover:scale-105 transition-all duration-200">
          {/* CODEX: Logout button to clear session and redirect */}
          Logout
        </button>
      </header>
      {/* CODEX: Main content area for dashboard pages - Improved spacing and responsiveness */}
      <main className="p-6 max-w-7xl mx-auto transition-all duration-300">
        {children}
      </main>
      {/* CODEX: Footer for additional branding or info */}
      <footer className="bg-[var(--card-bg)] text-[var(--text-color)] text-center py-4 text-sm mt-8 shadow-inner transition-colors duration-300">
        FeverDucation {new Date().getFullYear()} - Empowering Learning
      </footer>
    </div>
  );
};

export default DashboardLayout;

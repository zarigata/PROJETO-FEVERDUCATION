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
    <div className="min-h-screen bg-gray-100">
      {/* CODEX: Header section with title and logout button */}
      <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-medium">{title}</h1>
        <button onClick={handleLogout} className="bg-white text-blue-600 px-3 py-1 rounded">
          {/* CODEX: Logout button to clear session and redirect */}
          Logout
        </button>
      </header>
      {/* CODEX: Main content area for dashboard pages */}
      <main className="p-4">{children}</main>
    </div>
  );
};

export default DashboardLayout;

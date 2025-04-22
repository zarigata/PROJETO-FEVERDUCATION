import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<LayoutProps> = ({ title, children }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-medium">{title}</h1>
        <button onClick={handleLogout} className="bg-white text-blue-600 px-3 py-1 rounded">
          Logout
        </button>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
};

export default DashboardLayout;

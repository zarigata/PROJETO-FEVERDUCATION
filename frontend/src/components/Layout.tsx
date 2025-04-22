import React from 'react';
import { Link } from 'react-router-dom';

// CODEX-STYLE LAYOUT COMPONENT
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex h-screen">
    <nav className="w-64 bg-gray-800 text-white p-6">
      <h2 className="text-2xl font-bold mb-6">FeverDucation</h2>
      <ul className="space-y-3">
        <li><Link to="/dashboard" className="hover:text-gray-400">Dashboard</Link></li>
        <li><Link to="/classrooms" className="hover:text-gray-400">Classrooms</Link></li>
        <li><Link to="/assignments" className="hover:text-gray-400">Assignments</Link></li>
        <li><Link to="/analytics" className="hover:text-gray-400">Analytics</Link></li>
        <li><Link to="/ai" className="hover:text-gray-400">AI Tutor</Link></li>
        <li><Link to="/" className="hover:text-gray-400">Logout</Link></li>
      </ul>
    </nav>
    <main className="flex-1 bg-white p-8 overflow-auto">
      {children}
    </main>
  </div>
);

export default Layout;

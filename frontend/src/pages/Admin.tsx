// CODEX-STYLE: FeverDucation Admin Panel (LAN Only UI)
import React from 'react';

const Admin: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-blue-900">
      <div className="bg-white/90 shadow-2xl rounded-lg p-10 w-full max-w-xl border border-blue-700">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-6 text-center">Admin Panel</h1>
        <div className="mb-6 text-center text-gray-700">
          <p>Welcome, Admin! Here you can manage users, view analytics, and control FeverDucation system settings.</p>
          <p className="text-xs mt-2 text-red-600 font-mono">LAN only: Accessible at <b>http://LAN_IP:1488</b></p>
        </div>
        <div className="flex flex-col gap-4">
          <button className="w-full bg-blue-700 text-white font-bold py-2 px-4 rounded hover:bg-blue-800 transition">User Management</button>
          <button className="w-full bg-purple-700 text-white font-bold py-2 px-4 rounded hover:bg-purple-800 transition">Analytics</button>
          <button className="w-full bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-800 transition">System Settings</button>
        </div>
      </div>
    </div>
  );
};

export default Admin;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/http';

// CODEX-STYLE REGISTRATION PAGE WITH BACKEND INTEGRATION
const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/register', { username, email, password });
      navigate('/');
    } catch (err: any) {
      console.error('Register error:', err.response?.data || err);
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-green-900 via-green-700 to-blue-800">
      <div className="flex flex-col justify-center items-center flex-1">
        <div className="bg-white/95 shadow-2xl rounded-2xl p-10 w-full max-w-md border-t-8 border-green-600">
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-4xl font-extrabold text-green-700 tracking-tight">Create Account</h1>
            <span className="text-gray-500 font-mono text-xs mt-1">Join FeverDucation Today</span>
          </div>
          {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center font-semibold">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label htmlFor="username" className="block text-gray-700 font-semibold mb-1">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 text-gray-800"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 text-gray-800"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 text-gray-800"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-2 rounded-lg shadow transition-all"
            >
              Register
            </button>
          </form>
        </div>
      </div>
      <footer className="text-center text-gray-200 text-xs py-4 opacity-80">
        &copy; {new Date().getFullYear()} FeverDucation. All rights reserved.
      </footer>
    </div>
  );
};

export default Register;

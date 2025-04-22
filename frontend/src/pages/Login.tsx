import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

// CODEX-STYLE LOGIN PAGE WITH TAILWIND STYLING
const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-900 via-blue-700 to-purple-800">
      <div className="flex flex-col justify-center items-center flex-1">
        <div className="bg-white/95 shadow-2xl rounded-2xl p-10 w-full max-w-md border-t-8 border-blue-700">
          <div className="flex flex-col items-center mb-6">
            <img src="/logo.svg" alt="FeverDucation Logo" className="w-16 h-16 mb-2 drop-shadow-lg" />
            <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">FeverDucation</h1>
            <span className="text-blue-400 font-mono text-xs mt-1">Learn. Teach. Evolve.</span>
          </div>
          {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center font-semibold">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="username">Username</label>
              <input
                id="username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800 bg-gray-50"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                required
                placeholder="Your username"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="password">Password</label>
              <input
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800 bg-gray-50"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-700 to-purple-600 hover:from-blue-800 hover:to-purple-700 text-white font-bold py-2 rounded-lg shadow transition-all"
            >
              Sign In
            </button>
          </form>
          <div className="mt-6 flex flex-col gap-2">
            <button className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 shadow-sm font-medium transition">
              <span className="mr-2">🔒</span> Sign in with Google
            </button>
            <button
              className="w-full text-blue-700 hover:underline text-sm mt-2"
              type="button"
              onClick={() => navigate('/register')}
            >
              Don&apos;t have an account? <span className="font-semibold">Sign Up</span>
            </button>
          </div>
        </div>
      </div>
      <footer className="text-center text-gray-200 text-xs py-4 opacity-80">
        &copy; {new Date().getFullYear()} FeverDucation. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;

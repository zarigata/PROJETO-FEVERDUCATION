import React, { createContext, useState, useEffect } from 'react';
import api from '../api/http';

interface User { id: number; username: string; role: string; }
interface AuthContextProps {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = async (username: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    params.append('grant_type', 'password');
    const res = await api.post('/login', params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    const { access_token } = res.data;
    localStorage.setItem('token', access_token);
    api.defaults.headers['Authorization'] = `Bearer ${access_token}`;
    // fetch user info
    const me = await api.get('/me');
    setUser(me.data);
    localStorage.setItem('user', JSON.stringify(me.data));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

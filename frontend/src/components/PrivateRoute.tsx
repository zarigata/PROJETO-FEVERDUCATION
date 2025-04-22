import React, { useState, useEffect, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../api';

interface PrivateRouteProps { children: ReactNode; role?: string; }

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    api.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  if (loading) return <div className="p-8">Loading...</div>;
  if (role && user?.role !== role) return <div className="p-8">Access Denied</div>;
  return <>{children}</>;
};

export default PrivateRoute;

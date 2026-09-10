import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/me')
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.clear();
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.clear();
      navigate('/login');
    }
  };

  if (!user) return <p>Chargement...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h2>Bienvenue, {user.name} 👋</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rôle:</strong> {user.role}</p>
      <button onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white' }}>
        Se déconnecter
      </button>
    </div>
  );
};

export default Dashboard;
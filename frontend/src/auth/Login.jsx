import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/login', formData);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h2>Connexion (تسجيل الدخول)</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" onChange={handleChange} required style={{ width: '100%' }} />
        </div>
        <div>
          <label>Mot de passe:</label>
          <input type="password" name="password" onChange={handleChange} required style={{ width: '100%' }} />
        </div>
        <button type="submit" style={{ marginTop: '15px', width: '100%' }}>Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
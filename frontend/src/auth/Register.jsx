import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'client' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const res = await api.post('/register', formData);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h2>Inscription (إنشاء حساب)</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom:</label>
          <input type="text" name="name" onChange={handleChange} required style={{ width: '100%' }} />
          {errors.name && <span style={{ color: 'red' }}>{errors.name[0]}</span>}
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" onChange={handleChange} required style={{ width: '100%' }} />
          {errors.email && <span style={{ color: 'red' }}>{errors.email[0]}</span>}
        </div>
        <div>
          <label>Mot de passe:</label>
          <input type="password" name="password" onChange={handleChange} required style={{ width: '100%' }} />
          {errors.password && <span style={{ color: 'red' }}>{errors.password[0]}</span>}
        </div>
        <button type="submit" style={{ marginTop: '15px', width: '100%' }}>S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;
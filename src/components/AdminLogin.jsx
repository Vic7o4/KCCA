import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminLogin.css';
import { useAuth } from '../contexts/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/admin/login', credentials);
      login(response.data.token);
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <h2>KCCA Admin Login</h2>
        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && <p className="error-message">{error}</p>}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 
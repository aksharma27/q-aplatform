import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = (values) => {
    const errors = {};
    if (!values.username) errors.username = 'Username is required';
    if (!values.email) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Invalid email format';
    if (!values.password) errors.password = 'Password is required';
    else if (values.password.length < 6) errors.password = 'Password must be at least 6 characters';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm({ username, email, password });
    setErrors(formErrors);
    if (Object.keys(formErrors).length) return;
    await api.post('/auth/register', { username, email, password });
    navigate('/login');
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Create your Stackit account</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input className="register-input" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
        {errors.username && <span className="register-error">{errors.username}</span>}
        <input className="register-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        {errors.email && <span className="register-error">{errors.email}</span>}
        <input className="register-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        {errors.password && <span className="register-error">{errors.password}</span>}
        <button className="register-btn" type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
import React, { useContext, useState } from 'react';
import api from '../api'; // Adjust the import path as necessary
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = (values) => {
    const errors = {};
    if (!values.email) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Invalid email format';
    if (!values.password) errors.password = 'Password is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm({ email, password });
    setErrors(formErrors);
    if (Object.keys(formErrors).length) return;
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        {errors.email && <span>{errors.email}</span>}
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {errors.password && <span>{errors.password}</span>}
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
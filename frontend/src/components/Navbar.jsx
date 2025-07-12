import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/">Home</Link> | <Link to="/ask">Ask</Link>
      {user ? (
        <>
          {' '}| <span>Hello, {user.username}</span>
          {' '}<button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          {' '}| <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
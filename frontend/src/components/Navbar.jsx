import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    const socket = io();
    socket.on('notification', () => {
      setNotificationCount(prev => prev + 1);
      setHasNotification(true);
    });
    return () => socket.disconnect();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleThemeToggle = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      document.body.classList.toggle('dark-mode', newMode);
      return newMode;
    });
  };

  return (
    <nav className={`navbar${document.body.classList.contains('dark-mode') ? ' dark-mode' : ''}`}>
      <div className="navbar-left">
        <div className="navbar-logo">
          <span className="logo-icon">🧩</span>
          <span className="logo-text">stackit</span>
        </div>
        <div className="navbar-links-row">
          <Link to="/" className="navbar-link">Home</Link>
          {user && <Link to="/ask" className="navbar-link">Ask</Link>}
        </div>
      </div>
      <div className="navbar-right">
        <button className="theme-toggle" onClick={handleThemeToggle} aria-label="Toggle dark mode">
          {darkMode ? '🌙' : '☀️'}
        </button>
        <div className="notification-container">
          <span className="notification-icon">
            <i className="fas fa-bell"></i>
            {hasNotification && (
              <span className="notification-badge" style={{width: '12px', height: '12px', padding: 0, borderRadius: '50%', top: '-4px', right: '-4px', background: '#e53e3e', display: 'inline-block'}}></span>
            )}
          </span>
        </div>
        {!user && (
          <>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/register" className="navbar-link">Register</Link>
          </>
        )}
        {user && (
          <>
            <Link to="/dashboard" className="navbar-user">Hello, {user.username}</Link>
            <button className="navbar-logout" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
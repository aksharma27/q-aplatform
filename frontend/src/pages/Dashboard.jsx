import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [myQuestions, setMyQuestions] = useState([]);

  useEffect(() => {
    const fetchMyQuestions = async () => {
      if (!user) return;
      const token = localStorage.getItem('token');
      const res = await api.get('/questions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter questions by current user
      setMyQuestions(Array.isArray(res.data) ? res.data.filter(q => q.author === user._id || q.author._id === user._id) : []);
    };
    fetchMyQuestions();
  }, [user]);

  if (!user) return <div className="dashboard-container">Please login to view your dashboard.</div>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">My Dashboard</h2>
      <div className="dashboard-profile">
        <h3>Profile</h3>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role || 'User'}</p>
      </div>
      <div className="dashboard-questions">
        <h3>My Questions</h3>
        {myQuestions.length === 0 ? (
          <p>No questions posted yet.</p>
        ) : (
          myQuestions.map(q => (
            <div key={q._id} className="dashboard-question-card">
              <h4>{q.title}</h4>
              <div dangerouslySetInnerHTML={{ __html: q.description }} />
              <small>Tags: {q.tags.join(', ')}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;

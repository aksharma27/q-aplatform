import React, { useEffect, useState } from 'react';
import api from '../api'; // Adjust the import path as necessary
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pendingQuestions, setPendingQuestions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchAdminData = async () => {
      try {
        const resUsers = await api.get('/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const resQuestions = await api.get('/admin/pending-questions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(resUsers.data);
        setPendingQuestions(resQuestions.data);
      } catch {
        toast.error('Failed to load admin data');
      }
    };
    fetchAdminData();
  }, []);

  const handleBan = async (userId) => {
    const token = localStorage.getItem('token');
    await api.post(`/admin/ban/${userId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(users.map(u => u._id === userId ? { ...u, banned: true } : u));
    toast.success('User banned');
  };

  const handleReject = async (questionId) => {
    const token = localStorage.getItem('token');
    await api.post(`/admin/reject/${questionId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPendingQuestions(pendingQuestions.filter(q => q._id !== questionId));
    toast.success('Question rejected');
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <section>
        <h3>Pending Questions</h3>
        {pendingQuestions.length === 0 && <p>No pending questions</p>}
        {pendingQuestions.map(q => (
          <div key={q._id} style={{ borderBottom: '1px solid #ccc' }}>
            <h4>{q.title}</h4>
            <button onClick={() => handleReject(q._id)}>Reject</button>
          </div>
        ))}
      </section>

      <section>
        <h3>Users</h3>
        {users.map(u => (
          <div key={u._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{u.username} ({u.email}) {u.banned && '🚫'}</span>
            {!u.banned && <button onClick={() => handleBan(u._id)}>Ban</button>}
          </div>
        ))}
      </section>
    </div>
  );
};

export default AdminDashboard;

import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api'; // Adjust the import path as necessary
import { AuthContext } from '../context/AuthContext';
import ReactQuill from 'react-quill';
import { toast } from 'react-toastify';
import 'react-quill/dist/quill.snow.css';

const QuestionDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/questions/${id}`);
      setQuestion(res.data);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      const token = localStorage.getItem('token');
      const res = await api.get('/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    };
    fetchNotifications();
  }, [user]);

  const submitAnswer = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`/answers/${id}`, { content: answer }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnswer('');
      const res = await api.get(`/questions/${id}`);
      setQuestion(res.data);
      toast.success('Answer posted');
    } catch (err) {
      toast.error('Error posting answer');
    }
  };

  const voteAnswer = async (answerId, type) => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`/answers/${answerId}/vote`, { type }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await api.get(`/questions/${id}`);
      setQuestion(res.data);
    } catch {
      toast.error('Error voting');
    }
  };

  const acceptAnswer = async (answerId) => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`/questions/${id}/accept/${answerId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await api.get(`/questions/${id}`);
      setQuestion(res.data);
    } catch {
      toast.error('Error accepting answer');
    }
  };

  if (!question) return <div>Loading...</div>;

  return (
    <div>
      <h2>{question.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: question.description }} />
      <p>Tags: {question.tags.join(', ')}</p>
      <h3>Answers</h3>
      {question.answers && question.answers.map((a) => (
        <div key={a._id} style={{ borderBottom: '1px solid #ddd' }}>
          <div dangerouslySetInnerHTML={{ __html: a.content }} />
          <p>Votes: {a.votes.up.length - a.votes.down.length}</p>
          <button onClick={() => voteAnswer(a._id, 'up')}>Upvote</button>
          <button onClick={() => voteAnswer(a._id, 'down')}>Downvote</button>
          {user && user.id === question.author._id && question.acceptedAnswer !== a._id && (
            <button onClick={() => acceptAnswer(a._id)}>Accept</button>
          )}
          {question.acceptedAnswer === a._id && <span>✅ Accepted</span>}
        </div>
      ))}
      {user && (
        <div>
          <h4>Your Answer</h4>
          <ReactQuill value={answer} onChange={setAnswer} />
          <button onClick={submitAnswer}>Post Answer</button>
        </div>
      )}
      {user && notifications.length > 0 && (
        <div>
          <h4>🔔 Notifications</h4>
          <ul>
            {notifications.slice(0, 5).map((n) => (
              <li key={n._id}>{n.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuestionDetail;
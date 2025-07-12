import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api'; // Adjust the import path as necessary
import { AuthContext } from '../context/AuthContext';
import ReactQuill, { Quill } from 'react-quill';
import { toast } from 'react-toastify';
import 'react-quill/dist/quill.snow.css';
import EmojiPicker from 'emoji-picker-react';
import './QuestionDetail.css'; // Add this import
import socket from '../main';
import { io } from "socket.io-client";
import ErrorBoundary from '../components/ErrorBoundary';

const QuestionDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [hasNotification, setHasNotification] = useState(false);
  const [alignment, setAlignment] = useState("left");

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

  useEffect(() => {
    if (!question) return;
    socket.on('answerAdded', ({ questionId, answer }) => {
      if (questionId === id) {
        setQuestion(prev => ({
          ...prev,
          answers: [...(prev.answers || []), answer]
        }));
      }
    });
    socket.on('voteUpdated', ({ answerId, votes }) => {
      setQuestion(prev => ({
        ...prev,
        answers: prev.answers.map(a =>
          a._id === answerId ? { ...a, votes } : a
        )
      }));
    });
    return () => {
      socket.off('answerAdded');
      socket.off('voteUpdated');
    };
  }, [question, id]);

  useEffect(() => {
    const socket = io();
    socket.on("notification", () => {
      setNotificationCount((prev) => prev + 1);
      setHasNotification(true);
    });
    return () => socket.disconnect();
  }, []);

  const submitAnswer = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.post(`/answers/${id}`, {
        content: answer
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnswer('');
      // Optimistically add the new answer to the UI
      setQuestion(prev => ({
        ...prev,
        answers: [...(prev.answers || []), res.data]
      }));
      // Optionally, refetch from backend for latest data
      // const updated = await api.get(`/questions/${id}`);
      // setQuestion(updated.data);
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

  const handleEmojiClick = (emojiData) => {
    setAnswer(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Add strikethrough to Quill toolbar
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'emoji'],
      ['clean'],
      [{ 'align': [] }], // add alignment action
    ]
  };

  if (!question) return <div>Loading...</div>;

  return (
    <ErrorBoundary>
      <div style={{ marginBottom: '1rem', textAlign: 'left', width: '100%' }}>
        <label style={{ marginRight: '1rem' }}>Text Alignment:</label>
        <select value={alignment} onChange={e => setAlignment(e.target.value)}>
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div className="notification-container">
        <span className="notification-icon">
          <i className="fas fa-bell"></i>
          {hasNotification && (
            <span className="notification-badge" style={{width: '12px', height: '12px', padding: 0, borderRadius: '50%', top: '-4px', right: '-4px', background: '#e53e3e', display: 'inline-block'}}></span>
          )}
        </span>
      </div>
      <div className="question-detail-container">
        <h2 className="question-detail-title">{question.title}</h2>
        <div className="question-detail-desc" dangerouslySetInnerHTML={{ __html: question.description }} />
        <p className="question-detail-tags">Tags: {question.tags.join(', ')}</p>
        <h3 className="question-detail-answers-title">Answers</h3>
        {question.answers && question.answers.map((a) => (
          <div key={a._id} className="answer-card">
            <div className="answer-content" dangerouslySetInnerHTML={{ __html: a.content }} />
            <p className="answer-votes">Votes: {a.votes.up.length - a.votes.down.length}</p>
            <button className="answer-btn" onClick={() => voteAnswer(a._id, 'up')}>Upvote</button>
            <button className="answer-btn" onClick={() => voteAnswer(a._id, 'down')}>Downvote</button>
            {user && user.id === question.author._id && question.acceptedAnswer !== a._id && (
              <button className="answer-btn" onClick={() => acceptAnswer(a._id)}>Accept</button>
            )}
            {question.acceptedAnswer === a._id && <span className="answer-accepted">✅ Accepted</span>}
          </div>
        ))}
        {user && (
          <div>
            <h4>Your Answer</h4>
            <ReactQuill value={answer} onChange={setAnswer} modules={modules} className={`align-${alignment}`} />
            <button type="button" onClick={() => setShowEmojiPicker(true)}>😊</button>
            {showEmojiPicker && (
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            )}
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
    </ErrorBoundary>
  );
};

export default QuestionDetail;
import React, { useState, useContext } from 'react';
import api from "../api";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EmojiPicker from 'emoji-picker-react';
import "./AskQuesion.css"

const AskQuestion = () => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [errors, setErrors] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiTarget, setEmojiTarget] = useState(''); // 'title' or 'description'
  const [alignment, setAlignment] = useState("left");
  const navigate = useNavigate();

  const validateForm = (values) => {
    const errors = {};
    if (!values.title) errors.title = 'Title is required';
    if (!values.description) errors.description = 'Description is required';
    if (!values.tags || values.tags.length === 0) errors.tags = 'At least one tag is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formErrors = validateForm({ title, description, tags: tags.split(',').map(t => t.trim()) });
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;
    await api.post('/questions', {
      title,
      description,
      tags: tags.split(',').map(t => t.trim())
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate('/');
  };

  const handleEmojiClick = (emojiData) => {
    if (emojiTarget === 'title') {
      setTitle(prev => prev + emojiData.emoji);
    } else if (emojiTarget === 'description') {
      setDescription(prev => prev + emojiData.emoji);
    }
    setShowEmojiPicker(false);
  };

  // Add strikethrough to Quill toolbar
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'], // add 'strike' here
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'emoji'],
      ['clean'],
      [{ 'align': [] }], // add alignment action
    ]
  };

  return (
    <form className="ask-form" onSubmit={handleSubmit}>
      <h2 className="ask-title">Ask a Question</h2>
      <div style={{ marginBottom: '1rem', textAlign: 'left', width: '100%' }}>
        <label style={{ marginRight: '1rem' }}>Text Alignment:</label>
        <select value={alignment} onChange={e => setAlignment(e.target.value)}>
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div className="ask-input-wrapper">
        <span className="ask-emoji-icon" onClick={() => { setShowEmojiPicker(true); setEmojiTarget('title'); }}>😊</span>
        <input className="ask-input with-emoji" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Question Title" />
      </div>
      {errors.title && <span className="ask-error">{errors.title}</span>}
      <div className="ask-input-wrapper">
        <span className="ask-emoji-icon" onClick={() => { setShowEmojiPicker(true); setEmojiTarget('description'); }}>😊</span>
        <ReactQuill value={description} onChange={setDescription} placeholder="Describe your question" className={`ask-quill with-emoji align-${alignment}`} modules={modules} />
      </div>
      {errors.description && <span className="ask-error">{errors.description}</span>}
      <input className="ask-input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma separated)" />
      {errors.tags && <span className="ask-error">{errors.tags}</span>}
      <button className="ask-btn" type="submit">Ask</button>
      {showEmojiPicker && (
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      )}
    </form>
  );
};

export default AskQuestion;

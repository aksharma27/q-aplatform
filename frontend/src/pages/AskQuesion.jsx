import React, { useState, useContext } from 'react';
import api from "../api";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AskQuestion = () => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [errors, setErrors] = useState({});
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

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Question Title" />
      {errors.title && <span>{errors.title}</span>}
      <ReactQuill value={description} onChange={setDescription} placeholder="Describe your question" />
      {errors.description && <span>{errors.description}</span>}
      <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma separated)" />
      {errors.tags && <span>{errors.tags}</span>}
      <button type="submit">Ask</button>
    </form>
  );
};

export default AskQuestion;

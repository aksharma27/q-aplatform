import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './Home.css';

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    const cachedQuestions = localStorage.getItem('questions');
    if (cachedQuestions) {
      setQuestions(JSON.parse(cachedQuestions));
    }
    const fetchQuestions = async () => {
      const res = await api.get('/questions');
      if (Array.isArray(res.data)) {
        setQuestions(res.data);
        localStorage.setItem('questions', JSON.stringify(res.data));
      } else {
        setQuestions([]);
      }
    };
    // Only fetch if not cached
    if (!cachedQuestions) fetchQuestions();
  }, []);

  const tags = Array.from(
    new Set([].concat(...questions.map(q => q.tags || [])))
  );
  const filteredQuestions = selectedTag
    ? questions.filter(q => Array.isArray(q.tags) && q.tags.includes(selectedTag))
    : questions;

  return (
    <div className="home-container">
      <h2 className="home-title">All Questions</h2>
      <div className="home-filter">
        <strong>Filter by Tag:</strong>
        <select className="home-select" onChange={(e) => setSelectedTag(e.target.value)} value={selectedTag}>
          <option value="">All</option>
          {tags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
        </select>
      </div>
      {filteredQuestions.map(q => (
        <div key={q._id} className="question-card">
          <Link to={`/questions/${q._id}`} className="question-link"><h3 className="question-title">{q.title}</h3></Link>
          <div className="question-desc" dangerouslySetInnerHTML={{ __html: q.description }} />
          <small className="question-tags">Tags: {q.tags.join(', ')}</small>
        </div>
      ))}
    </div>
  );
};

export default Home;
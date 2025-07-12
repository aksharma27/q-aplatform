import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

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
  const filteredQuestions = selectedTag ? questions.filter(q => q.tags.includes(selectedTag)) : questions;

  return (
    <div>
      <h2>All Questions</h2>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Filter by Tag:</strong>
        <select onChange={(e) => setSelectedTag(e.target.value)} value={selectedTag}>
          <option value="">All</option>
          {tags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
        </select>
      </div>
      {filteredQuestions.map(q => (
        <div key={q._id} style={{ borderBottom: '1px solid #ddd', marginBottom: '1rem' }}>
          <Link to={`/questions/${q._id}`}><h3>{q.title}</h3></Link>
          <div dangerouslySetInnerHTML={{ __html: q.description }} />
          <small>Tags: {q.tags.join(', ')}</small>
        </div>
      ))}
    </div>
  );
};

export default Home;
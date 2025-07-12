import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './Home.css';

const QUESTIONS_PER_PAGE = 5;

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

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
        setTotalPages(Math.ceil(res.data.length / QUESTIONS_PER_PAGE));
      } else {
        setQuestions([]);
      }
    };
    // Only fetch if not cached
    if (!cachedQuestions) fetchQuestions();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await api.get('/questions');
      setQuestions(res.data);
      setTotalPages(Math.ceil(res.data.length / QUESTIONS_PER_PAGE));
    };
    fetchQuestions();
  }, [currentPage, questions.length]);

  const tags = Array.from(
    new Set([].concat(...questions.map(q => q.tags || [])))
  );
  const filteredQuestions = selectedTag
    ? questions.filter(q => Array.isArray(q.tags) && q.tags.includes(selectedTag))
    : questions;
  const searchedQuestions = searchTerm
    ? filteredQuestions.filter(q =>
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.description && q.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : filteredQuestions;
  const paginatedQuestions = searchedQuestions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  );

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
      <div className="home-search">
        <input
          type="text"
          className="home-search-input"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="questions-list">
        {paginatedQuestions.map(q => (
          <div key={q._id} className="question-card">
            <Link to={`/questions/${q._id}`} className="question-link"><h3 className="question-title">{q.title}</h3></Link>
            <div className="question-desc" dangerouslySetInnerHTML={{ __html: q.description }} />
            <small className="question-tags">Tags: {q.tags.join(', ')}</small>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="pagination-info">Page {currentPage} of {totalPages}</span>
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
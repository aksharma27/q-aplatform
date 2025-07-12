import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
})

// Central error handler for API calls
api.interceptors.response.use(
  response => response,
  error => {
    // Log error for debugging
    console.error('API Error:', error);
    // Optionally show a toast or notification here
    // Return a fallback response or propagate error
    return Promise.reject(error);
  }
);

export default api;
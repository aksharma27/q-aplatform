import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
})

// Central error handler for API calls
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
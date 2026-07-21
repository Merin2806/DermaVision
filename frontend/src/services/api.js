import axios from 'axios';

// Create an Axios instance pointing to the Node.js backend
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set up a request interceptor to attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('derma_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Set up a response interceptor to unwrap data from our standard apiResponse
api.interceptors.response.use((response) => {
  if (response.data && response.data.success === true && response.data.hasOwnProperty('data')) {
    return {
      ...response,
      data: response.data.data
    };
  }
  return response;
}, (error) => {
  return Promise.reject(error);
});

export default api;

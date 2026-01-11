import axios from 'axios';

const API_URL = "https://farmmoniweb.onrender.com/api"

const api = axios.create({
  baseURL: API_URL, 
});

// Automatically add Token to every request if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  // Do NOT attach token for login or register
  if (token && !config.url.includes('/auth/login') && !config.url.includes('/auth/register')) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export default api;
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Vite proxy handles the rest
  headers: {
    'Content-Type': 'application/json',
  },
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
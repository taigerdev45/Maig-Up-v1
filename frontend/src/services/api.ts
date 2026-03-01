import axios from 'axios';
import { auth } from '@/lib/firebase';

// Create an axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to inject the Firebase ID token
api.interceptors.request.use(async (config) => {
  const currentUser = auth.currentUser;
  
  if (currentUser) {
    const token = await currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;

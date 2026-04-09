import axios from 'axios';
import type { Application, AIParseResponse, AuthResponse, CreateApplicationData } from '../types';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login if token expired
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  verifyToken: () =>
    api.get<{ user: { _id: string; email: string; name: string } }>('/auth/verify'),
};

export const applicationAPI = {
  getAll: () =>
    api.get<Application[]>('/applications'),

  getById: (id: string) =>
    api.get<Application>(`/applications/${id}`),

  create: (data: CreateApplicationData) =>
    api.post<Application>('/applications', data),

  update: (id: string, data: Partial<Application>) =>
    api.put<Application>(`/applications/${id}`, data),

  delete: (id: string) =>
    api.delete(`/applications/${id}`),
};

export const aiAPI = {
  parseJobDescription: (jobDescription: string) =>
    api.post<AIParseResponse>('/ai/parse-jd', { jobDescription }),
};

export default api;

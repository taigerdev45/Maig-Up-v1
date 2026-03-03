import axios from 'axios';
import { auth } from '@/lib/firebase';
import type { Contact, Registration, DashboardStats, SiteContent } from '@/types';

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

// === Content ===

export const getContent = async (): Promise<SiteContent> => {
  const { data } = await api.get('/content');
  return data;
};

// === Contacts ===

export const submitContact = async (contactData: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string;
  service?: string;
  message: string;
}) => {
  const { data } = await api.post('/contacts', contactData);
  return data;
};

export const getContacts = async (): Promise<Contact[]> => {
  const { data } = await api.get('/contacts');
  return data;
};

export const updateContactStatus = async (id: string, status: Contact['status']) => {
  const { data } = await api.put(`/contacts/${id}/status`, { status });
  return data;
};

export const deleteContact = async (id: string) => {
  const { data } = await api.delete(`/contacts/${id}`);
  return data;
};

// === Registrations ===

export const submitRegistration = async (regData: {
  name: string;
  email: string;
  phone?: string;
  country: string;
  program: string;
  message?: string;
}) => {
  const { data } = await api.post('/registrations', regData);
  return data;
};

export const getRegistrations = async (page = 1, limit = 50): Promise<{ data: Registration[]; total: number; page: number; limit: number }> => {
  const { data } = await api.get(`/registrations?page=${page}&limit=${limit}`);
  return data;
};

export const updateRegistrationStatus = async (id: string, status: Registration['status']) => {
  const { data } = await api.put(`/registrations/${id}/status`, { status });
  return data;
};

export const deleteRegistration = async (id: string) => {
  const { data } = await api.delete(`/registrations/${id}`);
  return data;
};

// === Testimonials ===

export const submitTestimonial = async (testimonialData: {
  name: string;
  country: string;
  quote: string;
  university?: string;
  program?: string;
}) => {
  const { data } = await api.post('/testimonials', testimonialData);
  return data;
};

export const getPendingTestimonials = async () => {
  const { data } = await api.get('/testimonials');
  return data;
};

export const updateTestimonialStatus = async (id: string, status: string) => {
  const { data } = await api.put(`/testimonials/${id}/status`, { status });
  return data;
};

export const deleteTestimonialSubmission = async (id: string) => {
  const { data } = await api.delete(`/testimonials/${id}`);
  return data;
};

// === Visits ===

export const recordVisit = async (page: string) => {
  const { data } = await api.post('/visits', { page });
  return data;
};

export interface VisitStats {
  total: number;
  byPage: Record<string, number>;
  timeline: Array<Record<string, string | number>>;
  pages: string[];
  period: string;
}

export const getVisitStats = async (period = '7d'): Promise<VisitStats> => {
  const { data } = await api.get(`/visits/stats?period=${period}`);
  return data;
};

// === Dashboard ===

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get('/dashboard/stats');
  return data;
};

export interface EvolutionData {
  timeline: Array<{ date: string; contacts: number; registrations: number }>;
  period: string;
}

export const getEvolutionData = async (period = '30d'): Promise<EvolutionData> => {
  const { data } = await api.get(`/dashboard/evolution?period=${period}`);
  return data;
};

export default api;

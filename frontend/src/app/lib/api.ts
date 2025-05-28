import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  withCredentials: true,
});

export async function register(username: string, password: string) {
  return api.post('/register', { username, password });
}

export async function login(username: string, password: string) {
  return api.post('/login', { username, password });
}

export async function logMood(token: string, moodText: string) {
  return api.post('/log-mood', { mood_text: moodText }, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getMoodHistory(token: string) {
  return api.get('/mood-history', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function clearMoodLogs(token: string) {
  return api.post('/clear-mood-logs', {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
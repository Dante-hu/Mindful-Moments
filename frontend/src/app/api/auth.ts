import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
});

//TypeScript interfaces for API responses
interface RegisterResponse {
  message: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

interface MoodResponse {
  message: string;
  sentiment: string;
  feedback: string;
}

interface MoodEntry {
  mood_text: string;
  sentiment: string;
  feedback: string;
  timestamp: string;
}

//Centralized error handling
async function handleApiError<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'API request failed');
  }
}

// Register a new user
export async function register(username: string, password: string): Promise<RegisterResponse> {
  return handleApiError(api.post('/register', { username, password }).then(res => res.data));
}

// Login and get JWT token
export async function login(username: string, password: string): Promise<TokenResponse> {
  return handleApiError(
    api
      .post('/login', new URLSearchParams({ username, password }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .then(res => res.data)
  );
}

// Log a mood
export async function logMood(token: string, moodText: string): Promise<MoodResponse> {
  return handleApiError(
    api
      .post('/log-mood', { mood_text: moodText }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => res.data)
  );
}

// Get mood history
export async function getMoodHistory(token: string): Promise<MoodEntry[]> {
  return handleApiError(
    api
      .get('/mood-history', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => res.data)
  );
}

// Clear mood logs
export async function clearMoodLogs(token: string): Promise<RegisterResponse> {
  return handleApiError(
    api
      .post('/clear-mood-logs', {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => res.data)
  );
}
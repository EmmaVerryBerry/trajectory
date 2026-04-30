import axios from 'axios';

// Base API URL - falls back to localhost if env not set
const API_URL = process.env.API_URL || 'http://localhost:3000/api';

// In-memory token storage (no AsyncStorage dependency needed)
let authToken = null;
let userData = null;

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) { authToken = null; userData = null; }
    return Promise.reject(error);
  }
);

// Helper: try API, fall back to mock
const tryApi = async (apiCall, fallback) => {
  try { return (await apiCall()).data; }
  catch { return typeof fallback === 'function' ? fallback() : fallback; }
};

// ── In-memory stores for offline mode ──
let localAccounts = [
  { userId: 1, username: 'tester', email: 'tester@gmail.com', password: 'tester', university: 'Florida State University', major: 'Computer Science' },
];
let localSessions = [];

// ── Auth ──
export const authAPI = {
  login: async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      authToken = res.data.token; userData = res.data.user;
      return res.data;
    } catch {
      const acct = localAccounts.find(a => a.email === email && a.password === password);
      if (acct) {
        authToken = 'offline-' + acct.userId;
        userData = { userId: acct.userId, username: acct.username, email: acct.email, university: acct.university, major: acct.major };
        return { token: authToken, user: userData };
      }
      const err = new Error('Invalid email or password');
      err.response = { data: { error: 'Invalid email or password' } };
      throw err;
    }
  },
  register: async (username, email, password, university, major) => {
    try {
      const res = await api.post('/auth/register', { username, email, password, university, major });
      authToken = res.data.token; userData = res.data.user;
      return res.data;
    } catch {
      if (localAccounts.find(a => a.email === email || a.username === username)) {
        const err = new Error('Email or username already exists');
        err.response = { data: { error: 'Email or username already exists' } };
        throw err;
      }
      const u = { userId: Date.now(), username, email, password, university, major };
      localAccounts.push(u);
      authToken = 'offline-' + u.userId;
      userData = { userId: u.userId, username, email, university, major };
      return { token: authToken, user: userData };
    }
  },
  logout: () => { authToken = null; userData = null; },
  getStoredUser: () => userData,
  getStoredToken: () => authToken,
};

// ── Users ──
export const usersAPI = {
  getProfile: (userId) => tryApi(() => api.get(`/users/profile/${userId}`),
    { userId: 1, username: 'tester', email: 'tester@gmail.com', university: 'Florida State University', major: 'Computer Science', bio: 'Striving to become an academic weapon', avatar: null }),
  updateProfile: (userId, data) => tryApi(() => api.put(`/users/profile/${userId}`, data), { ...data }),
  getStats: (userId) => tryApi(() => api.get(`/users/${userId}/stats`),
    { totalHours: 12, streak: 3, achievements: 2, weeklyHours: 3.3 }),
};

// ── Goals ──
export const goalsAPI = {
  create: (goalData) => tryApi(() => api.post('/goals', goalData), { goalId: Date.now(), ...goalData }),
  createGoal: (goalData) => goalsAPI.create(goalData),
  get: (userId) => tryApi(() => api.get(`/goals/${userId}`),
    { goalId: 1, creditHours: 15, intensityLevel: 'Normal', weeklyTarget: 30, dailyHours: 6 }),
  getGoal: (userId) => goalsAPI.get(userId),
  update: (goalId, data) => tryApi(() => api.put(`/goals/${goalId}`, data), data),
  updateGoal: (goalId, data) => goalsAPI.update(goalId, data),
  delete: (goalId) => tryApi(() => api.delete(`/goals/${goalId}`), { message: 'Deleted' }),
  deleteGoal: (goalId) => goalsAPI.delete(goalId),
};

// ── Study Sessions ──
export const studyAPI = {
  logSession: (sessionData) => {
    const s = { id: Date.now(), ...sessionData, date: sessionData.date || new Date().toISOString() };
    localSessions = [s, ...localSessions];
    return tryApi(() => api.post('/study/sessions', sessionData), s);
  },
  createSession: (sessionData) => studyAPI.logSession(sessionData),
  getSessions: (userId) => tryApi(() => api.get(`/study/sessions/${userId}`), () =>
    localSessions.length > 0 ? localSessions : [
      { id: 1, subject: 'Calculus II', duration: 120, date: new Date(Date.now() - 86400000).toISOString(), notes: 'Integration techniques' },
      { id: 2, subject: 'Physics', duration: 90, date: new Date(Date.now() - 172800000).toISOString(), notes: 'Thermodynamics chapter review' },
      { id: 3, subject: 'Chemistry', duration: 60, date: new Date(Date.now() - 259200000).toISOString(), notes: 'Lab report' },
    ]),
  getProgress: (userId) => tryApi(() => api.get(`/study/progress/${userId}`),
    { weeklyHours: 3.3, goalPercentage: 45, sessionsThisWeek: 4 }),
  getStreak: (userId) => tryApi(() => api.get(`/study/streak/${userId}`),
    { currentStreak: 3, longestStreak: 7 }),
    deleteSession: (sessionId) =>
  tryApi(() => api.delete(`/study/sessions/${sessionId}`), {
    message: 'Deleted',
  }),
};

// ── Achievements ──
export const achievementsAPI = {
  getAll: () => tryApi(() => api.get('/achievements'), [
    { id: 1, name: 'First Step', description: 'Complete first study session', icon: '✅', progress: 100, unlocked: true, category: 'milestone' },
    { id: 2, name: 'Week Warrior', description: 'Study 7 days in a row', icon: '🔥', progress: 57, unlocked: false, category: 'streak' },
    { id: 3, name: 'Time Master', description: 'Log 25 hours total', icon: '⏰', progress: 68, unlocked: false, category: 'hours' },
    { id: 4, name: 'Early Bird', description: 'Start session before 8am', icon: '🌅', progress: 100, unlocked: true, category: 'time' },
    { id: 5, name: 'Night Owl', description: 'Study past midnight', icon: '🌙', progress: 0, unlocked: false, category: 'time' },
    { id: 6, name: 'Focus King', description: 'Complete 10 pomodoros', icon: '👑', progress: 80, unlocked: false, category: 'focus' },
    { id: 7, name: 'Social Butterfly', description: 'Add 5 friends', icon: '🦋', progress: 40, unlocked: false, category: 'social' },
    { id: 8, name: 'Community Leader', description: 'Get 50 likes on posts', icon: '🏅', progress: 22, unlocked: false, category: 'community' },
  ]),
  getUserAchievements: (userId) => tryApi(() => api.get(`/achievements/user/${userId}`), [1, 4]),
  unlock: (data) => tryApi(() => api.post('/achievements/unlock', data), { message: 'Unlocked' }),
};

// ── Social / Friends ──
export const socialAPI = {
  getFriends: (userId) => tryApi(() => api.get(`/social/friends/${userId}`), [
    { id: 1, initials: 'SB', username: 'StudyBuddy23', hours: '28h' },
    { id: 2, initials: 'MW', username: 'MathWhiz', hours: '35h' },
    { id: 3, initials: 'CM', username: 'CodeMaster', hours: '42h' },
    { id: 4, initials: 'BG', username: 'BookGeek', hours: '18h' },
    { id: 5, initials: 'FP', username: 'FocusPro', hours: '31h' },
    { id: 6, initials: 'ST', username: 'StudyTime', hours: '22h' },
    { id: 7, initials: 'NL', username: 'NightOwl', hours: '45h' },
    { id: 8, initials: 'EA', username: 'EarlyBird', hours: '29h' },
  ]),
  addFriend: (data) => tryApi(() => api.post('/social/friends/add', data), { message: 'Added' }),
  getLeaderboard: (userId) => tryApi(() => api.get(`/social/leaderboard/friends/${userId}`), [
    { id: 1, rank: 1, initials: 'NL', username: 'NightOwl', hours: '45h', streak: 15, isCurrentUser: false },
    { id: 2, rank: 2, initials: 'CM', username: 'CodeMaster', hours: '42h', streak: 12, isCurrentUser: false },
    { id: 3, rank: 3, initials: 'MW', username: 'MathWhiz', hours: '35h', streak: 8, isCurrentUser: false },
    { id: 4, rank: 4, initials: 'FP', username: 'FocusPro', hours: '31h', streak: 10, isCurrentUser: false },
    { id: 5, rank: 5, initials: 'EA', username: 'EarlyBird', hours: '29h', streak: 7, isCurrentUser: true },
    { id: 6, rank: 6, initials: 'SB', username: 'StudyBuddy23', hours: '28h', streak: 5, isCurrentUser: false },
    { id: 7, rank: 7, initials: 'ST', username: 'StudyTime', hours: '22h', streak: 9, isCurrentUser: false },
    { id: 8, rank: 8, initials: 'BG', username: 'BookGeek', hours: '18h', streak: 3, isCurrentUser: false },
  ]),
  getFriendsLeaderboard: (userId) => socialAPI.getLeaderboard(userId),
  getActivity: (userId) => tryApi(() => api.get(`/social/activity/${userId}`), [
    { id: 1, type: 'session', username: 'CodeMaster', detail: 'completed a 2h study session', time: '2h ago' },
    { id: 2, type: 'achievement', username: 'MathWhiz', detail: 'earned "Week Warrior" achievement', time: '3h ago' },
    { id: 3, type: 'streak', username: 'NightOwl', detail: 'is on a 7-day streak!', time: '5h ago' },
    { id: 4, type: 'session', username: 'StudyBuddy23', detail: 'completed a 1.5h study session', time: '6h ago' },
    { id: 5, type: 'achievement', username: 'FocusPro', detail: 'earned "Focus Master" achievement', time: 'Yesterday' },
    { id: 6, type: 'streak', username: 'BookGeek', detail: 'is on a 10-day streak!', time: 'Yesterday' },
  ]),
  createActivity: (data) => tryApi(() => api.post('/social/activity', data), data),
  getGlobalLeaderboard: () => tryApi(() => api.get('/social/leaderboard/global'), []),
  getCommunityLeaderboard: (type, id) => tryApi(() => api.get(`/social/leaderboard/community/${type}/${id}`), []),
  removeFriend: (userId, friendId) =>
  tryApi(() => api.delete(`/social/friends/${userId}/${friendId}`), {
    message: 'Removed',
  }),
};

export default api;
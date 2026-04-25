import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.0.79:3000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  },

  register: async (username, email, password, university, major) => {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
      university,
      major,
    });

    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },

  getStoredToken: async () => {
    return AsyncStorage.getItem('token');
  },

  getStoredUser: async () => {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export const usersAPI = {
  getProfile: async (userId) => {
    const response = await api.get(`/users/profile/${userId}`);
    return response.data;
  },

  updateProfile: async (userId, data) => {
    const response = await api.put(`/users/profile/${userId}`, data);
    return response.data;
  },

  getStats: async (userId) => {
    const response = await api.get(`/users/${userId}/stats`);
    return response.data;
  },
};

export const goalsAPI = {
  create: async (goalData) => {
    const response = await api.post('/goals', goalData);
    return response.data;
  },

  createGoal: async (goalData) => {
    return goalsAPI.create(goalData);
  },

  get: async (userId) => {
    const response = await api.get(`/goals/${userId}`);
    return response.data;
  },

  getGoal: async (userId) => {
    return goalsAPI.get(userId);
  },

  update: async (goalId, data) => {
    const response = await api.put(`/goals/${goalId}`, data);
    return response.data;
  },

  updateGoal: async (goalId, data) => {
    return goalsAPI.update(goalId, data);
  },

  delete: async (goalId) => {
    const response = await api.delete(`/goals/${goalId}`);
    return response.data;
  },

  deleteGoal: async (goalId) => {
    return goalsAPI.delete(goalId);
  },
};

export const studyAPI = {
  logSession: async (sessionData) => {
    const response = await api.post('/study/sessions', sessionData);
    return response.data;
  },

  createSession: async (sessionData) => {
    return studyAPI.logSession(sessionData);
  },

  getSessions: async (userId) => {
    const response = await api.get(`/study/sessions/${userId}`);
    return response.data;
  },

  getProgress: async (userId) => {
    const response = await api.get(`/study/progress/${userId}`);
    return response.data;
  },

  getStreak: async (userId) => {
    const response = await api.get(`/study/streak/${userId}`);
    return response.data;
  },
};

export const achievementsAPI = {
  getAll: async () => {
    const response = await api.get('/achievements');
    return response.data;
  },

  getUserAchievements: async (userId) => {
    const response = await api.get(`/achievements/user/${userId}`);
    return response.data;
  },

  unlock: async (data) => {
    const response = await api.post('/achievements/unlock', data);
    return response.data;
  },
};

export const socialAPI = {
  getFriends: async (userId) => {
    const response = await api.get(`/social/friends/${userId}`);
    return response.data;
  },

  addFriend: async (data) => {
    const response = await api.post('/social/friends/add', data);
    return response.data;
  },

  getLeaderboard: async (userId) => {
    const response = await api.get(`/social/leaderboard/friends/${userId}`);
    return response.data;
  },

  getFriendsLeaderboard: async (userId) => {
    return socialAPI.getLeaderboard(userId);
  },

  getActivity: async (userId) => {
    const response = await api.get(`/social/activity/${userId}`);
    return response.data;
  },

  createActivity: async (data) => {
    const response = await api.post('/social/activity', data);
    return response.data;
  },

  getGlobalLeaderboard: async () => {
    const response = await api.get('/social/leaderboard/global');
    return response.data;
  },

  getCommunityLeaderboard: async (type, id) => {
    const response = await api.get(`/social/leaderboard/community/${type}/${id}`);
    return response.data;
  },
};

export default api;
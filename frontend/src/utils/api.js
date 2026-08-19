const BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Generic Fetch API wrapper with Automatic JWT Authorization Header injection
async function fetchJson(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    if (response.status === 401 || response.status === 403) {
      // Clear expired or invalid token
      if (token && errorBody.error && errorBody.error.includes('expired')) {
        localStorage.removeItem('token');
      }
    }
    throw new Error(errorBody.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Authentication
  auth: {
    login: async (rollNo, password) => {
      const data = await fetchJson('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ rollNo, password })
      });
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    },
    googleLogin: async (idToken) => {
      const data = await fetchJson('/auth/google-login', {
        method: 'POST',
        body: JSON.stringify({ idToken })
      });
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    },
    register: async (studentData) => {
      const data = await fetchJson('/auth/register', {
        method: 'POST',
        body: JSON.stringify(studentData)
      });
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    },
    changePassword: (payload) => fetchJson('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    logout: () => {
      localStorage.removeItem('token');
    }
  },

  // Weekly Menu
  menu: {
    get: (section) => fetchJson(`/menu${section ? `?section=${section}` : ''}`),
    update: (id, updateData) => fetchJson(`/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    })
  },

  // Food Change Polls
  polls: {
    get: (section) => fetchJson(`/polls${section ? `?section=${section}` : ''}`),
    create: (data) => fetchJson('/polls', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    vote: (pollId, optionId, rollNo) => fetchJson(`/polls/${pollId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ optionId, rollNo })
    }),
    close: (pollId) => fetchJson(`/polls/${pollId}/close`, { method: 'PUT' }),
    resolve: (pollId, winnerName) => fetchJson(`/polls/${pollId}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ winnerName })
    }),
    delete: (pollId) => fetchJson(`/polls/${pollId}`, { method: 'DELETE' })
  },

  // Notifications API
  notifications: {
    get: (section) => fetchJson(`/notifications${section ? `?section=${section}` : ''}`),
    send: (notifData) => fetchJson('/notifications', {
      method: 'POST',
      body: JSON.stringify(notifData)
    }),
    delete: (id) => fetchJson(`/notifications/${id}`, { method: 'DELETE' })
  },

  // Waste Logs & Portions Recommendation
  waste: {
    getLogs: (section) => fetchJson(`/waste/logs${section ? `?section=${section}` : ''}`),
    logDaily: (logData) => fetchJson('/waste/log', {
      method: 'POST',
      body: JSON.stringify(logData)
    }),
    submitFeedback: (feedbackData) => fetchJson('/waste/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData)
    }),
    getFeedbacks: (section) => fetchJson(`/waste/feedbacks${section ? `?section=${section}` : ''}`),
    deleteFeedback: (id) => fetchJson(`/waste/feedback/${id}`, { method: 'DELETE' }),
    getRecommendation: (date, meal, section) => fetchJson(`/waste/recommendation?date=${date}&meal=${meal}${section ? `&section=${section}` : ''}`)
  },

  // User Accounts Management (Admin)
  users: {
    getAll: () => fetchJson('/users'),
    create: (userData) => fetchJson('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
    update: (id, updateData) => fetchJson(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    }),
    delete: (id) => fetchJson(`/users/${id}`, { method: 'DELETE' })
  },

  // Visual Analytics
  analytics: {
    getLive: (section) => fetchJson(`/analytics/live${section ? `?section=${section}` : ''}`),
    getWaste: (section) => fetchJson(`/analytics/waste${section ? `?section=${section}` : ''}`),
    getQueue: (section) => fetchJson(`/analytics/queue${section ? `?section=${section}` : ''}`)
  },

  // Late Plate Reservations
  reservations: {
    create: (data) => fetchJson('/reservations', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    getByStudent: (rollNo) => fetchJson(`/reservations/student/${rollNo}`),
    getAdminList: (date, meal, section, status) => {
      let query = `?date=${date}&meal=${meal}`;
      if (section) query += `&section=${section}`;
      if (status) query += `&status=${status}`;
      return fetchJson(`/reservations${query}`);
    },
    updateStatus: (id, status) => fetchJson(`/reservations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    })
  }
};

const BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Generic Fetch API wrapper with Automatic JWT Authorization Header injection
export async function fetchJson(endpoint, options = {}) {
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

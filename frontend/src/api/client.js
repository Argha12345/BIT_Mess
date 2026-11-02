import { secureStorage } from '@/utils/secureStorage';

export const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');

// Helper to get active JWT token from all storage locations
export function getAuthToken() {
  let token = secureStorage.getItem('token');
  if (!token) {
    try {
      token = localStorage.getItem('token');
    } catch (_) {}
  }
  if (typeof token === 'object' && token !== null) {
    token = token.token || null;
  }
  return typeof token === 'string' && token.trim().length > 0 ? token.trim() : null;
}

// Generic Fetch API wrapper with Automatic JWT Authorization Header injection
export async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

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
    const errorMessage = errorBody.error || `HTTP error! status: ${response.status}`;

    // Clean up stale/invalid session on authentication failure
    if (response.status === 401 || response.status === 403) {
      if (
        errorMessage.includes('token') ||
        errorMessage.includes('Access denied') ||
        errorMessage.includes('expired') ||
        errorMessage.includes('Unauthorized') ||
        errorMessage.includes('Session expired')
      ) {
        secureStorage.removeItem('token');
        secureStorage.removeItem('user');
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } catch (_) {}

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: { message: errorMessage } }));
        }
      }
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

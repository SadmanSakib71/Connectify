const API_BASE = import.meta.env.VITE_API_URL || '/api';

const TOKEN_KEY = 'connectify_token';

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  sessionStorage.removeItem(TOKEN_KEY);
};

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    error.errors = data.errors;
    throw error;
  }

  return data;
};

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  return parseResponse(response);
};

export const authApi = {
  register: (payload) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMe: () => request('/auth/me'),
};

const RENDER_API_URL = 'https://connectify-api-34ww.onrender.com/api';

const API_BASE = import.meta.env.VITE_API_URL || RENDER_API_URL;

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN
  || (API_BASE.startsWith('http') ? API_BASE.replace(/\/api\/?$/, '') : '');

export const resolveMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return API_ORIGIN ? `${API_ORIGIN}${url}` : url;
};

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

const requestFormData = async (endpoint, formData, method = 'POST') => {
  const token = getToken();
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: formData,
  });

  return parseResponse(response);
};

export const feedApi = {
  getFeed: () => request('/posts/feed'),

  createPost: ({ text, visibility, image }) => {
    const formData = new FormData();
    formData.append('text', text);
    formData.append('visibility', visibility);
    if (image) {
      formData.append('image', image);
    }
    return requestFormData('/posts', formData);
  },

  deletePost: (postId) =>
    request(`/posts/${postId}`, { method: 'DELETE' }),

  getComments: (postId) => request(`/posts/${postId}/comments`),

  addComment: (postId, text) =>
    request(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),

  getReplies: (commentId) => request(`/comments/${commentId}/replies`),

  addReply: (commentId, text) =>
    request(`/comments/${commentId}/replies`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),

  toggleLike: (targetType, targetId) =>
    request('/likes/toggle', {
      method: 'POST',
      body: JSON.stringify({ targetType, targetId }),
    }),

  getLikeStatus: (targetType, targetId) =>
    request(`/likes?targetType=${targetType}&targetId=${targetId}`),

  getLikers: (targetType, targetId, { limit = 50, offset = 0 } = {}) =>
    request(
      `/likes/likers?targetType=${targetType}&targetId=${targetId}&limit=${limit}&offset=${offset}`,
    ),
};

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

let _accessToken = null;

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

function setAccessToken(token) {
  _accessToken = token;
}

function clearTokens() {
  _accessToken = null;
}

function getAccessToken() {
  return _accessToken;
}

async function refreshAccessToken() {
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    clearTokens();
    throw new ApiError('Session expired', 401);
  }

  const data = await res.json();
  _accessToken = data.accessToken;
  return data.accessToken;
}

async function apiClient(endpoint, options = {}) {
  const { method = 'GET', body, headers = {}, auth = true, timeout = 30000 } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const config = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    credentials: 'include',
    signal: controller.signal,
  };

  if (auth && _accessToken) {
    config.headers['Authorization'] = `Bearer ${_accessToken}`;
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    let res = await fetch(`${BASE_URL}${endpoint}`, config);

    if (res.status === 401 && auth && _accessToken) {
      const newToken = await refreshAccessToken();
      config.headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(`${BASE_URL}${endpoint}`, config);
    }

    clearTimeout(timeoutId);

    const data = await res.json();

    if (!res.ok) {
      throw new ApiError(data.message || 'Request failed', res.status, data);
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new ApiError('Request timed out', 408);
    }
    if (err.name === 'ApiError') throw err;
    throw new ApiError(err.message || 'Network error', 0);
  }
}

export { apiClient, setAccessToken, clearTokens, getAccessToken, ApiError };
export default apiClient;

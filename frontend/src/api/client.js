const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

function getToken() {
  return localStorage.getItem('sahayogi_access_token');
}

function getRefreshToken() {
  return localStorage.getItem('sahayogi_refresh_token');
}

function setTokens(accessToken, refreshToken) {
  if (accessToken) localStorage.setItem('sahayogi_access_token', accessToken);
  if (refreshToken) localStorage.setItem('sahayogi_refresh_token', refreshToken);
}

function clearTokens() {
  localStorage.removeItem('sahayogi_access_token');
  localStorage.removeItem('sahayogi_refresh_token');
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new ApiError('No refresh token', 401);

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    throw new ApiError('Session expired', 401);
  }

  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

async function apiClient(endpoint, options = {}) {
  const { method = 'GET', body, headers = {}, auth = true, timeout = 30000 } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const config = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    signal: controller.signal,
  };

  if (auth) {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    let res = await fetch(`${BASE_URL}${endpoint}`, config);

    if (res.status === 401 && auth) {
      const token = getToken();
      if (token) {
        const newToken = await refreshAccessToken();
        config.headers['Authorization'] = `Bearer ${newToken}`;
        res = await fetch(`${BASE_URL}${endpoint}`, config);
      }
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

export { apiClient, setTokens, clearTokens, getToken, ApiError };
export default apiClient;

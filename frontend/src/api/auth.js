import apiClient, { setAccessToken, clearTokens } from './client';

export async function login(email, password) {
  const data = await apiClient('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
  setAccessToken(data.accessToken);
  return data.user;
}

export async function register(name, email, password) {
  const data = await apiClient('/auth/register', {
    method: 'POST',
    body: { name, email, password },
    auth: false,
  });
  setAccessToken(data.accessToken);
  return data.user;
}

export async function logout() {
  try {
    await apiClient('/auth/logout', { method: 'POST' });
  } finally {
    clearTokens();
  }
}

export async function refreshToken() {
  return apiClient('/auth/refresh', { method: 'POST', auth: false });
}

export async function changePassword(currentPassword, newPassword) {
  return apiClient('/auth/change-password', {
    method: 'PUT',
    body: { currentPassword, newPassword },
  });
}

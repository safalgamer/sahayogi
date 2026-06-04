import apiClient from './client';

export async function checkEligibility(data) {
  return apiClient('/eligibility/check', {
    method: 'POST',
    body: data,
    auth: false,
  });
}

export async function getHistory() {
  return apiClient('/eligibility/history');
}

export async function getCheck(id) {
  return apiClient(`/eligibility/history/${id}`);
}

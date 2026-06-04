import apiClient from './client';

export async function getProducts(params = {}) {
  const query = new URLSearchParams();
  if (params.providerType) query.set('providerType', params.providerType);
  if (params.loanType) query.set('loanType', params.loanType);
  const qs = query.toString();
  return apiClient(`/products${qs ? '?' + qs : ''}`, { auth: false });
}

export async function getProduct(id) {
  return apiClient(`/products/${id}`, { auth: false });
}

export async function searchProducts(query) {
  return apiClient(`/products/search?q=${encodeURIComponent(query)}`, { auth: false });
}

export async function createProduct(data) {
  return apiClient('/products', { method: 'POST', body: data });
}

export async function updateProduct(id, data) {
  return apiClient(`/products/${id}`, { method: 'PUT', body: data });
}

export async function deleteProduct(id) {
  return apiClient(`/products/${id}`, { method: 'DELETE' });
}

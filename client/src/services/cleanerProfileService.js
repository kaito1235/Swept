import apiClient from '../hooks/useApi';

export async function getMyCleanerProfile() {
  const response = await apiClient.get('/cleaner-profiles/me');
  return response.data.data;
}

export async function updateMyCleanerProfile(fields) {
  const response = await apiClient.patch('/cleaner-profiles/me', fields);
  return response.data.data;
}

export async function getPublicCleanerProfile(id) {
  const response = await apiClient.get(`/cleaner-profiles/public/${id}`);
  return response.data.data;
}

export async function searchCleaners({ area, minRate, maxRate, serviceType } = {}) {
  const params = {};
  if (area) params.area = area;
  if (minRate) params.minRate = minRate;
  if (maxRate) params.maxRate = maxRate;
  if (serviceType) params.serviceType = serviceType;
  const response = await apiClient.get('/cleaner-profiles/search', { params });
  return response.data.data;
}

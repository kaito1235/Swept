import apiClient from '../hooks/useApi';

export async function getMe() {
  const response = await apiClient.get('/users/me');
  return response.data.data;
}

export async function updateMe(fields) {
  const response = await apiClient.patch('/users/me', fields);
  return response.data.data;
}

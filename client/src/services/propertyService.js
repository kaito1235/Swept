import apiClient from '../hooks/useApi';

export async function getMyProperties() {
  const response = await apiClient.get('/properties');
  return response.data.data;
}

export async function createProperty(fields) {
  const response = await apiClient.post('/properties', fields);
  return response.data.data;
}

export async function deleteProperty(id) {
  const response = await apiClient.delete(`/properties/${id}`);
  return response.data.data;
}

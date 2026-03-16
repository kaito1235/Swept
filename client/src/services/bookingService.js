import apiClient from '../hooks/useApi';

export async function createBooking(fields) {
  const response = await apiClient.post('/bookings', fields);
  return response.data.data;
}

export async function getHostBookings() {
  const response = await apiClient.get('/bookings/host');
  return response.data.data;
}

export async function getCleanerBookings() {
  const response = await apiClient.get('/bookings/cleaner');
  return response.data.data;
}

export async function updateBookingStatus(id, status) {
  const response = await apiClient.patch(`/bookings/${id}/status`, { status });
  return response.data.data;
}

export async function getBookingStats() {
  const response = await apiClient.get('/bookings/stats');
  return response.data.data;
}

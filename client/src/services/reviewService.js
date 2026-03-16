import apiClient from '../hooks/useApi';

export async function createReview({ bookingId, rating, comment }) {
  const response = await apiClient.post('/reviews', { bookingId, rating, comment });
  return response.data.data;
}

export async function getCleanerReviews(cleanerId) {
  const response = await apiClient.get(`/reviews/cleaner/${cleanerId}`);
  return response.data.data;
}

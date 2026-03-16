import apiClient from '../hooks/useApi';

export async function getConversations() {
  const response = await apiClient.get('/conversations');
  return response.data.data;
}

export async function getOrCreateConversation(cleanerId) {
  const response = await apiClient.post('/conversations', { cleanerId });
  return response.data.data;
}

export async function getMessages(conversationId) {
  const response = await apiClient.get(`/conversations/${conversationId}`);
  return response.data.data; // { conversation, messages }
}

export async function sendMessage(conversationId, body) {
  const response = await apiClient.post(`/conversations/${conversationId}/messages`, { body });
  return response.data.data;
}

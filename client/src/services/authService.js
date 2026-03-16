import apiClient from '../hooks/useApi';

export async function createAppUser({ supabaseId, email, name, token }) {
  const response = await apiClient.post(
    '/auth/register',
    { supabase_id: supabaseId, email, name },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data.data;
}

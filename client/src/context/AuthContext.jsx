import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { createAppUser } from '../services/authService';
import { getMe, updateMe } from '../services/userService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [appUser, setAppUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchAppUser();
      } else {
        setLoading(false);
      }
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session) {
          await fetchAppUser();
        } else {
          setAppUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function fetchAppUser() {
    try {
      const user = await getMe();
      setAppUser(user);
    } catch {
      setAppUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function register(email, password, name) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // Create application user record in our DB
    await createAppUser({
      supabaseId: data.user.id,
      email: data.user.email,
      name,
      token: data.session?.access_token,
    });

    return data;
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  async function setRole(role) {
    const updated = await updateMe({ role });
    setAppUser(updated);
    return updated;
  }

  const value = {
    session,
    appUser,
    loading,
    isAuthenticated: !!session,
    hasRole: !!appUser?.role,
    register,
    login,
    logout,
    setRole,
    refreshUser: fetchAppUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

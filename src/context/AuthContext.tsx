import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Profile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (fullName: string | null, avatarUrl: string | null) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  clearError: () => void;
  enterDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: 'demo-user-id',
  app_metadata: {},
  user_metadata: { full_name: 'Demonstração Local' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'demo@gcarleto.ai',
};

const MOCK_PROFILE: Profile = {
  id: 'demo-user-id',
  full_name: 'Demonstração Local',
  avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=6366f1',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  const fetchProfile = async (uid: string, email?: string): Promise<Profile | null> => {
    try {
      const { data, error: fetchErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .maybeSingle();

      if (fetchErr) {
        console.error('Erro ao buscar perfil:', fetchErr);
        return null;
      }

      if (!data) {
        const { data: newProfile, error: insertErr } = await supabase
          .from('profiles')
          .insert({
            id: uid,
            full_name: email ? email.split('@')[0] : 'Usuário',
            avatar_url: null,
          })
          .select()
          .single();

        if (insertErr) {
          console.error('Erro ao criar perfil de fallback:', insertErr);
          return null;
        }
        return newProfile;
      }

      return data;
    } catch (err) {
      console.error('Erro na requisição do perfil:', err);
      return null;
    }
  };

  useEffect(() => {
    const initSession = async () => {
      try {
        // Verificar primeiro se o modo demo está ativo no localStorage
        const demoActive = localStorage.getItem('gcarleto_demo_mode') === 'true';
        if (demoActive) {
          setIsDemoMode(true);
          setUser(MOCK_USER);
          const localProf = localStorage.getItem('gcarleto_demo_profile');
          setProfile(localProf ? JSON.parse(localProf) : MOCK_PROFILE);
          setLoading(false);
          return;
        }

        if (!isSupabaseConfigured) {
          setLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const prof = await fetchProfile(session.user.id, session.user.email);
          setProfile(prof);
        }
      } catch (err: any) {
        console.error('Erro ao carregar sessão inicial:', err);
        setError('Erro ao carregar a sessão.');
      } finally {
        setLoading(false);
      }
    };

    initSession();

    if (!isSupabaseConfigured) return;

    // Ouvir mudanças de auth apenas se configurado
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        // Ignora se estiver no modo demo
        if (localStorage.getItem('gcarleto_demo_mode') === 'true') return;

        setLoading(true);
        if (session?.user) {
          setUser(session.user);
          const prof = await fetchProfile(session.user.id, session.user.email);
          setProfile(prof);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      setLoading(false);
      throw new Error('Supabase não configurado. Por favor, use o Modo de Demonstração.');
    }

    try {
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInErr) throw signInErr;
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login.');
      setLoading(false);
      throw err;
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      setLoading(false);
      throw new Error('Supabase não configurado. Por favor, use o Modo de Demonstração.');
    }

    try {
      const { data, error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0],
          },
        },
      });

      if (signUpErr) throw signUpErr;

      if (data.user && !data.session) {
        setError('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar cadastro.');
      setLoading(false);
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    setError(null);

    if (!isSupabaseConfigured) {
      throw new Error('Supabase não configurado. Por favor, use o Modo de Demonstração.');
    }

    try {
      const { error: googleErr } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (googleErr) throw googleErr;
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login com o Google.');
      throw err;
    }
  };

  const enterDemoMode = () => {
    setLoading(true);
    localStorage.setItem('gcarleto_demo_mode', 'true');
    setIsDemoMode(true);
    setUser(MOCK_USER);
    const localProf = localStorage.getItem('gcarleto_demo_profile');
    setProfile(localProf ? JSON.parse(localProf) : MOCK_PROFILE);
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);

    if (isDemoMode) {
      localStorage.removeItem('gcarleto_demo_mode');
      setIsDemoMode(false);
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { error: signOutErr } = await supabase.auth.signOut();
      if (signOutErr) throw signOutErr;
    } catch (err: any) {
      setError(err.message || 'Erro ao deslogar.');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (fullName: string | null, avatarUrl: string | null) => {
    setError(null);

    if (isDemoMode) {
      const updated = {
        id: 'demo-user-id',
        full_name: fullName,
        avatar_url: avatarUrl,
      };
      localStorage.setItem('gcarleto_demo_profile', JSON.stringify(updated));
      setProfile(updated);
      return;
    }

    if (!user) throw new Error('Usuário não autenticado.');

    try {
      const { error: updateErr } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateErr) throw updateErr;

      setProfile((prev) =>
        prev
          ? { ...prev, full_name: fullName, avatar_url: avatarUrl }
          : { id: user.id, full_name: fullName, avatar_url: avatarUrl }
      );
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar perfil.');
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        isDemoMode,
        signIn,
        signUp,
        signOut,
        updateProfile,
        signInWithGoogle,
        clearError,
        enterDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};

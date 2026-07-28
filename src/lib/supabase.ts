import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = 
  !!supabaseUrl && 
  !supabaseUrl.includes('your-project-id') && 
  supabaseUrl.trim() !== '' &&
  !!supabaseAnonKey && 
  !supabaseAnonKey.includes('your-anon-key') &&
  supabaseAnonKey.trim() !== '';

// Inicialização segura para evitar que o client quebre a aplicação se as credenciais forem inválidas
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key'
);

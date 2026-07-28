export interface Profile {
  id: string;
  updated_at?: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface Chat {
  id: string;
  user_id: string;
  titulo: string;
  created_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

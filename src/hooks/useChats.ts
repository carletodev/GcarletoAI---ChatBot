import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Chat } from '../types';
import { useAuth } from './useAuth';

export function useChats() {
  const { user, isDemoMode } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    if (isDemoMode) {
      try {
        const localChatsRaw = localStorage.getItem('gcarleto_demo_chats');
        const localChats: Chat[] = localChatsRaw ? JSON.parse(localChatsRaw) : [];
        setChats(localChats);
      } catch (err) {
        console.error('Erro ao ler chats simulados:', err);
        setError('Erro ao carregar conversas locais.');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const { data, error: fetchErr } = await supabase
        .from('chats')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchErr) throw fetchErr;
      setChats(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar chats:', err);
      setError(err.message || 'Erro ao carregar chats.');
    } finally {
      setLoading(false);
    }
  }, [user, isDemoMode]);

  const createChat = async (titulo: string = 'Novo Chat'): Promise<Chat | null> => {
    if (!user) return null;
    setError(null);

    // Helper to create a demo chat locally (fallback) -----------------------------------
    const createDemoChat = (): Chat => {
      const demoChat: Chat = {
        id: `demo-chat-${Math.random().toString(36).substring(2, 9)}`,
        user_id: user.id,
        titulo,
        created_at: new Date().toISOString(),
      };
      try {
        const localChatsRaw = localStorage.getItem('gcarleto_demo_chats');
        const localChats: Chat[] = localChatsRaw ? JSON.parse(localChatsRaw) : [];
        const updated = [demoChat, ...localChats];
        localStorage.setItem('gcarleto_demo_chats', JSON.stringify(updated));
        setChats(updated);
      } catch (e) {
        console.error('Erro ao salvar chat demo local:', e);
      }
      return demoChat;
    };

    if (isDemoMode) {
      // Demo mode: criar chat local imediatamente
      const demoChat = createDemoChat();
      return demoChat;
    }

    try {
      const { data, error: createErr } = await supabase
        .from('chats')
        .insert({
          user_id: user.id,
          titulo,
        })
        .select()
        .single();

      if (createErr) throw createErr;

      setChats((prev) => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Erro ao criar chat no Supabase:', err);
      setError(err.message || 'Erro ao criar chat.');
      // Fallback para demo chat local se o Supabase falhar
      const fallbackChat = createDemoChat();
      return fallbackChat;
    }
  };

  const renameChat = async (chatId: string, novoTitulo: string) => {
    setError(null);

    if (isDemoMode) {
      try {
        const localChatsRaw = localStorage.getItem('gcarleto_demo_chats');
        const localChats: Chat[] = localChatsRaw ? JSON.parse(localChatsRaw) : [];
        const updated = localChats.map((c) => (c.id === chatId ? { ...c, titulo: novoTitulo } : c));
        localStorage.setItem('gcarleto_demo_chats', JSON.stringify(updated));

        setChats(updated);
      } catch (err) {
        console.error('Erro ao renomear chat simulado:', err);
        setError('Erro ao renomear conversa local.');
        throw err;
      }
      return;
    }

    try {
      const { error: renameErr } = await supabase
        .from('chats')
        .update({ titulo: novoTitulo })
        .eq('id', chatId);

      if (renameErr) throw renameErr;

      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, titulo: novoTitulo } : c))
      );
    } catch (err: any) {
      console.error('Erro ao renomear chat:', err);
      setError(err.message || 'Erro ao renomear chat.');
      throw err;
    }
  };

  const deleteChat = async (chatId: string) => {
    setError(null);

    if (isDemoMode) {
      try {
        const localChatsRaw = localStorage.getItem('gcarleto_demo_chats');
        const localChats: Chat[] = localChatsRaw ? JSON.parse(localChatsRaw) : [];
        const updated = localChats.filter((c) => c.id !== chatId);
        localStorage.setItem('gcarleto_demo_chats', JSON.stringify(updated));

        // Também limpar mensagens dessa conversa simulada
        localStorage.removeItem(`gcarleto_demo_msg_${chatId}`);

        setChats(updated);
      } catch (err) {
        console.error('Erro ao excluir chat simulado:', err);
        setError('Erro ao excluir conversa local.');
        throw err;
      }
      return;
    }

    try {
      const { error: deleteErr } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId);

      if (deleteErr) throw deleteErr;

      setChats((prev) => prev.filter((c) => c.id !== chatId));
    } catch (err: any) {
      console.error('Erro ao deletar chat:', err);
      setError(err.message || 'Erro ao deletar chat.');
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchChats();
    } else {
      setChats([]);
    }
  }, [user, fetchChats]);

  return {
    chats,
    loading,
    error,
    refetchChats: fetchChats,
    createChat,
    renameChat,
    deleteChat,
  };
}

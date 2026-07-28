import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Message, Chat } from '../types';
import { useAuth } from './useAuth';
import { sendToN8NAgent } from '../lib/n8n-agent';

export function useMessages(chatId: string | null) {
  const { user, isDemoMode } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!chatId || !user) {
      setMessages([]);
      return;
    }
    setLoading(true);
    setError(null);

    if (isDemoMode) {
      try {
        const localMsgRaw = localStorage.getItem(`gcarleto_demo_msg_${chatId}`);
        const localMsgs: Message[] = localMsgRaw ? JSON.parse(localMsgRaw) : [];
        setMessages(localMsgs);
      } catch (err) {
        console.error('Erro ao ler mensagens simuladas:', err);
        setError('Erro ao carregar mensagens locais.');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const { data, error: fetchErr } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (fetchErr) throw fetchErr;
      setMessages(data || []);
    } catch (err: any) {
      console.error('Erro ao carregar mensagens:', err);
      setError(err.message || 'Erro ao carregar mensagens.');
    } finally {
      setLoading(false);
    }
  }, [chatId, user, isDemoMode]);

  const sendMessage = async (content: string, onChatRename?: (newTitle: string) => void) => {
    if (!chatId || !user || !content.trim() || sending) return;
    setError(null);
    setSending(true);

    if (isDemoMode) {
      try {
        // 1. Criar e salvar mensagem do usuário localmente
        const userMsg: Message = {
          id: `demo-msg-${Math.random().toString(36).substring(2, 9)}`,
          chat_id: chatId,
          user_id: user.id,
          role: 'user',
          content: content.trim(),
          created_at: new Date().toISOString(),
        };

        const localMsgRaw = localStorage.getItem(`gcarleto_demo_msg_${chatId}`);
        const localMsgs: Message[] = localMsgRaw ? JSON.parse(localMsgRaw) : [];
        const updatedMsgs = [...localMsgs, userMsg];
        localStorage.setItem(`gcarleto_demo_msg_${chatId}`, JSON.stringify(updatedMsgs));
        setMessages(updatedMsgs);

        // 2. Tentar disparar o N8N. Se falhar por falta de URL ou erro, criamos uma resposta mock simulando o assistente
        let reply = '';
        let suggested_title: string | undefined = undefined;

        try {
          const history = localMsgs.map((m) => ({
            role: m.role,
            content: m.content,
          }));

          const response = await sendToN8NAgent(chatId, user.id, content.trim(), history);
          reply = response.reply;
          suggested_title = response.suggested_title;
        } catch (n8nErr: any) {
          console.warn('Usando resposta simulada no modo demo. Erro original:', n8nErr.message);
          
          // Gerar uma resposta simulada para manter a interatividade
          await new Promise((resolve) => setTimeout(resolve, 1500)); // Delay para simular digitação
          reply = `Olá! Estou respondendo no **Modo de Demonstração Local** do gCarletoAI.

Percebi que o agente de IA no N8N não pôde ser contatado. O erro reportado foi:
> *${n8nErr.message}*

Você pode testar a conexão com o webhook real configurando o endereço em **Ajustes** (no canto inferior esquerdo) ou alterando a variável \`VITE_N8N_WEBHOOK_URL\` no arquivo \`.env\`.

Aqui está um exemplo de código TypeScript simulado para você verificar a formatação do nosso visualizador de código:
\`\`\`typescript
interface Config {
  n8nWebhookUrl: string;
  isDemoActive: boolean;
}

const gCarletoConfig: Config = {
  n8nWebhookUrl: "https://seu-fluxo-n8n.com/webhook/chat",
  isDemoActive: true
};

console.log("Configuração carregada:", gCarletoConfig);
\`\`\`

Como posso ajudar você a configurar o ambiente?`;

          // Sugerir um título se for a primeira mensagem
          if (localMsgs.length === 0) {
            suggested_title = content.length > 20 ? `${content.substring(0, 20)}...` : content;
          }
        }

        // 3. Se tiver sugestão de título, renomear o chat localmente
        if (suggested_title && onChatRename) {
          const localChatsRaw = localStorage.getItem('gcarleto_demo_chats');
          const localChats: Chat[] = localChatsRaw ? JSON.parse(localChatsRaw) : [];
          const updatedChats = localChats.map((c) => (c.id === chatId ? { ...c, titulo: suggested_title! } : c));
          localStorage.setItem('gcarleto_demo_chats', JSON.stringify(updatedChats));
          onChatRename(suggested_title);
        }

        // 4. Criar e salvar mensagem do assistente localmente
        const assistantMsg: Message = {
          id: `demo-msg-${Math.random().toString(36).substring(2, 9)}`,
          chat_id: chatId,
          user_id: user.id,
          role: 'assistant',
          content: reply,
          created_at: new Date().toISOString(),
        };

        const finalMsgs = [...updatedMsgs, assistantMsg];
        localStorage.setItem(`gcarleto_demo_msg_${chatId}`, JSON.stringify(finalMsgs));
        setMessages(finalMsgs);

      } catch (err: any) {
        console.error('Erro ao enviar mensagem simulada:', err);
        setError('Erro ao salvar resposta local.');
      } finally {
        setSending(false);
      }
      return;
    }

    let userMsg: Message | null = null;
    try {
      // 1. Salvar mensagem do usuário no banco
      const { data: userMsgData, error: userErr } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          user_id: user.id,
          role: 'user',
          content: content.trim(),
        })
        .select()
        .single();

      if (userErr) throw userErr;
      userMsg = userMsgData;

      // Atualiza estado local imediatamente
      setMessages((prev) => [...prev, userMsgData]);

      // 2. Preparar histórico para o N8N, incluindo a mensagem do usuário recém enviada
      const history = [...messages, userMsgData].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // 4. Enviar para o agente de IA do N8N
      const response = await sendToN8NAgent(chatId, user.id, content.trim(), history);

      // 5. Prepare assistant message content, with fallback if reply missing
      const assistantContent = response.reply && response.reply.trim().length > 0 ? response.reply : 'Desculpe, não foi possível obter resposta da IA.';

      // 6. Create local assistant message
      const assistantMsgLocal: Message = {
        id: `msg-${Math.random().toString(36).substring(2, 9)}`,
        chat_id: chatId,
        user_id: user.id,
        role: 'assistant',
        content: assistantContent,
        created_at: new Date().toISOString(),
      };
      // Optimistically add to UI
      setMessages((prev) => [...prev, assistantMsgLocal]);

      // 7. If there is a suggested title, rename chat
      if (response?.suggested_title && onChatRename) {
        const { error: renameErr } = await supabase
          .from('chats')
          .update({ titulo: response.suggested_title })
          .eq('id', chatId);
        if (!renameErr) {
          onChatRename(response.suggested_title);
        }
      }

      // 8. Persist assistant message in Supabase
      try {
        const { data: assistantMsgData, error: assistantErr } = await supabase
          .from('messages')
          .insert({
            chat_id: chatId,
            user_id: user.id,
            role: 'assistant',
            content: assistantContent,
          })
          .select()
          .single();
        if (assistantErr) throw assistantErr;
        // Replace temporary message with persisted one
        setMessages((prev) => {
          const withoutTemp = prev.filter((m) => m.id !== assistantMsgLocal.id);
          return [...withoutTemp, assistantMsgData];
        });
      } catch (insertErr: any) {
        console.error('Erro ao inserir mensagem do assistente no Supabase:', insertErr);
        // Keep the temporary message; no further action needed
      }

    } catch (err: any) {
      console.error('Erro ao enviar mensagem:', err);
      setError(err.message || 'Houve um erro ao processar sua mensagem.');
      
      if (userMsg) {
        const errMsg = err.message || 'Erro de conexão com o gCarletoAI.';
        try {
          const { data: assistantErrorData } = await supabase
            .from('messages')
            .insert({
              chat_id: chatId,
              user_id: user.id,
              role: 'assistant',
              content: `⚠️ **Falha de Integração:**\n\n${errMsg}\n\n*Por favor, verifique se a URL do webhook do N8N está configurada corretamente nas Configurações ou no arquivo .env.*`,
            })
            .select()
            .single();

          if (assistantErrorData) {
            setMessages((prev) => [...prev, assistantErrorData]);
          }
        } catch (innerErr) {
          console.error('Falha ao registrar mensagem de erro no banco:', innerErr);
        }
      }
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId, fetchMessages]);

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    refetchMessages: fetchMessages,
  };
}

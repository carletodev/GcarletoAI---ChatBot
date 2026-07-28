import React, { useState } from 'react';
import { useMessages } from '../hooks/useMessages';
import { MessageList } from '../components/MessageList';
import { ChatInput } from '../components/ChatInput';
import { Sparkles, Terminal, Cpu, Database, Code } from 'lucide-react';
import type { Chat as ChatType } from '../types';

interface ChatProps {
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  createChat: (titulo?: string) => Promise<ChatType | null>;
  chats: ChatType[];
  onRenameChat: (id: string, newTitle: string) => Promise<void>;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const QUICK_SUGGESTIONS = [
  {
    text: 'Explique Computação Quântica',
    subText: 'De forma simplificada para leigos.',
    icon: <Cpu size={14} className="text-[#5de6ff]" />,
  },
  {
    text: 'Otimizar consultas no Postgres',
    subText: 'Melhores práticas de indexação e análise.',
    icon: <Database size={14} className="text-[#5de6ff]" />,
  },
  {
    text: 'QuickSort em TypeScript',
    subText: 'Escreva um exemplo de código funcional.',
    icon: <Code size={14} className="text-[#5de6ff]" />,
  },
  {
    text: 'Arquitetura Limpa em React',
    subText: 'Como organizar pastas e estados.',
    icon: <Terminal size={14} className="text-[#5de6ff]" />,
  },
];

export const Chat: React.FC<ChatProps> = ({
  activeChatId,
  setActiveChatId,
  createChat,
  chats,
  onRenameChat,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const [inputValue, setInputValue] = useState('');
  const { messages, loading, sending, sendMessage } = useMessages(activeChatId);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    setInputValue('');

    let currentChatId = activeChatId;

    // Se nenhum chat estiver ativo, cria um automaticamente
    if (!currentChatId) {
      // Usar os primeiros caracteres do prompt como título inicial temporário
      const tempTitle = text.length > 25 ? `${text.substring(0, 25)}...` : text;
      const newChat = await createChat(tempTitle);
      if (!newChat) {
        alert('Erro ao iniciar novo chat. Tente novamente.');
        return;
      }
      currentChatId = newChat.id;
      setActiveChatId(newChat.id);
    }

    // Enviar mensagem
    // Se o N8N retornar um sugerido_titulo, a callback onChatRename atualiza o título no sidebar
    await sendMessage(text, (newTitle) => {
      onRenameChat(currentChatId!, newTitle);
    });
  };

  const handleSuggestionClick = (suggestionText: string) => {
    handleSend(suggestionText);
  };

  const activeChat = chats.find((c) => c.id === activeChatId);

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/[0.02] rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-outline-variant bg-surface-container-lowest select-none z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-md hover:bg-white/[0.04] text-outline hover:text-on-surface transition-colors cursor-pointer md:hidden"
            title="Toggle Sidebar"
          >
            <MenuIcon />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#5de6ff]" />
            <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider truncate max-w-[200px] sm:max-w-[400px]">
              {activeChat ? activeChat.titulo : 'Nova Conversa'}
            </h2>
          </div>
        </div>
        <div className="text-[10px] text-outline font-mono border border-outline-variant/30 px-2 py-1 rounded bg-surface-container-low">
          MODEL: N8N_AGENT_v1
        </div>
      </header>

      {/* Message Area */}
      <div className="flex-1 overflow-hidden flex flex-col items-center">
        <div className="w-full max-w-[800px] flex-1 flex flex-col min-h-0">
          <MessageList messages={messages} sending={sending} />
        </div>
      </div>

      {/* Stage Bottom Input Container */}
      <div className="w-full border-t border-outline-variant/40 bg-background/80 backdrop-blur-md py-4 px-6 flex flex-col items-center z-10">
        <div className="w-full max-w-[800px] space-y-4">
          {/* Quick Suggestions (Only when message history is empty) */}
          {messages.length === 0 && !loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
              {QUICK_SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(s.text)}
                  className="flex items-start gap-3 p-3.5 bg-surface-container-low hover:bg-surface-container border border-outline-variant/50 hover:border-indigo-500/30 rounded-md transition-all duration-150 text-left cursor-pointer group hover:scale-[1.005] hover:shadow-md"
                >
                  <div className="p-2 rounded bg-surface-container-lowest border border-outline-variant/20 group-hover:border-indigo-500/20 shrink-0">
                    {s.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-on-surface group-hover:text-secondary transition-colors">
                      {s.text}
                    </h4>
                    <p className="text-[10px] text-outline mt-0.5 leading-normal">
                      {s.subText}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Form input */}
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={() => handleSend()}
            disabled={sending}
            placeholder={
              !activeChatId
                ? 'Envie uma pergunta para iniciar um novo chat...'
                : 'Como posso ajudar você hoje?'
            }
          />

          {/* Footer branding */}
          <p className="text-[9px] text-center text-outline-variant/60 font-medium">
            gCarletoAI pode produzir informações imprecisas. Webhook integrado em tempo real via N8N.
          </p>
        </div>
      </div>
    </div>
  );
};

// Simple menu icon inline helper
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);
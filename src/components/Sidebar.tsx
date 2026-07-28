import React, { useState } from 'react';
import type { Chat, Profile } from '../types';
import { Plus, MessageSquare, Trash2, Edit2, Check, X, Settings, LogOut, User, Sparkles, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onCreateChat: () => void;
  onRenameChat: (id: string, newTitle: string) => Promise<void>;
  onDeleteChat: (id: string) => Promise<void>;
  profile: Profile | null;
  onSignOut: () => void;
  onNavigate: (page: 'chat' | 'perfil' | 'configuracoes') => void;
  activePage: 'chat' | 'perfil' | 'configuracoes';
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  onCreateChat,
  onRenameChat,
  onDeleteChat,
  profile,
  onSignOut,
  onNavigate,
  activePage,
}) => {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const { theme, toggleTheme } = useTheme();

  const handleStartRename = (e: React.MouseEvent, chat: Chat) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.titulo);
  };

  const handleSaveRename = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (editTitle.trim() && editTitle.trim() !== chats.find(c => c.id === id)?.titulo) {
      try {
        await onRenameChat(id, editTitle.trim());
      } catch (err) {
        console.error(err);
      }
    }
    setEditingChatId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(null);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Tem certeza de que deseja deletar esta conversa?')) {
      try {
        await onDeleteChat(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <aside className="w-[280px] bg-surface-container-low flex flex-col border-r border-outline-variant select-none h-full z-10">
      {/* Brand Header */}
      <div 
        onClick={() => onNavigate('chat')}
        className="h-16 flex items-center gap-2.5 px-6 border-b border-outline-variant cursor-pointer hover:bg-white/[0.02] transition-colors"
      >
        <div className="w-8 h-8 rounded-md bg-indigo-600/80 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles size={16} className="text-[#5de6ff] animate-pulse-cyan" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-on-surface tracking-wide uppercase">gCarletoAI</h1>
          <span className="text-[10px] text-outline tracking-wider font-semibold">WORKSPACE V1.0</span>
        </div>
      </div>

      {/* Action Area */}
      <div className="p-4">
        <button
          onClick={onCreateChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-md transition-all duration-150 shadow-md shadow-indigo-600/10 hover:shadow-indigo-500/30 hover:scale-[1.01] glow-primary-hover active:scale-[0.99]"
        >
          <Plus size={16} />
          Nova Conversa
        </button>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5 scrollbar-thin">
        {chats.length === 0 ? (
          <div className="text-center py-8 text-xs text-outline font-medium px-4">
            Nenhuma conversa recente
          </div>
        ) : (
          chats.map((chat) => {
            const isActive = activeChatId === chat.id && activePage === 'chat';
            const isEditing = editingChatId === chat.id;

            return (
              <div
                key={chat.id}
                onClick={() => {
                  if (!isEditing) {
                    onSelectChat(chat.id);
                    onNavigate('chat');
                  }
                }}
                className={`group relative flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 ${
                  isActive
                    ? 'bg-surface-container-high text-on-surface font-medium shadow-level-2'
                    : 'text-on-surface-variant hover:bg-white/[0.03] hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <MessageSquare size={14} className={isActive ? 'text-[#5de6ff]' : 'text-outline'} />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename(e as any, chat.id);
                        if (e.key === 'Escape') handleCancelRename(e as any);
                      }}
                      className="bg-surface-container-lowest border border-indigo-500 text-on-surface text-xs rounded px-1.5 py-0.5 outline-none w-full"
                      autoFocus
                    />
                  ) : (
                    <span className="text-xs truncate font-sans">
                      {chat.titulo}
                    </span>
                  )}
                </div>

                {/* Edit / Delete Buttons on Hover */}
                {!isEditing && (
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-l from-[#1A1A21] group-hover:from-[#1b1b23] pl-4 absolute right-2 top-0 bottom-0 py-2.5">
                    <button
                      onClick={(e) => handleStartRename(e, chat)}
                      className="text-outline hover:text-on-surface transition-colors"
                      title="Renomear"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, chat.id)}
                      className="text-outline hover:text-red-400 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}

                {/* Inline Editing Controls */}
                {isEditing && (
                  <div className="flex items-center gap-1 ml-1 z-10">
                    <button
                      onClick={(e) => handleSaveRename(e, chat.id)}
                      className="text-emerald-400 hover:text-emerald-300 transition-colors"
                      title="Confirmar"
                    >
                      <Check size={12} />
                    </button>
                    <button
                      onClick={handleCancelRename}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="Cancelar"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer / Profile section */}
      <div className="p-4 border-t border-outline-variant bg-surface-container-lowest flex flex-col gap-2">
        <div className="flex items-center gap-3">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover border border-outline-variant"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 font-bold text-sm">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-on-surface truncate font-sans">
              {profile?.full_name || 'Usuário gCarleto'}
            </div>
            <div className="text-[10px] text-outline truncate font-mono">
              PREMIUM ACCESS
            </div>
          </div>
        </div>

        {/* Action icons bar */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/20">
          <button
            onClick={() => onNavigate('perfil')}
            className={`flex items-center gap-1.5 text-xs px-2 py-1.5 rounded transition-all cursor-pointer ${
              activePage === 'perfil'
                ? 'bg-indigo-500/10 text-[#c0c1ff]'
                : 'text-outline hover:text-on-surface hover:bg-white/[0.02]'
            }`}
            title="Perfil"
          >
            <User size={13} />
            <span>Perfil</span>
          </button>
          
          <button
            onClick={() => onNavigate('configuracoes')}
            className={`flex items-center gap-1.5 text-xs px-2 py-1.5 rounded transition-all cursor-pointer ${
              activePage === 'configuracoes'
                ? 'bg-indigo-500/10 text-[#c0c1ff]'
                : 'text-outline hover:text-on-surface hover:bg-white/[0.02]'
            }`}
            title="Configurações"
          >
            <Settings size={13} />
            <span>Ajustes</span>
          </button>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-1 text-xs px-2 py-1.5 rounded text-outline hover:text-[#c0c1ff] hover:bg-white/[0.02] transition-all cursor-pointer"
            title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
          >
            {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
          </button>

          <button
            onClick={onSignOut}
            className="flex items-center gap-1 text-xs px-2 py-1.5 rounded text-outline hover:text-red-400 hover:bg-white/[0.02] transition-all cursor-pointer"
            title="Sair"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
};
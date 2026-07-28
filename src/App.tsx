import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useChats } from './hooks/useChats';
import { Sidebar } from './components/Sidebar';
import { Chat } from './pages/Chat';
import { Perfil } from './pages/Perfil';
import { Configuracoes } from './pages/Configuracoes';
import { Login } from './pages/Login';
import { Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, profile, loading, signOut } = useAuth();
  const { chats, createChat, renameChat, deleteChat } = useChats();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<'chat' | 'perfil' | 'configuracoes'>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-on-surface select-none">
        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30 mb-4 animate-pulse-indigo">
          <Sparkles size={24} className="text-secondary animate-pulse-cyan" />
        </div>
        <div className="text-xs font-semibold tracking-wider text-outline uppercase animate-pulse">
          Inicializando gCarletoAI...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setActivePage('chat');
    setSidebarOpen(false);
  };

  const handleNavigate = (page: 'chat' | 'perfil' | 'configuracoes') => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  const handleCreateChat = async () => {
    const newChat = await createChat('Nova conversa');
    if (newChat) {
      setActiveChatId(newChat.id);
      setActivePage('chat');
      setSidebarOpen(false);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-background overflow-hidden text-on-surface font-sans">
      {/* Sidebar for Desktop & Mobile drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-20 transform transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onCreateChat={handleCreateChat}
          onRenameChat={renameChat}
          onDeleteChat={deleteChat}
          profile={profile}
          onSignOut={signOut}
          onNavigate={handleNavigate}
          activePage={activePage}
        />
      </div>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10 md:hidden"
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col h-full overflow-hidden relative">
        {activePage === 'chat' && (
          <Chat
            activeChatId={activeChatId}
            setActiveChatId={setActiveChatId}
            createChat={createChat}
            chats={chats}
            onRenameChat={renameChat}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        )}

        {activePage === 'perfil' && (
          <Perfil onBack={() => handleNavigate('chat')} />
        )}

        {activePage === 'configuracoes' && (
          <Configuracoes onBack={() => handleNavigate('chat')} />
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
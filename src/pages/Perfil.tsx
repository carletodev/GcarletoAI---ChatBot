import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Image, Save, ArrowLeft, Check, Sparkles } from 'lucide-react';

interface PerfilProps {
  onBack: () => void;
}

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=6366f1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Ane&backgroundColor=22d3ee',
  'https://api.dicebear.com/7.x/identicon/svg?seed=gcarleto&backgroundColor=a855f7',
  'https://api.dicebear.com/7.x/identicon/svg?seed=matrix&backgroundColor=10b981',
  'https://api.dicebear.com/7.x/shapes/svg?seed=minimalist&backgroundColor=f43f5e',
];

export const Perfil: React.FC<PerfilProps> = ({ onBack }) => {
  const { profile, updateProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setErrorMsg(null);
    setSubmitting(true);

    try {
      await updateProfile(
        fullName.trim() ? fullName.trim() : null,
        avatarUrl.trim() ? avatarUrl.trim() : null
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao atualizar dados do perfil.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectPreset = (url: string) => {
    setAvatarUrl(url);
  };

  return (
    <div className="flex-1 bg-[#13131b] flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-[#2c2c35] select-none bg-surface-container-lowest">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-md hover:bg-white/[0.04] text-outline hover:text-white transition-colors cursor-pointer"
            title="Voltar para o chat"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Perfil do Usuário</h2>
            <p className="text-[10px] text-outline font-medium tracking-wide">
              GERENCIE SUA IDENTIDADE NO PORTFÓLIO
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-[600px] w-full mx-auto px-6 py-10 space-y-8">
        <div className="backdrop-blur-md bg-white/[0.01] border border-white/5 rounded-xl p-8 shadow-level-2">
          {success && (
            <div className="mb-6 p-3 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2">
              <Check size={14} />
              Perfil atualizado com sucesso!
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-3 rounded-md bg-red-500/10 border border-red-500/25 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            {/* Visual Avatar Demo */}
            <div className="flex flex-col items-center gap-3 pb-6 border-b border-outline-variant/10">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Pré-visualização do Avatar"
                  className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500/30 p-0.5 bg-surface-container-low shadow-lg"
                  onError={(e) => {
                    // Fallback se a URL for inválida
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${fullName || 'User'}`;
                  }}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 font-bold text-3xl shadow-lg">
                  {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <span className="text-xs text-outline font-medium">Pré-visualização</span>
            </div>

            {/* Nome Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                Seu Nome de Exibição
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-outline-variant">
                  <User size={14} />
                </span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nome de exibição nas conversas"
                  className="w-full bg-[#1A1A21] border border-outline-variant/30 focus:border-indigo-500 outline-none pl-10 pr-4 py-2.5 text-xs text-white rounded-md transition-all placeholder:text-outline-variant"
                />
              </div>
            </div>

            {/* Avatar URL Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                URL do Avatar Personalizado
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-outline-variant">
                  <Image size={14} />
                </span>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://exemplo.com/sua-imagem.png"
                  className="w-full bg-[#1A1A21] border border-outline-variant/30 focus:border-indigo-500 outline-none pl-10 pr-4 py-2.5 text-xs text-white rounded-md transition-all placeholder:text-outline-variant"
                />
              </div>
            </div>

            {/* Presets Grid */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-semibold text-outline uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={11} className="text-secondary" />
                Avatares Geométricos Recomendados
              </label>
              <div className="flex flex-wrap gap-3">
                {PRESET_AVATARS.map((url, index) => {
                  const isSelected = avatarUrl === url;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectPreset(url)}
                      className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all hover:scale-105 cursor-pointer bg-[#1b1b23] p-0.5 ${
                        isSelected ? 'border-secondary shadow-md' : 'border-transparent hover:border-outline-variant'
                      }`}
                    >
                      <img src={url} alt={`Preset ${index + 1}`} className="w-full h-full rounded-full object-cover" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-md transition-all duration-150 shadow-md shadow-indigo-600/10 hover:shadow-indigo-500/30 flex items-center justify-center gap-2 cursor-pointer glow-primary-hover disabled:opacity-50"
            >
              <Save size={14} />
              {submitting ? 'Salvando Alterações...' : 'Salvar Configurações do Perfil'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';


export const Login: React.FC = () => {
  const { signIn, signUp, signInWithGoogle, error, clearError, enterDemoMode } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localErr, setLocalErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalErr(null);
    clearError();

    if (!email.trim() || !password.trim()) {
      setLocalErr('Por favor, preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      setLocalErr('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (!isLogin && !fullName.trim()) {
      setLocalErr('Por favor, informe seu nome completo.');
      return;
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName);
      }
    } catch (err: any) {
      console.error(err);
      // O erro do AuthContext já será atualizado e mostrado
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalErr(null);
    clearError();
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
    }
  };

  const activeError = localErr || error;

  return (
    <div className="min-h-screen bg-[#13131b] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Neon Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-indigo"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none animate-pulse-cyan"></div>

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/80 flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-4 animate-pulse-indigo">
            <Sparkles size={24} className="text-secondary" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide uppercase font-sans">gCarletoAI</h1>
          <p className="text-xs text-outline font-medium tracking-wider mt-1">
            SEU ASSISTENTE VIRTUAL DE ALTA PERFORMANCE
          </p>
        </div>

        {/* Auth Glassmorphism Panel */}
        <div className="backdrop-blur-md bg-white/[0.02] border border-white/10 rounded-xl p-8 shadow-level-3 transition-all duration-300">
          {!isSupabaseConfigured && (
            <div className="mb-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-md text-left text-xs text-on-surface space-y-2">
              <h3 className="font-bold text-[#c0c1ff] flex items-center gap-1.5">
                <Sparkles size={13} className="text-secondary animate-pulse-cyan" />
                Modo de Demonstração Disponível
              </h3>
              <p className="text-outline leading-relaxed">
                As credenciais do Supabase não foram configuradas no arquivo \`.env\`. Você pode testar a interface e a integração do portfólio localmente:
              </p>
              <button
                onClick={enterDemoMode}
                type="button"
                className="w-full mt-1.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-md transition-all text-[11px] cursor-pointer shadow-md shadow-indigo-600/10 hover:shadow-indigo-500/30"
              >
                Acessar no Modo de Demonstração
              </button>
            </div>
          )}
          {/* Tab Switcher */}
          <div className="flex bg-surface-container-lowest p-1 rounded-md mb-6 border border-outline-variant/20">
            <button
              onClick={() => {
                setIsLogin(true);
                setLocalErr(null);
                clearError();
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                isLogin
                  ? 'bg-[#1b1b23] text-white shadow-sm'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              Acessar Conta
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setLocalErr(null);
                clearError();
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                !isLogin
                  ? 'bg-[#1b1b23] text-white shadow-sm'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              Criar Conta
            </button>
          </div>

          {activeError && (
            <div className="mb-5 p-3 rounded-md bg-red-500/10 border border-red-500/25 text-red-300 text-xs leading-relaxed text-left">
              {activeError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                  Nome Completo
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-outline-variant">
                    <UserIcon size={14} />
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Gabriel Carleto"
                    className="w-full bg-[#1A1A21] border border-outline-variant/30 focus:border-indigo-500 outline-none pl-10 pr-4 py-2.5 text-xs text-white rounded-md transition-all placeholder:text-outline-variant"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                Endereço de E-mail
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-outline-variant">
                  <Mail size={14} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@dominio.com"
                  className="w-full bg-[#1A1A21] border border-outline-variant/30 focus:border-indigo-500 outline-none pl-10 pr-4 py-2.5 text-xs text-white rounded-md transition-all placeholder:text-outline-variant"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                  Senha Secreta
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-outline-variant">
                  <Lock size={14} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1A1A21] border border-outline-variant/30 focus:border-indigo-500 outline-none pl-10 pr-4 py-2.5 text-xs text-white rounded-md transition-all placeholder:text-outline-variant"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-md transition-all duration-150 shadow-md shadow-indigo-600/10 hover:shadow-indigo-500/30 flex items-center justify-center gap-2 cursor-pointer glow-primary-hover disabled:opacity-50"
            >
              {submitting ? 'Processando...' : isLogin ? 'Entrar no Sistema' : 'Finalizar Cadastro'}
              {!submitting && <ArrowRight size={14} />}
            </button>
          </form>

          {/* Social login divider */}
          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-outline-variant/20"></div>
            <span className="flex-shrink mx-4 text-[10px] text-outline uppercase tracking-wider font-semibold">
              Ou continue com
            </span>
            <div className="flex-grow border-t border-outline-variant/20"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 bg-surface-container-low hover:bg-surface-container-high text-on-surface border border-outline-variant/20 text-xs font-semibold rounded-md transition-all cursor-pointer active:scale-[0.99]"
          >
            <svg className="w-3.5 h-3.5 text-secondary fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.756 1 .5 6.256.5 12.7s5.256 11.7 11.74 11.7c6.775 0 11.27-4.761 11.27-11.46 0-.771-.082-1.359-.183-1.655H12.24z" />
            </svg>
            Entrar com o Google
          </button>
        </div>

        {/* Small portfolio reference footer */}
        <p className="text-[10px] text-outline-variant mt-8 font-medium">
          gCarletoAI &copy; {new Date().getFullYear()} &bull; Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

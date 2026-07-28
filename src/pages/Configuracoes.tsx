import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

interface ConfiguracoesProps {
  onBack: () => void;
}

export const Configuracoes: React.FC<ConfiguracoesProps> = ({ onBack }) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [envWebhookUrl, setEnvWebhookUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Carregar configurações do localStorage ou env
    const customUrl = localStorage.getItem('gcarleto_custom_webhook_url') || '';
    setWebhookUrl(customUrl);

    const defaultUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || 'Não configurado no .env';
    setEnvWebhookUrl(defaultUrl);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      if (webhookUrl.trim() === '') {
        localStorage.removeItem('gcarleto_custom_webhook_url');
      } else {
        localStorage.setItem('gcarleto_custom_webhook_url', webhookUrl.trim());
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Deseja redefinir o Webhook para o padrão do ambiente?')) {
      localStorage.removeItem('gcarleto_custom_webhook_url');
      setWebhookUrl('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
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
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Ajustes do Sistema</h2>
            <p className="text-[10px] text-outline font-medium tracking-wide">
              CONFIGURE SUAS INTEGRAÇÕES E PREFERÊNCIAS
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-[600px] w-full mx-auto px-6 py-10 space-y-8">
        <div className="backdrop-blur-md bg-white/[0.01] border border-white/5 rounded-xl p-8 shadow-level-2">
          {success && (
            <div className="mb-6 p-3 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2">
              Configurações salvas com sucesso!
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6 text-left">
            <div className="flex items-center gap-2 pb-4 border-b border-outline-variant/10">
              <Sparkles size={16} className="text-secondary animate-pulse-cyan" />
              <h3 className="text-sm font-semibold text-white">Integração do Agente (N8N)</h3>
            </div>

            <p className="text-xs text-outline leading-relaxed">
              O frontend do gCarletoAI se comunica com um fluxo no N8N. Por padrão, ele usa o URL do arquivo `.env`. Se você precisa testar um webhook diferente localmente ou em produção, informe-o abaixo.
            </p>

            {/* Custom Webhook Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                URL do Webhook (Sobrescrita Local)
              </label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://n8n.seu-servidor.com/webhook/..."
                className="w-full bg-[#1A1A21] border border-outline-variant/30 focus:border-indigo-500 outline-none px-4 py-2.5 text-xs text-white rounded-md transition-all placeholder:text-outline-variant"
              />
              <span className="text-[10px] text-outline-variant block">
                Deixe em branco para usar o padrão do sistema.
              </span>
            </div>

            {/* Env Read-Only Webhook */}
            <div className="space-y-1.5 opacity-70">
              <label className="text-[11px] font-semibold text-outline-variant uppercase tracking-wider">
                Webhook Padrão do Sistema (.env)
              </label>
              <input
                type="text"
                value={envWebhookUrl}
                disabled
                className="w-full bg-surface-container-low border border-outline-variant/20 outline-none px-4 py-2.5 text-xs text-outline-variant rounded-md font-mono select-all"
              />
            </div>

            {/* System information cards */}
            <div className="p-4 bg-yellow-500/5 border border-yellow-500/15 rounded-md flex gap-3 text-left">
              <ShieldAlert size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-amber-300">Aviso sobre Segurança</h4>
                <p className="text-[11px] text-outline leading-relaxed mt-1">
                  As configurações salvas nesta página ficam armazenadas localmente no seu navegador (`localStorage`) e afetam apenas esta sessão. Nenhum dado do webhook é exposto publicamente no Supabase.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-outline-variant/10">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-md transition-all duration-150 shadow-md shadow-indigo-600/10 hover:shadow-indigo-500/30 flex items-center justify-center gap-2 cursor-pointer glow-primary-hover disabled:opacity-50"
              >
                <Save size={14} />
                {submitting ? 'Salvando...' : 'Salvar Ajustes'}
              </button>

              {webhookUrl && (
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-4 py-3 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/20 text-outline hover:text-white text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={14} />
                  Limpar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

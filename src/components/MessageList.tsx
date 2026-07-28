import React, { useState, useEffect, useRef } from 'react';
import type { Message } from '../types';
import { Copy, Check, Sparkles } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  sending?: boolean;
}

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-md overflow-hidden bg-surface-container-lowest border border-outline-variant shadow-level-2 font-mono text-[13px] text-left">
      <div className="flex items-center justify-between px-4 py-2 bg-surface-container-low border-b border-outline-variant text-[11px] text-outline font-sans">
        <span className="uppercase tracking-wider font-semibold">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-on-surface transition-colors cursor-pointer text-outline font-medium"
        >
          {copied ? <Check size={12} className="text-secondary" /> : <Copy size={12} />}
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto max-w-full text-on-surface-variant font-mono scrollbar-thin">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
};

const FormattedMessage: React.FC<{ content: string }> = ({ content }) => {
  // Split into code blocks and normal text
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-1 select-text">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const language = match ? match[1] : '';
          const code = match ? match[2] : part.slice(3, -3);
          return <CodeBlock key={index} code={code} language={language} />;
        }

        // Format regular text (newlines, bold)
        const lines = part.split('\n');
        return (
          <div key={index} className="leading-relaxed">
            {lines.map((line, lineIdx) => {
              // Parse **bold** markers
              const segments = line.split(/(\*\*.*?\*\*)/g);
              const renderedLine = segments.map((seg, segIdx) => {
                if (seg.startsWith('**') && seg.endsWith('**')) {
                  return (
                    <strong key={segIdx} className="font-semibold text-on-surface">
                      {seg.slice(2, -2)}
                    </strong>
                  );
                }
                return seg;
              });

              return (
                <p key={lineIdx} className={lineIdx > 0 ? 'mt-2 min-h-[1.5rem]' : ''}>
                  {renderedLine.length === 0 || (renderedLine.length === 1 && renderedLine[0] === '') ? '\u00A0' : renderedLine}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export const MessageList: React.FC<MessageListProps> = ({ messages, sending }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-thin">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 select-none opacity-60">
          <div className="w-12 h-12 rounded-full border border-indigo-500/20 flex items-center justify-center bg-indigo-500/5 mb-4 animate-pulse-indigo">
            <Sparkles size={22} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-on-surface mb-2">gCarletoAI</h3>
          <p className="max-w-md text-sm text-outline">
            Seu assistente virtual de inteligência artificial. Envie uma mensagem no campo abaixo para iniciar a conversa.
          </p>
        </div>
      ) : (
        messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {isUser ? (
                <div className="max-w-[80%] bg-surface-container-high text-on-surface rounded-md px-4 py-3 shadow-level-2 text-right">
                  <div className="text-[11px] text-outline mb-1 font-semibold select-none">
                    Você
                  </div>
                  <div className="text-[15px] whitespace-pre-wrap leading-relaxed text-left">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div className="max-w-[90%] border-l-2 border-indigo-500/60 pl-4 py-3 px-4 text-left bg-surface-container-high text-on-surface rounded-md shadow-level-2">
                  <div className="text-[11px] text-[#5de6ff] mb-1.5 font-semibold flex items-center gap-1 select-none">
                    <Sparkles size={11} className="text-secondary" />
                    gCarletoAI
                  </div>
                  <div className="text-[15px] text-on-surface">
                    <FormattedMessage content={msg.content} />
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}

      {sending && (
        <div className="flex w-full justify-start">
          <div className="max-w-[90%] border-l-2 border-indigo-500/40 pl-4 py-2 text-left">
            <div className="text-[11px] text-outline mb-1.5 font-semibold flex items-center gap-1.5 select-none animate-pulse-indigo">
              <Sparkles size={11} className="text-[#5de6ff]" />
              gCarletoAI pensando
            </div>
            <div className="flex items-center gap-1.5 py-1 px-0.5">
              <span className="w-1.5 h-1.5 bg-[#5de6ff] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-[#5de6ff] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-[#5de6ff] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
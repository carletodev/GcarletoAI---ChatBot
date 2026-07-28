import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder = 'Escreva sua mensagem...',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSubmit();
      }
    }
  };

  const isFilled = value.trim().length > 0;

  return (
    <div className="relative w-full rounded-md bg-surface-container-low border border-transparent focus-within:border-indigo-500 transition-all duration-150 shadow-level-2">
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full pr-12 pl-4 py-3 bg-transparent text-on-surface placeholder:text-outline outline-none resize-none overflow-y-auto max-h-[200px] font-sans text-[15px] leading-relaxed rounded-md"
      />
      <button
        onClick={onSubmit}
        disabled={disabled || !isFilled}
        type="button"
        className={`absolute right-3 bottom-2.5 p-1.5 rounded-md transition-all duration-150 ${
          isFilled && !disabled
            ? 'text-secondary hover:text-on-surface hover:scale-105 filter drop-shadow-[0_0_8px_rgba(93,230,255,0.6)] cursor-pointer'
            : 'text-outline-variant cursor-not-allowed opacity-50'
        }`}
        title="Enviar mensagem"
      >
        <Send size={18} />
      </button>
    </div>
  );
};
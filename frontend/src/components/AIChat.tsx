import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AI_MODELS } from '../config/aiModels';

interface Message { sender: 'user' | 'assistant'; text: string; }
interface AIChatProps {
  endpoint: 'tutor' | 'lesson' | 'analytics';
  title: string;
  placeholder: string;
  poweredBy?: string;
  sessionId?: number;
}

const AIChat: React.FC<AIChatProps> = ({ endpoint, title, placeholder, poweredBy, sessionId }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => endRef.current?.scrollIntoView({ behavior: 'smooth' });

  const sendMessage = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    scrollToBottom();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/ai/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ prompt: userMsg, session_id: sessionId })
        }
      );
      // CODEX: Abort streaming on HTTP error statuses
      if (!res.ok) {
        const errorResp = await res.json();
        const text = errorResp.detail || t('ai_error');
        setMessages(prev => [...prev, { sender: 'assistant', text }]);
        scrollToBottom();
        return;
      }
      if (!res.body) throw new Error('No response body');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      setMessages(prev => [...prev, { sender: 'assistant', text: '' }]);
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value || new Uint8Array());
        setMessages(prev => {
          const msgs = [...prev]; msgs[msgs.length - 1].text += chunk; return msgs;
        });
        scrollToBottom();
      }
    } catch (err) {
      console.error('AIChat error', err);
      setMessages(prev => [...prev, { sender: 'assistant', text: t('ai_error') }]);
      scrollToBottom();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-xl font-semibold mb-4 transition-colors duration-300">{title}</h3>
      <div className="flex-1 overflow-y-auto p-4 bg-[var(--bg-color)] rounded-lg space-y-3 transition-colors duration-300">
        {isLoading && (
          <div className="mb-2 flex justify-start">
            <div className="w-6 h-6 bg-[var(--primary-color)] rounded animate-shake"></div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2 rounded-lg max-w-3/4 ${m.sender === 'user' ? 'bg-[var(--primary-color)] text-white' : 'bg-[var(--bg-color-hover)] text-[var(--text-color)]'}`}>{m.text}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="border-t border-[var(--border-color)] p-4 flex items-center space-x-2">
        <input
          type="text"
          className="flex-1 p-3 bg-[var(--bg-color-hover)] border border-[var(--border-color)] rounded-lg text-[var(--text-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-all duration-200"
          placeholder={placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-[var(--primary-color)] text-white p-3 rounded-lg hover:bg-[var(--secondary-color)] transition-all duration-200">
          {t('generate')}
        </button>
      </div>
      {poweredBy && <p className="mt-2 text-xs text-center text-[var(--text-color)] opacity-60">{poweredBy}</p>}
    </div>
  );
};

export default AIChat;

// CODEX: Sidebar for managing and selecting chat sessions
import React, { useState, useEffect } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';

interface ChatSession { id: number; created_at: string; }
interface ChatSidebarProps { sessionId: number | null; setSessionId: (id: number) => void; }

const ChatSidebar: React.FC<ChatSidebarProps> = ({ sessionId, setSessionId }) => {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/chat/sessions');
      setSessions(res.data);
    } catch (err) {
      console.error('Error fetching chat sessions:', err);
    }
  };

  useEffect(() => { fetchSessions(); }, []);

  const handleNew = async () => {
    try {
      const res = await api.post('/chat/sessions');
      setSessionId(res.data.id);
      fetchSessions();
    } catch (err) {
      console.error('Error creating session:', err);
    }
  };

  return (
    <div className="w-64 border-r border-[var(--border-color)] p-4 flex flex-col">
      <button onClick={handleNew} className="mb-4 p-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)]">
        {t('new_chat')}
      </button>
      <div className="flex-1 overflow-y-auto">
        {sessions.map(sess => (
          <div key={sess.id}
               onClick={() => setSessionId(sess.id)}
               className={`p-2 mb-2 rounded-lg cursor-pointer ${sessionId === sess.id ? 'bg-[var(--bg-color-hover)]' : 'bg-[var(--bg-color)]'}`}>
            {new Date(sess.created_at).toLocaleString()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;

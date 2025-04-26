// CODEX: Sidebar for managing and selecting chat sessions
import React, { useState, useEffect } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';

interface ChatSession { id: number; created_at: string; }
interface ChatSidebarProps { sessionId: number | null; setSessionId: (id: number | null) => void; }

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
      // if current session exists but has no messages, do not create duplicate empty session
      if (sessionId != null) {
        const msgRes = await api.get(`/chat/sessions/${sessionId}/messages`);
        if (msgRes.data.length === 0) return;
      }
      const res = await api.post('/chat/sessions');
      setSessionId(res.data.id);
      fetchSessions();
    } catch (err) {
      console.error('Error creating session:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/chat/sessions/${id}`);
      if (sessionId === id) setSessionId(null);
      fetchSessions();
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  return (
    <div className="w-64 border-r border-[var(--border-color)] p-4 flex flex-col">
      <button type="button" onClick={handleNew} className="mb-4 p-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)]">
        {t('new_chat')}
      </button>
      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="text-center text-[var(--text-color)] opacity-60">{t('no_sessions')}</div>
        ) : (
          sessions.map(sess => (
            <div key={sess.id}
                 className={`p-2 mb-2 rounded-lg cursor-pointer flex justify-between items-center ${sessionId === sess.id ? 'bg-[var(--bg-color-hover)]' : 'bg-[var(--bg-color)]'}`}
                 onClick={() => setSessionId(sess.id)}>
              <span>{new Date(sess.created_at).toLocaleString()}</span>
              <button type="button" aria-label={t('delete_chat') as string} onClick={e => { e.stopPropagation(); handleDelete(sess.id); }} className="ml-2 text-red-500 hover:text-red-700">×</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;

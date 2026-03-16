import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { getConversations, getMessages, sendMessage } from '../services/messageService';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function formatMessageTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function formatMessageDate(dateStr) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}

// Group messages by day
function groupByDate(messages) {
  const groups = [];
  let lastDate = null;
  for (const msg of messages) {
    const day = new Date(msg.created_at).toDateString();
    if (day !== lastDate) {
      groups.push({ type: 'date', label: formatMessageDate(msg.created_at) });
      lastDate = day;
    }
    groups.push({ type: 'message', data: msg });
  }
  return groups;
}

export function MessagesPage() {
  const { id: activeId } = useParams();
  const navigate = useNavigate();
  const { appUser } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null); // { conversation, messages }
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  // Load conversation list
  useEffect(() => {
    getConversations()
      .then(setConversations)
      .catch(() => toast.error('Failed to load conversations'))
      .finally(() => setLoadingConvos(false));
  }, []);

  // Load messages when active conversation changes
  const loadMessages = useCallback(async (convId, silent = false) => {
    if (!convId) return;
    if (!silent) setLoadingMsgs(true);
    try {
      const data = await getMessages(convId);
      setActive(data);
      // Update unread count in sidebar
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, unread_count: 0 } : c))
      );
    } catch {
      if (!silent) toast.error('Failed to load messages');
    } finally {
      if (!silent) setLoadingMsgs(false);
    }
  }, []);

  useEffect(() => {
    if (activeId) {
      loadMessages(activeId);
    } else {
      setActive(null);
    }
  }, [activeId, loadMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active?.messages?.length]);

  // Poll for new messages every 4s
  useEffect(() => {
    if (!activeId) return;
    pollRef.current = setInterval(() => loadMessages(activeId, true), 4000);
    return () => clearInterval(pollRef.current);
  }, [activeId, loadMessages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!draft.trim() || !activeId) return;
    const text = draft.trim();
    setDraft('');
    setSending(true);
    try {
      const msg = await sendMessage(activeId, text);
      setActive((prev) => ({
        ...prev,
        messages: [...(prev?.messages ?? []), msg],
      }));
      setConversations((prev) =>
        prev.map((c) => c.id === activeId ? { ...c, last_message: text, last_message_at: msg.created_at } : c)
      );
    } catch {
      toast.error('Failed to send message');
      setDraft(text); // restore draft on failure
    } finally {
      setSending(false);
    }
  }

  function getOtherName(conv) {
    if (!appUser) return '';
    return appUser.role === 'host' ? conv.cleaner_name : conv.host_name;
  }

  const grouped = active ? groupByDate(active.messages) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="font-heading text-3xl text-gray-900 mb-6">Messages</h1>

      <div className="flex gap-4 h-[70vh] bg-white rounded-2xl border border-gray-100 overflow-hidden">

        {/* Sidebar — conversation list */}
        <div className={`w-full sm:w-72 shrink-0 border-r border-gray-100 flex flex-col ${activeId ? 'hidden sm:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Conversations</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConvos ? (
              <p className="text-sm text-gray-400 p-4">Loading…</p>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500">No conversations yet.</p>
                {appUser?.role === 'host' && (
                  <Link to="/search" className="text-sm text-[#0D9488] hover:underline mt-1 inline-block">
                    Find a cleaner →
                  </Link>
                )}
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => navigate(`/messages/${conv.id}`)}
                  className={`w-full text-left px-4 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    conv.id === activeId ? 'bg-teal-50 border-l-2 border-l-[#0D9488]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm text-gray-900 truncate">{getOtherName(conv)}</p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {conv.unread_count > 0 && (
                        <span className="bg-[#0D9488] text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                          {conv.unread_count}
                        </span>
                      )}
                      {conv.last_message_at && (
                        <span className="text-[10px] text-gray-400">{timeAgo(conv.last_message_at)}</span>
                      )}
                    </div>
                  </div>
                  {conv.last_message && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{conv.last_message}</p>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message thread */}
        <div className={`flex-1 flex flex-col min-w-0 ${activeId ? 'flex' : 'hidden sm:flex'}`}>
          {!activeId ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Select a conversation
            </div>
          ) : loadingMsgs ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Loading…</div>
          ) : (
            <>
              {/* Thread header */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                <button
                  onClick={() => navigate('/messages')}
                  className="sm:hidden text-sm text-gray-500 hover:text-gray-700"
                >
                  ←
                </button>
                <div className="w-8 h-8 rounded-full bg-[#0D9488] text-white flex items-center justify-center text-sm font-semibold">
                  {active?.conversation && getOtherName(active.conversation)?.charAt(0).toUpperCase()}
                </div>
                <p className="font-medium text-gray-900 text-sm">
                  {active?.conversation && getOtherName(active.conversation)}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {grouped.length === 0 && (
                  <p className="text-center text-sm text-gray-400 mt-8">No messages yet. Say hello!</p>
                )}
                {grouped.map((item, i) =>
                  item.type === 'date' ? (
                    <div key={i} className="flex items-center gap-3 py-3">
                      <div className="flex-1 h-px bg-gray-100" />
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest">{item.label}</span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>
                  ) : (
                    <MessageBubble
                      key={item.data.id}
                      message={item.data}
                      isMine={item.data.sender_id === appUser?.id}
                    />
                  )
                )}
                <div ref={bottomRef} />
              </div>

              {/* Compose */}
              <form onSubmit={handleSend} className="px-4 py-3 border-t border-gray-100 flex gap-2">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                  disabled={sending}
                />
                <Button type="submit" size="sm" loading={sending} disabled={!draft.trim()}>
                  Send
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, isMine }) {
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-1`}>
      <div
        className={`max-w-xs sm:max-w-sm lg:max-w-md px-3.5 py-2 rounded-2xl text-sm ${
          isMine
            ? 'bg-[#0D9488] text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
        }`}
      >
        <p className="leading-relaxed">{message.body}</p>
        <p className={`text-[10px] mt-1 ${isMine ? 'text-teal-200 text-right' : 'text-gray-400'}`}>
          {formatMessageTime(message.created_at)}
        </p>
      </div>
    </div>
  );
}

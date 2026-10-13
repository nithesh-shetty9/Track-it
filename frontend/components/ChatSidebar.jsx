import { useEffect, useRef, useState } from "react";
import { FiMessageCircle, FiSend, FiX } from "react-icons/fi";
import api, { errorMessage } from "../api/index";
import { Avatar, ErrorState, Skeleton } from "./Common";

const time = (value) => new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(value));

const ChatSidebar = ({ project, open, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    let active = true;
    api.chat.list(project._id).then((result) => {
      if (active) { setMessages(result.messages || []); setUnread(result.unreadCount || 0); setError(""); }
    }).catch((failure) => active && setError(errorMessage(failure))).finally(() => active && setLoading(false));
    const stream = new EventSource(api.chat.streamUrl(project._id), { withCredentials: true });
    stream.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      setMessages((current) => current.some((item) => String(item._id) === String(message._id)) ? current : [...current, message]);
      if (!open) setUnread((count) => count + 1);
    });
    stream.onerror = () => setError("Chat connection interrupted. Retrying…");
    return () => { active = false; stream.close(); };
  }, [project._id, open]);

  useEffect(() => {
    if (!open) return;
    api.chat.markRead(project._id).then(() => setUnread(0)).catch(() => undefined);
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [open, project._id, messages.length]);

  const send = async (event) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || sending) return;
    setSending(true);
    try {
      const result = await api.chat.send(project._id, content);
      setMessages((current) => current.some((item) => String(item._id) === String(result.message._id)) ? current : [...current, result.message]);
      setDraft("");
    } catch (failure) { setError(errorMessage(failure)); }
    finally { setSending(false); }
  };

  if (!open) return null;
  return (
    <aside className="chat-sidebar" aria-label={`${project.name} team chat`}>
      <header className="chat-head">
        <div className="row"><FiMessageCircle /><div><strong>{project.name}</strong><div className="muted small">Team chat {unread ? `· ${unread} unread` : ""}</div></div></div>
        <button className="icon-btn" aria-label="Close chat" onClick={onClose}><FiX /></button>
      </header>
      <div className="chat-messages" aria-live="polite">
        {loading ? <Skeleton rows={5} /> : error && !messages.length ? <ErrorState message={error} /> : messages.length ? messages.map((message) => (
          <article className="chat-message" key={message._id}>
            <Avatar name={message.sender?.name} size={28} />
            <div className="chat-bubble"><div className="row between"><strong>{message.sender?.name || "Teammate"}</strong><time className="muted small">{time(message.createdAt)}</time></div><p>{message.content}</p></div>
          </article>
        )) : <div className="empty"><FiMessageCircle /><h3>No messages yet</h3><p>Start the conversation with your team.</p></div>}
        <div ref={endRef} />
      </div>
      {error && messages.length > 0 && <p className="chat-error">{error}</p>}
      <form className="chat-composer" onSubmit={send}>
        <textarea value={draft} maxLength={2000} rows={2} aria-label="Chat message" placeholder="Message your team…" onChange={(event) => setDraft(event.target.value)} />
        <button className="btn primary" disabled={!draft.trim() || sending} aria-label="Send message"><FiSend /> {sending ? "Sending" : "Send"}</button>
      </form>
    </aside>
  );
};

export default ChatSidebar;

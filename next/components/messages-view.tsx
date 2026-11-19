'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { WorkspacePage } from './workspace-page';
import styles from './messages-view.module.css';

type Message = { id: string; text: string; author: string; own: boolean; at: string };
type Conversation = { id: string; title: string; initials: string; tone: string; messages: Message[] };
const storageKey = 'flydigital-messages-v1';
const initialConversations: Conversation[] = [
  { id: 'general', title: 'General Account', initials: 'PS', tone: 'red', messages: [
    { id: 'general-1', author: 'Priya Sharma', own: false, at: '2026-09-21T15:45:00+05:45', text: 'Hi Rahul! Welcome to your Fly client portal. This is your central hub for marketing strategy, creative production, and branding projects. Let me know if you have any questions!' },
    { id: 'general-2', author: 'Rahul Sharma', own: true, at: '2026-09-21T16:00:00+05:45', text: 'Thank you Priya! Excited to see everything coming together in one place.' },
    { id: 'general-3', author: 'Priya Sharma', own: false, at: '2026-09-21T16:15:00+05:45', text: 'You have a few items needing your attention: the homepage design V2, brand color palette V2, and photography selection are all awaiting your review.' },
  ] },
  { id: 'branding', title: 'Branding and Visual Identity', initials: 'BT', tone: 'pink', messages: [
    { id: 'branding-1', author: 'Brand Team', own: false, at: '2026-09-21T15:00:00+05:45', text: 'Hi Rahul, the color palette V2.2 is ready for your review. We have refined the primary colors and updated the brand guidelines draft.' },
  ] },
  { id: 'production', title: 'Creative Production', initials: 'AK', tone: 'green', messages: [
    { id: 'production-1', author: 'Aakash Rai', own: false, at: '2026-09-21T14:30:00+05:45', text: 'Hi Rahul, what is your photography date this month? We are ready to schedule the interior and food photography session.' },
  ] },
];

function isMessage(value: unknown): value is Message {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<Message>;
  return typeof item.id === 'string' && typeof item.text === 'string' && typeof item.author === 'string' && typeof item.own === 'boolean' && typeof item.at === 'string' && !Number.isNaN(Date.parse(item.at));
}

export function MessagesView() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selected, setSelected] = useState('general');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [storageFailed, setStorageFailed] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const active = conversations.find(item => item.id === selected)!;
  const draft = drafts[selected] ?? '';

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '{}');
      if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
        const messages = saved as Record<string, unknown>;
        setConversations(initialConversations.map(conversation => {
          const stored = messages[conversation.id];
          return { ...conversation, messages: [...conversation.messages, ...(Array.isArray(stored) ? stored.filter(isMessage).filter(message => message.own) : [])] };
        }));
      }
    } catch {
      setStorageFailed(true);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(conversations.map(conversation => [conversation.id, conversation.messages.filter(message => message.own && !initialConversations.find(item => item.id === conversation.id)!.messages.some(item => item.id === message.id))]))));
    } catch {
      setStorageFailed(true);
    }
  }, [conversations, loaded]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [selected, active.messages.length]);

  function send(event?: FormEvent) {
    event?.preventDefault();
    const text = draft.trim();
    if (!text || !loaded) return;
    const message: Message = { id: crypto.randomUUID(), text, author: 'Rahul Sharma', own: true, at: new Date().toISOString() };
    setConversations(current => current.map(conversation => conversation.id === selected ? { ...conversation, messages: [...conversation.messages, message] } : conversation));
    setDrafts(current => ({ ...current, [selected]: '' }));
    inputRef.current?.focus();
  }

  return <WorkspacePage title="Messages" subtitle="Chat with your Fly team">
    <div className={styles.inbox}>
      <section className={styles.conversations} aria-labelledby="conversations-heading">
        <h2 className={styles.panelHeading} id="conversations-heading">Conversations</h2>
        <div className={styles.conversationList}>{conversations.map(conversation => {
          const latest = conversation.messages[conversation.messages.length - 1];
          return <button type="button" key={conversation.id} className={`${styles.conversation} ${selected === conversation.id ? styles.selected : ''}`} aria-pressed={selected === conversation.id} aria-controls="message-chat" onClick={() => setSelected(conversation.id)}>
            <span className={`${styles.avatar} ${styles[conversation.tone]}`}>{conversation.initials}</span>
            <span className={styles.preview}><strong>{conversation.title}</strong><span>{latest.author}: {latest.text}</span></span>
          </button>;
        })}</div>
      </section>
      <section id="message-chat" className={styles.chat} aria-labelledby="chat-heading">
        <h2 id="chat-heading" className={styles.panelHeading}><span className={`${styles.avatar} ${styles[active.tone]}`}>{active.initials}</span>{active.title}</h2>
        <div ref={threadRef} className={styles.thread} role="log" aria-label={`${active.title} messages`} aria-live="polite" aria-relevant="additions text">
          {active.messages.map(message => <div key={message.id} className={`${styles.message} ${message.own ? styles.own : ''}`}>
            <span className={`${styles.avatar} ${message.own ? styles.green : styles[active.tone]}`}>{message.own ? 'RS' : active.initials}</span>
            <div className={styles.messageBody}><p>{message.text}</p><small>{message.author} · <time dateTime={message.at}>{new Intl.DateTimeFormat('en-GB', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kathmandu' }).format(new Date(message.at))}</time></small></div>
          </div>)}
        </div>
        <form className={styles.composer} onSubmit={send}>
          <label className={styles.srOnly} htmlFor="message-draft">Message {active.title}</label>
          <textarea ref={inputRef} id="message-draft" placeholder="Type a message..." value={draft} maxLength={5000} rows={2} disabled={!loaded} onChange={event => setDrafts(current => ({ ...current, [selected]: event.target.value }))} onKeyDown={event => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) {
              event.preventDefault();
              send();
            }
          }} />
          <button type="submit" disabled={!draft.trim() || !loaded} aria-label="Send message">Send</button>
        </form>
        <p className={styles.notice} role="status">{storageFailed ? 'Browser storage is unavailable. New messages will last for this visit only.' : 'Demo chat · Messages are saved in this browser only.'} Enter to send · Shift+Enter for a new line.</p>
      </section>
    </div>
  </WorkspacePage>;
}

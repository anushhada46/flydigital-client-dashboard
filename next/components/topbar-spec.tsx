'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import styles from './topbar-spec.module.css';

const notifications = [
  { id: 'approval-festive-04', title: 'A creative needs your review', detail: 'Instagram Reel — Festive Promo #04', category: 'Approvals', href: '/approvals', icon: '!', tone: 'pink' },
  { id: 'message-general', title: 'A message from your Fly team', detail: 'Priya Sharma · General Account', category: 'Messages', href: '/messages', icon: 'PS', tone: 'blue' },
  { id: 'report-august', title: 'Your performance report is ready', detail: 'SMM Performance Report · August 2026', category: 'Reports', href: '/reports', icon: '↗', tone: 'green' },
  { id: 'invoice-1005', title: 'You have a pending invoice', detail: 'FD-26-1005 · Website Development', category: 'Billing', href: '/billing', icon: '₹', tone: 'yellow' },
  { id: 'approval-festive-05', title: 'New creative submitted', detail: 'Instagram Reel — Festive Promo #05', category: 'Approvals', href: '/approvals', icon: '!', tone: 'pink' },
  { id: 'approval-foodie', title: 'Your changes have been requested', detail: 'Creator Content · Kathmandufoodie Reel', category: 'Approvals', href: '/approvals', icon: '↻', tone: 'blue' },
] as const;
const storageKey = 'flydigital-notifications-read-v1';

export function Topbar() {
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<'All' | 'Unread'>('All');
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const unread = notifications.filter(item => !readIds.includes(item.id)).length;
  const visible = notifications.filter(item => filter === 'All' || !readIds.includes(item.id));

  useEffect(() => {
    function syncRead() {
      try {
        const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
        if (Array.isArray(saved)) setReadIds(saved.filter((id): id is string => typeof id === 'string' && notifications.some(item => item.id === id)));
      } catch { /* Keep notifications usable when browser storage is unavailable. */ }
    }
    syncRead();
    window.addEventListener('storage', syncRead);
    return () => window.removeEventListener('storage', syncRead);
  }, []);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    function outsideClick(event: PointerEvent) {
      if (event.target instanceof Node && !container.current?.contains(event.target)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    document.addEventListener('pointerdown', outsideClick);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outsideClick);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  function markRead(ids: string[]) {
    const updated = Array.from(new Set([...readIds, ...ids]));
    setReadIds(updated);
    try { localStorage.setItem(storageKey, JSON.stringify(updated)); }
    catch { /* Keep read state for this session. */ }
  }

  return <header className={`topbar ${styles.root}`}>
    <div className="top-actions">
      <label className="search"><span aria-hidden="true">⌕</span><input aria-label="Search" placeholder="Search reports, files, invoices..." /></label>
      <div className={styles.notificationContainer} ref={container} onBlur={event => {
        if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}>
        <button ref={trigger} type="button" className="notification" aria-label={`Notifications${unread ? `, ${unread} unread` : ', all read'}`} aria-expanded={open} aria-controls={open ? panelId : undefined} onClick={() => setOpen(value => !value)}>
          <img src="/images/notification.png" alt="" />
          {unread > 0 && <span>{unread}</span>}
        </button>
        {open && <section id={panelId} className={styles.dropdown} aria-labelledby={`${panelId}-heading`}>
          <div className={styles.dropdownHeader}>
            <div><h2 id={`${panelId}-heading`}>Notifications</h2><p>{unread ? `${unread} unread updates from your workspace` : 'You’re all caught up'}</p></div>
            <button ref={closeButton} className={styles.close} type="button" aria-label="Close notifications" onClick={() => { setOpen(false); trigger.current?.focus(); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
          </div>
          <div className={styles.toolbar}>
            <div className={styles.filters} role="group" aria-label="Filter notifications">
              {(['All', 'Unread'] as const).map(label => <button className={styles.filter} type="button" key={label} aria-pressed={filter === label} onClick={() => setFilter(label)}>{label}{label === 'Unread' && unread > 0 ? ` (${unread})` : ''}</button>)}
            </div>
            <button className={styles.markAll} type="button" disabled={!unread} onClick={() => markRead(notifications.map(item => item.id))}>Mark all as read</button>
          </div>
          <ul className={styles.notificationList}>
            {visible.map(item => {
              const isUnread = !readIds.includes(item.id);
              return <li key={item.id}>
                <Link className={`${styles.notificationItem}${isUnread ? ` ${styles.unread}` : ''}`} href={item.href} onClick={() => { markRead([item.id]); setOpen(false); }}>
                  <span className={`${styles.itemIcon} ${styles[item.tone]}`} aria-hidden="true">{item.icon}</span>
                  <div className={styles.itemCopy}><span className={styles.category}>{item.category}</span><h3>{item.title}</h3><p>{item.detail}</p></div>
                  {isUnread && <span className={styles.unreadDot} aria-label="Unread" />}
                </Link>
              </li>;
            })}
          </ul>
          {visible.length === 0 && <div className={styles.empty}><span aria-hidden="true">✓</span><h3>All caught up!</h3><p>You have no unread notifications.</p></div>}
          <div className={styles.dropdownFooter}><span className={styles.footerDot} aria-hidden="true" />Your workspace, up to date.</div>
        </section>}
      </div>
    </div>
  </header>;
}

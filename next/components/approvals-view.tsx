'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Sidebar } from './sidebar-spec';
import { Topbar } from './topbar-spec';
import styles from './approvals-view.module.css';

const filters = ['All', 'Awaiting review', 'Approved', 'Changes requested'] as const;
type Status = Exclude<typeof filters[number], 'All'>;
type Approval = { id: string; title: string; status: Status; version: string; submitted: string; creative: 'festive' | 'food'; feedback?: string };
const initialApprovals: Approval[] = [
  { id: 'festive-04', title: 'Instagram Reel - Festive Promo #04', status: 'Awaiting review', version: '1.2', submitted: 'September 5, 2026', creative: 'festive' },
  { id: 'festive-05', title: 'Instagram Reel - Festive Promo #05', status: 'Awaiting review', version: '1.1', submitted: 'September 5, 2026', creative: 'festive' },
  { id: 'festive-03', title: 'Instagram Reel - Festive Promo #03', status: 'Approved', version: '1.0', submitted: 'September 3, 2026', creative: 'festive' },
  { id: 'foodie-reel', title: 'Creator Content - Kathmandufoodie Reel', status: 'Changes requested', version: '1.0', submitted: 'September 3, 2026', creative: 'food', feedback: 'Please include a closer shot of the featured dishes.' },
];
const storageKey = 'flydigital-approvals-v1';

function tone(status: typeof filters[number]) {
  return status === 'Awaiting review' ? styles.pink : status === 'Approved' ? styles.green : status === 'Changes requested' ? styles.blue : styles.yellow;
}

// Display the original creative areas from the supplied design reference.
function Artwork({ creative }: { creative: Approval['creative'] }) {
  return <svg className={styles.artwork} viewBox={creative === 'festive' ? '150 107 166 130' : '335 280 165 129'} role="img" aria-label={creative === 'festive' ? 'A lit diya surrounded by a colorful festive rangoli' : 'A creator photographing restaurant dishes with a phone'}>
    <image href="/images/approvals-reference.png" width="534" height="478" />
  </svg>;
}

export function ApprovalsView() {
  const [approvals, setApprovals] = useState(initialApprovals);
  const [filter, setFilter] = useState<typeof filters[number]>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const selected = approvals.find(item => item.id === selectedId);
  const visible = approvals.filter(item => filter === 'All' || item.status === filter);

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
      if (Array.isArray(saved)) setApprovals(initialApprovals.map(item => {
        const update = saved.find(entry => entry?.id === item.id);
        return update && filters.slice(1).includes(update.status) ? { ...item, status: update.status, feedback: typeof update.feedback === 'string' ? update.feedback : undefined } : item;
      }));
    } catch { /* Use the original submissions when browser storage is unavailable. */ }
  }, []);

  useEffect(() => {
    if (selectedId && !dialog.current?.open) dialog.current?.showModal();
  }, [selectedId]);

  function review(status: Status) {
    if (!selected) return;
    const updated = approvals.map(item => item.id === selected.id ? { ...item, status, feedback: status === 'Changes requested' ? feedback.trim() : undefined } : item);
    setApprovals(updated);
    let notice = status === 'Approved' ? 'Creative approved.' : 'Your change request has been saved.';
    try { localStorage.setItem(storageKey, JSON.stringify(updated)); }
    catch { notice += ' Browser storage is unavailable; this update will last for this session.'; }
    setMessage(notice);
    dialog.current?.close();
    setSelectedId(null);
  }

  function requestChanges(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (feedback.trim()) review('Changes requested');
  }

  return <div className={`app-shell ${styles.shell}`}>
    <Sidebar fullHeight />
    <div className="page"><div className="page-inner">
      <Topbar />
      <main className={styles.main}>
        <h1 className={styles.title}>Approvals</h1>
        <div className={styles.filters} role="group" aria-label="Filter approvals by status">
          {filters.map(label => <button key={label} type="button" className={`${styles.filter} ${tone(label)}`} aria-pressed={filter === label} onClick={() => setFilter(label)}>{label}</button>)}
        </div>
        <p className={styles.notice} role="status">{message}</p>
        <div className={styles.grid}>
          {[0, 1].map(column => <div className={styles.column} key={column}>
            {visible.filter((_, index) => index % 2 === column).map(item => <button type="button" key={item.id} className={`${styles.card} ${tone(item.status)}`} aria-label={`Review ${item.title}, ${item.status}`} onClick={() => { setSelectedId(item.id); setFeedback(item.feedback ?? ''); }}>
              <Artwork creative={item.creative} />
              <div className={styles.cardCopy}>
                <h2>{item.title}</h2>
                <p>Version {item.version} | Submitted {item.submitted}</p>
                <p>By Sujan Lama</p>
                <span className={styles.srOnly}>{item.status}</span>
              </div>
            </button>)}
          </div>)}
        </div>
        {visible.length === 0 && <p className={styles.empty}>No approvals with this status.</p>}
      </main>
    </div></div>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="approval-review-title" onClose={() => setSelectedId(null)}>
      {selected && <>
        <div className={styles.dialogHeading}><h2 id="approval-review-title">{selected.title}</h2><button type="button" aria-label="Close review" onClick={() => dialog.current?.close()}>×</button></div>
        <Artwork creative={selected.creative} />
        <p className={styles.metadata}>V {selected.version} · Social Media Marketing · {selected.status}</p>
        <p>Review this creative for ABC Restaurant before publishing.</p>
        <form onSubmit={requestChanges}>
          <label htmlFor="approval-feedback">Feedback</label>
          <textarea id="approval-feedback" value={feedback} onChange={event => setFeedback(event.target.value)} placeholder="Describe the changes you would like…" required maxLength={2000} />
          <div className={styles.actions}><button type="button" className={styles.green} disabled={selected.status === 'Approved'} onClick={() => review('Approved')}>{selected.status === 'Approved' ? 'Approved' : 'Approve creative'}</button><button className={styles.blue} type="submit" disabled={!feedback.trim()}>Request changes</button></div>
        </form>
      </>}
    </dialog>
  </div>;
}

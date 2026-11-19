'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { WorkspacePage } from './workspace-page';
import styles from './requests-view.module.css';

const requestTypes = ['New Request', 'Website Change', 'Social Media Revision', 'Campaign Change', 'Additional Service', 'Account Question', 'General Request'];
const services = ['General / No specific service', 'Social Media Marketing', 'Branding and Visual Identity', 'Website Development', 'SEO', 'PPC / Google Ads', 'Influencer Marketing'];
const priorities = ['Low', 'Normal', 'High', 'Urgent'] as const;
type Priority = typeof priorities[number];
type ClientRequest = { id: string; type: string; service: string; title: string; description: string; priority: Priority; createdAt: string };
const storageKey = 'flydigital-requests-v1';

function isRequest(value: unknown): value is ClientRequest {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<ClientRequest>;
  return typeof item.id === 'string' && typeof item.title === 'string' && !!item.title.trim() && typeof item.description === 'string' && typeof item.type === 'string' && requestTypes.includes(item.type) && typeof item.service === 'string' && services.includes(item.service) && priorities.includes(item.priority as Priority) && typeof item.createdAt === 'string' && !Number.isNaN(Date.parse(item.createdAt));
}

export function RequestsView() {
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [storageFailed, setStorageFailed] = useState(false);
  const [type, setType] = useState('General Request');
  const [service, setService] = useState(services[0]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Normal');
  const [feedback, setFeedback] = useState('');
  const [mode, setMode] = useState<'create' | 'view' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const newRequestButton = useRef<HTMLButtonElement>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const selectedRequest = requests.find(request => request.id === selectedId);

  useEffect(() => {
    if (mode === 'edit') titleInput.current?.focus();
  }, [mode]);

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
      if (Array.isArray(saved)) setRequests(saved.filter(isRequest));
    } catch {
      setStorageFailed(true);
    }
    setLoaded(true);
  }, []);

  function saveRequests(updated: ClientRequest[]) {
    setRequests(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      setStorageFailed(true);
    }
  }

  function openNewRequest() {
    setSelectedId(null);
    setMode('create');
    setTitle('');
    setDescription('');
    setType('General Request');
    setService(services[0]);
    setPriority('Normal');
    dialog.current?.showModal();
  }

  function openRequest(request: ClientRequest) {
    setSelectedId(request.id);
    setMode('view');
    dialog.current?.showModal();
  }

  function editRequest() {
    if (!selectedRequest) return;
    setType(selectedRequest.type);
    setService(selectedRequest.service);
    setTitle(selectedRequest.title);
    setDescription(selectedRequest.description);
    setPriority(selectedRequest.priority);
    setMode('edit');
  }

  function deleteRequest() {
    if (!selectedRequest) return;
    saveRequests(requests.filter(request => request.id !== selectedRequest.id));
    setFeedback(`Request “${selectedRequest.title}” deleted.`);
    dialog.current?.close();
    setSelectedId(null);
    newRequestButton.current?.focus();
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !description.trim() || !loaded || (mode === 'edit' && !selectedRequest)) return;
    const request: ClientRequest = { id: selectedRequest?.id ?? crypto.randomUUID(), type, service, title: title.trim(), description: description.trim(), priority, createdAt: selectedRequest?.createdAt ?? new Date().toISOString() };
    saveRequests(mode === 'edit' ? requests.map(item => item.id === request.id ? request : item) : [request, ...requests]);
    setFeedback(`Request “${request.title}” ${mode === 'edit' ? 'updated' : 'added'}.`);
    if (mode === 'edit') {
      setMode('view');
    } else {
      dialog.current?.close();
    }
  }

  return <WorkspacePage title="Requests" subtitle="Submit requests to your Fly team" action={<button ref={newRequestButton} type="button" className={styles.newRequest} disabled={!loaded} onClick={openNewRequest}>+ New Request</button>}>
    {!loaded ? <p role="status">Loading requests...</p> : requests.length === 0 ? <section className={styles.empty} aria-labelledby="empty-requests-heading">
      <h2 id="empty-requests-heading">No Requests Yet</h2>
      <p>Submit a request to your Fly team — whether it&apos;s a new creative, a website change, or a general question.</p>
    </section> : <section className={styles.list} aria-label="Your requests">
      {requests.map(request => <article className={styles.card} key={request.id}>
        <header className={styles.cardHeading}><h2><button type="button" className={styles.openRequest} aria-label={`Open request: ${request.title}`} onClick={() => openRequest(request)}>{request.title}</button></h2><span className={`${styles.tag} ${styles[request.priority.toLowerCase()]}`}>{request.priority}</span></header>
        <p className={styles.requestType}>{request.type}{request.service !== services[0] && <span> · {request.service}</span>}</p>
        <p className={styles.description}>{request.description}</p>
      </article>)}
    </section>}
    <p className={styles.feedback} role="status">{feedback}</p>
    <p className={styles.notice}>{storageFailed ? 'Browser storage is unavailable. New requests will last for this visit only.' : 'Requests are saved in this browser only.'}</p>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="request-dialog-heading">
      <header className={styles.dialogHeading}><h2 id="request-dialog-heading">{mode === 'view' ? 'Request Details' : mode === 'edit' ? 'Edit Request' : 'New Request'}</h2><button type="button" className={styles.close} onClick={() => dialog.current?.close()} aria-label="Close request dialog"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" /></svg></button></header>
      {mode === 'view' && selectedRequest ? <div className={styles.details}>
        <div className={styles.cardHeading}><h3>{selectedRequest.title}</h3><span className={`${styles.tag} ${styles[selectedRequest.priority.toLowerCase()]}`}>{selectedRequest.priority}</span></div>
        <dl className={styles.metadata}><dt>Request Type</dt><dd>{selectedRequest.type}</dd><dt>Service</dt><dd>{selectedRequest.service}</dd><dt>Created</dt><dd><time dateTime={selectedRequest.createdAt}>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'Asia/Kathmandu' }).format(new Date(selectedRequest.createdAt))}</time></dd></dl>
        <h4>Description</h4><p className={styles.description}>{selectedRequest.description}</p>
        <div className={styles.detailActions}><button type="button" className={styles.newRequest} onClick={editRequest}>Edit Request</button><button type="button" className={styles.deleteRequest} onClick={deleteRequest}>Delete Request</button></div>
      </div> : <form className={styles.form} onSubmit={submit}>
        <label htmlFor="request-type">Request Type</label>
        <select id="request-type" value={type} onChange={event => setType(event.target.value)}>{requestTypes.map(item => <option key={item}>{item}</option>)}</select>
        <label htmlFor="request-service">Service <span>(optional)</span></label>
        <select id="request-service" value={service} onChange={event => setService(event.target.value)}>{services.map(item => <option key={item}>{item}</option>)}</select>
        <label htmlFor="request-title">Title</label>
        <input ref={titleInput} id="request-title" placeholder="Brief title for your request" value={title} onChange={event => setTitle(event.target.value)} required maxLength={150} />
        <label htmlFor="request-description">Description</label>
        <textarea id="request-description" placeholder="Describe your request in detail" value={description} onChange={event => setDescription(event.target.value)} required maxLength={5000} rows={4} />
        <fieldset className={styles.priorities}><legend>Priority</legend><div>{priorities.map(item => <button type="button" key={item} aria-pressed={priority === item} className={`${styles.priority} ${priority === item ? styles[item.toLowerCase()] : ''}`} onClick={() => setPriority(item)}>{item}</button>)}</div></fieldset>
        <div className={styles.submitRow}>{mode === 'edit' && <button type="button" className={styles.cancel} onClick={() => setMode('view')}>Cancel</button>}<button className={styles.submit} type="submit" disabled={!loaded || !title.trim() || !description.trim()}>{mode === 'edit' ? 'Save Changes' : 'Submit Request'}</button></div>
      </form>}
    </dialog>
  </WorkspacePage>;
}

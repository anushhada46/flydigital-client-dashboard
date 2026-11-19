'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { WorkspacePage } from './workspace-page';
import styles from './account-view.module.css';

const initialProfile = {
  business: 'ABC Restaurant',
  name: 'Rahul Sharma',
  email: 'rahul@abc.com',
  phone: '',
  location: '',
};
const storageKey = 'flydigital-account-v1';
const fields = [
  { key: 'business', label: 'Business name', type: 'text', autoComplete: 'organization' },
  { key: 'name', label: 'Contact name', type: 'text', autoComplete: 'name' },
  { key: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { key: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
  { key: 'location', label: 'Location', type: 'text', autoComplete: 'street-address' },
] as const;
const team = [
  { name: 'Anisha Karki', role: 'Account Manager', initials: 'AK' },
  { name: 'Prakash Shrestha', role: 'Creative Lead', initials: 'PS' },
  { name: 'Sujan Maharjan', role: 'SEO Specialist', initials: 'SM' },
];

export function AccountView() {
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
      if (!saved || typeof saved !== 'object') return;
      const values = saved as Record<string, unknown>;
      if (fields.every(({ key }) => typeof values[key] === 'string')) {
        setProfile(Object.fromEntries(fields.map(({ key }) => [key, values[key]])) as typeof initialProfile);
      }
    } catch { /* Keep the default profile when browser storage is unavailable. */ }
  }, []);

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updated = Object.fromEntries(fields.map(({ key }) => [key, draft[key].trim()])) as typeof initialProfile;
    if (!updated.business || !updated.name || !updated.email) return;
    setProfile(updated);
    setEditing(false);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setMessage('Profile saved in this browser.');
    } catch {
      setMessage('Profile updated for this session. Browser storage is unavailable.');
    }
  }

  return <WorkspacePage title="Account" subtitle="Your profile and account information">
    <div className={styles.columns}>
      <div className={styles.stack}>
        <section className={styles.card} aria-labelledby="profile-heading">
          <header className={styles.cardHeader}>
            <h2 id="profile-heading">Profile Information</h2>
            {!editing && <button className={styles.edit} type="button" onClick={() => { setDraft(profile); setEditing(true); setMessage(''); }}>Edit</button>}
          </header>
          {editing ? <form className={styles.form} onSubmit={saveProfile}>
            {fields.map(({ key, label, type, autoComplete }) => <label key={key} htmlFor={`profile-${key}`}>
              {label}
              <input id={`profile-${key}`} name={key} type={type} autoComplete={autoComplete} required={key === 'business' || key === 'name' || key === 'email'} maxLength={key === 'email' ? 254 : 160} value={draft[key]} onChange={event => setDraft({ ...draft, [key]: event.target.value })} />
            </label>)}
            <div className={styles.actions}>
              <button className={styles.save} type="submit">Save changes</button>
              <button className={styles.cancel} type="button" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form> : <>
            <div className={styles.identity}>
              <span className={styles.avatar} aria-hidden="true">{profile.business.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase()}</span>
              <div><h3>{profile.business}</h3><p>{profile.name}</p></div>
            </div>
            <dl className={styles.details}>
              <div><dt>Email</dt><dd><a href={`mailto:${profile.email}`}>{profile.email}</a></dd></div>
              <div><dt>Phone</dt><dd>{profile.phone || 'Not provided'}</dd></div>
              <div><dt>Location</dt><dd>{profile.location || 'Not provided'}</dd></div>
            </dl>
          </>}
          <p className={styles.notice} role="status">{message}</p>
        </section>
      </div>
      <div className={styles.stack}>
        <section className={`${styles.card} ${styles.teamCard}`} aria-labelledby="team-heading">
          <header className={styles.cardHeader}><h2 id="team-heading">Your Fly Team</h2></header>
          <ul className={styles.team}>
            {team.map(member => <li className={styles.member} key={member.name}>
              <span className={`${styles.avatar} ${styles.teamAvatar}`} aria-hidden="true">{member.initials}</span>
              <div><h3>{member.name}</h3><p>{member.role}</p></div>
            </li>)}
          </ul>
        </section>
      </div>
    </div>
  </WorkspacePage>;
}

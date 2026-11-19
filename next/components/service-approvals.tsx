import styles from './service-approvals.module.css';

const approvals = [
  {
    id: 'festive-menu-special',
    title: 'Static Post – Festive Menu Special',
    version: 'V 1.2',
    service: 'Social Media Marketing',
    updated: '2h ago',
  },
];

export const pendingApprovalCount = approvals.length;

function CreativePreview() {
  return <svg className={styles.thumbnail} viewBox="0 0 120 120" role="img" aria-label="Festive menu promotional creative preview">
    <rect width="120" height="120" fill="#173d36" />
    <path d="M0 0H120V28L0 60Z" fill="#f04e98" />
    <text x="9" y="17" fill="#fffdf5" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="700">FESTIVE MENU</text>
    <circle cx="66" cy="78" r="36" fill="#fff2cc" />
    <circle cx="66" cy="78" r="28" fill="#c67e32" />
    <path d="M44 68Q65 42 86 68L78 92H51Z" fill="#ee633c" />
    <path d="M49 67L58 85M66 58L72 90M80 66L58 76" stroke="#ffd100" strokeWidth="7" strokeLinecap="round" />
    <circle cx="47" cy="80" r="5" fill="#02b180" />
    <circle cx="82" cy="84" r="6" fill="#02b180" />
    <text x="8" y="112" fill="#fffdf5" fontFamily="Arial, sans-serif" fontSize="8">ABC RESTAURANT</text>
  </svg>;
}

export function ServiceApprovals() {
  return <section className={styles.panel} aria-labelledby="approvals-heading">
    <header className={styles.heading}>
      <h2 id="approvals-heading">Approvals</h2>
      <p>{pendingApprovalCount} awaiting your review</p>
    </header>
    <ul className={styles.list}>{approvals.map(approval => <li key={approval.id}>
      <div className={styles.row}>
        <CreativePreview />
        <div className={styles.copy}>
          <h3>{approval.title}</h3>
          <p>{approval.version} <span aria-hidden="true">|</span> {approval.service} <span aria-hidden="true">|</span> {approval.updated}</p>
        </div>
        <span className={styles.reviewStatus}>Awaiting review</span>
      </div>
    </li>)}</ul>
  </section>;
}

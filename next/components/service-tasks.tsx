import styles from './service-tasks.module.css';

const deliverables = [
  {
    title: 'Content Strategy – September',
    description: 'Proposed content strategy for September, ready to review before creative production.',
    name: 'Anisha Karki',
    date: '2026-09-18',
    progress: 33,
    status: 'Client reviewing',
    tone: 'reviewing',
  },
  {
    title: 'September Content Calendar',
    description: 'Plan and schedule all social media posts for September.',
    name: 'Sujan Maharjan',
    date: '2026-09-23',
    progress: 100,
    status: 'Approved',
    tone: 'approved',
  },
];

export function ServiceTasks() {
  return <section className={styles.panel} aria-labelledby="tasks-heading">
    <header className={styles.heading}>
      <h2 id="tasks-heading">Tasks &amp; Deliverables</h2>
      <p>{deliverables.length} items</p>
    </header>
    <ul className={styles.list}>{deliverables.map(deliverable => <li className={styles.item} key={deliverable.title}>
      <div className={styles.summary}>
        <h3>{deliverable.title}</h3>
        <p>{deliverable.description}</p>
        <small>{deliverable.name} | <time dateTime={deliverable.date}>{new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(deliverable.date))}</time></small>
      </div>
      <div className={styles.progress}>
        <span className={styles.percentage}>{deliverable.progress}%</span>
        <div className={styles.track} role="progressbar" aria-label={`${deliverable.title} progress`} aria-valuenow={deliverable.progress} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${deliverable.progress}%` }} />
        </div>
      </div>
      <span className={`${styles.status} ${styles[deliverable.tone]}`}>{deliverable.status}</span>
    </li>)}</ul>
  </section>;
}

import styles from './service-reports.module.css';

const reports = [
  {
    title: 'SMM Performance Report – August 2026',
    period: 'August 2026',
    href: '/api/reports/smm-performance-august-2026',
    filename: 'smm-performance-august-2026.pdf',
  },
];

export const serviceReportCount = reports.length;

export function ServiceReports() {
  return <section className={styles.panel} aria-labelledby="reports-heading">
    <header className={styles.heading}>
      <h2 id="reports-heading">Reports</h2>
      <p>{serviceReportCount} report{serviceReportCount === 1 ? '' : 's'}</p>
    </header>
    <ul className={styles.list}>{reports.map(report => <li className={styles.report} key={report.href}>
      <div className={styles.copy}>
        <h3>{report.title}</h3>
        <p>{report.period} · PDF</p>
      </div>
      <a className={styles.download} href={report.href} download={report.filename} aria-label={`Download ${report.title} PDF`}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M8 2v8m-3-3 3 3 3-3M3 10v3h10v-3" /></svg>
        Download
      </a>
    </li>)}</ul>
  </section>;
}

'use client';

import { useState } from 'react';
import { WorkspacePage } from './workspace-page';
import styles from './library-view.module.css';

const services = [
  { label: 'All', tone: 'yellow' },
  { label: 'Branding', tone: 'pink' },
  { label: 'Social Media Marketing', tone: 'blue' },
  { label: 'Website Development', tone: 'red' },
  { label: 'PPC and SEO', tone: 'green' },
  { label: 'Influencer Marketing', tone: 'pink' },
];
const reports = [
  { title: 'Brand Identity', service: 'Branding', subtitle: 'Branding and Visual Identity', date: 'September 21, 2026', tone: 'pink', copy: 'Brand identity sprint is 70% complete. Brand strategy, positioning, and logo system are approved. Color palette V2.1 is updated and ready to review.' },
  { title: 'Website Project Progress Report', service: 'Website Development', subtitle: 'Website Development', date: 'September 21, 2026', tone: 'red', copy: 'Website project is progressing well. Discovery, sitemap, and wireframes are complete. UI design is almost finished and the research is ready for review.' },
  { title: 'Production Progress Report', service: 'Social Media Marketing', subtitle: 'Creative Production', date: 'September 21, 2026', tone: 'blue', copy: 'Creative production is currently in the shooting phase. Main video photography is complete and approved. Interior and food photography are coming up next.' },
];
const files = [
  { id: 'website-sitemap', title: 'Website Sitemap', format: 'Document', type: 'Other', service: 'Website Development', tone: 'red', date: 'September 13, 2026', action: 'Open' },
  { id: 'ui-design-presentation', title: 'UI Design Presentation', format: 'Presentation', type: 'Proposals', service: 'Branding', tone: 'pink', date: 'September 13, 2026', action: 'Open' },
  { id: 'website-content-sheet', title: 'Website Content Sheet', format: 'Spreadsheet', type: 'Other', service: 'Website Development', tone: 'red', date: 'September 13, 2026', action: 'Open' },
  { id: 'website-sitemap-v2', title: 'Website Sitemap', format: 'Document', type: 'Other', service: 'Website Development', tone: 'red', date: 'September 21, 2026', action: 'Open' },
  { id: 'ui-design-presentation-v2', title: 'UI Design Presentation', format: 'Presentation', type: 'Proposals', service: 'Branding', tone: 'pink', date: 'September 21, 2026', action: 'Open' },
  { id: 'brand-guidelines', title: 'Brand Guidelines Draft', format: 'Text document', type: 'Other', service: 'Branding', tone: 'pink', date: 'September 21, 2026', action: 'Download' },
];
const fileTypes = ['All Files', 'Reports', 'Invoices', 'Contract', 'Proposals', 'Other'];

export function LibraryView({ mode }: { mode: 'reports' | 'files' }) {
  const [service, setService] = useState('All');
  const [fileType, setFileType] = useState('All Files');
  const isReports = mode === 'reports';
  const visibleReports = reports.filter(item => service === 'All' || item.service === service);
  const visibleFiles = files.filter(item => (service === 'All' || item.service === service) && (fileType === 'All Files' || item.type === fileType));

  return <WorkspacePage title={isReports ? 'Reports' : 'Files'} subtitle={isReports ? 'Performance reports across your services' : 'All your project files in one place'}>
    <div className={styles.filters} role="group" aria-label="Filter by service">
      {services.map(item => <button type="button" key={item.label} aria-pressed={service === item.label} className={`${styles.filter} ${styles[item.tone]}`} onClick={() => setService(item.label)}>{item.label}</button>)}
    </div>
    {!isReports && <div className={styles.filters} role="group" aria-label="Filter by file type">
      {fileTypes.map(type => <button type="button" key={type} aria-pressed={fileType === type} className={`${styles.filter} ${fileType === type ? styles.yellow : styles.neutral}`} onClick={() => setFileType(type)}>{type}</button>)}
    </div>}
    {isReports ? <section aria-label="Reports" className={styles.reportGrid}>
      {[0, 1].map(column => <div className={styles.column} key={column}>
        {visibleReports.filter((_, index) => index % 2 === column).map(report => <article key={report.title} className={`${styles.report} ${styles[report.tone]}`}>
          <h2>{report.title}</h2><p>{report.subtitle}</p><time dateTime="2026-09-21">{report.date}</time><p className={styles.summary}>{report.copy}</p>
        </article>)}
      </div>)}
    </section> : <section aria-label="Files" className={styles.fileGrid}>
      {[0, 1, 2].map(column => <div className={styles.column} key={column}>
        {visibleFiles.filter((_, index) => index % 3 === column).map(file => <article className={styles.file} key={file.id}>
          <div className={styles.fileHeading}><h2>{file.title}</h2><span className={`${styles.tag} ${styles[file.tone]}`}>{file.service}</span></div>
          <p>{file.format}</p><time dateTime={file.date.includes('13') ? '2026-09-13' : '2026-09-21'}>{file.date} · Dipak Maharjan</time>
          <div className={styles.actions}><a className={styles.fileAction} href={`/documents/${file.id}.txt`} download={file.action === 'Download' ? `${file.id}.txt` : undefined} target={file.action === 'Open' ? '_blank' : undefined} rel={file.action === 'Open' ? 'noopener noreferrer' : undefined} aria-label={`${file.action} ${file.title}`}>{file.action}</a></div>
        </article>)}
      </div>)}
    </section>}
    {(isReports ? visibleReports.length === 0 : visibleFiles.length === 0) && <p className={styles.empty} role="status">No {isReports ? 'reports' : 'files'} available for these filters.</p>}
  </WorkspacePage>;
}

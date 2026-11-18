'use client';

import { useState, type KeyboardEvent } from 'react';
import { Sidebar } from './sidebar-spec';
import { Topbar } from './topbar-spec';
import { ServiceTasks } from './service-tasks';
import { ServiceApprovals, pendingApprovalCount } from './service-approvals';
import { ServicePerformance } from './service-performance';
import { ServiceMetrics } from './service-metrics';
import { monthlySocialPerformance } from '../lib/social-performance';
import { ServiceReports, serviceReportCount } from './service-reports';
import styles from './service-overview.module.css';

const tabs = ['Overview', 'Tasks', `Approvals (${pendingApprovalCount})`, 'Performance', 'Reports', 'Files', 'Chat'];
const panelIds = ['service-overview-panel', 'service-tasks-panel', 'service-approvals-panel', 'service-performance-panel', 'service-reports-panel'];
const serviceHeading = {
  title: 'Social Media Marketing',
  description: 'Content strategy, creative production, content calendar, and social media campaigns.',
};
const tabHeadings = [
  serviceHeading,
  serviceHeading,
  { title: 'Approvals', description: `${pendingApprovalCount} awaiting your review` },
  { title: 'Performance', description: 'Your monthly performance' },
  { title: 'Reports', description: `${serviceReportCount} service report${serviceReportCount === 1 ? '' : 's'} available` },
];

const tasks = [
  { title: 'Content Strategy', status: 'Client reviewing', tone: 'pink' },
  { title: 'September Content', status: 'Approved', tone: 'green' },
  { title: 'Reel Production', status: 'In progress', tone: 'blue' },
  { title: 'Static Posts', status: 'In progress', tone: 'blue' },
  { title: 'Meta Ads Campaign', status: 'Scheduled', tone: 'blue' },
  { title: 'Monthly Report', status: 'Pending', tone: 'red' },
];

export function ServiceOverview() {
  const [activeTab, setActiveTab] = useState(0);

  function handleTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const lastTab = panelIds.length - 1;
    const nextTab = event.key === 'Home' ? 0 : event.key === 'End' ? lastTab : (activeTab + (event.key === 'ArrowRight' ? 1 : lastTab)) % panelIds.length;
    setActiveTab(nextTab);
    event.currentTarget.querySelector<HTMLButtonElement>(`#service-tab-${nextTab}`)?.focus();
  }

  return <div className={`app-shell ${styles.shell}`}>
    <Sidebar fullHeight />
    <div className="page"><div className="page-inner">
      <Topbar />
      <main className={styles.main}>
        <header className={styles.intro}>
          <h1>{tabHeadings[activeTab].title}</h1>
          <p>{tabHeadings[activeTab].description}</p>
        </header>

        <div className={styles.tabs} role="tablist" aria-label="Social Media Marketing views" onKeyDown={handleTabKeyDown}>
          {tabs.map((tab, index) => <button key={tab} type="button" role="tab" id={`service-tab-${index}`} aria-selected={index === activeTab} aria-controls={panelIds[index]} disabled={index >= panelIds.length} tabIndex={index === activeTab ? 0 : -1} className={index === activeTab ? styles.activeTab : styles.tab} onClick={() => setActiveTab(index)}>{tab}</button>)}
        </div>

        <section className={styles.panel} role="tabpanel" id="service-overview-panel" aria-labelledby="service-tab-0" tabIndex={0} hidden={activeTab !== 0}>
          <header className={styles.panelHeading}>
            <h2>What’s Happening</h2>
            <p>Current work across all deliverables</p>
          </header>

          <div className={styles.progressMeta}><span>Social Media Marketing</span><span>33%</span></div>
          <div className={styles.progressTrack} role="progressbar" aria-label="Social Media Marketing progress" aria-valuenow={33} aria-valuemin={0} aria-valuemax={100}><span /></div>

          <div className={styles.workColumns}>
            <ul className={styles.taskList} aria-label="Current deliverables">{tasks.map(task => <li key={task.title} className={styles.task}>
              <span>{task.title}</span><span className={`${styles.badge} ${styles[task.tone]}`}>{task.status}</span>
            </li>)}</ul>
            <section className={styles.modules} aria-labelledby="service-modules-title">
              <h3 id="service-modules-title">Service Modules</h3>
              <ul>{['Content Calendar', 'Creative Approvals', 'Campaign Performance'].map(module => <li key={module}>{module}</li>)}</ul>
            </section>
          </div>

          <ServiceMetrics metrics={monthlySocialPerformance[0].metrics} />
        </section>
        <div role="tabpanel" id="service-tasks-panel" aria-labelledby="service-tab-1" tabIndex={0} hidden={activeTab !== 1}>
          <ServiceTasks />
        </div>
        <div role="tabpanel" id="service-approvals-panel" aria-labelledby="service-tab-2" tabIndex={0} hidden={activeTab !== 2}>
          <ServiceApprovals />
        </div>
        <div role="tabpanel" id="service-performance-panel" aria-labelledby="service-tab-3" tabIndex={0} hidden={activeTab !== 3}>
          <ServicePerformance />
        </div>
        <div role="tabpanel" id="service-reports-panel" aria-labelledby="service-tab-4" tabIndex={0} hidden={activeTab !== 4}>
          <ServiceReports />
        </div>
      </main>
    </div></div>
  </div>;
}

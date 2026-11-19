'use client';

import { useState, type KeyboardEvent } from 'react';
import { performanceFilters, reportsForFilter, type PerformanceFilter, type PerformanceReport } from '../lib/performance';
import { Sidebar } from './sidebar-spec';
import { Topbar } from './topbar-spec';
import styles from './performance-view.module.css';

function PerformanceCard({ report }: { report: PerformanceReport }) {
  return <article className={`${styles.card} ${styles[report.tone]}`} aria-labelledby={`report-${report.id}`}>
    <header className={styles.cardHeading}>
      <h2 id={`report-${report.id}`}>{report.title}</h2>
      <p>Performance metrics</p>
      <time dateTime="2026-09">September 2026</time>
    </header>
    <div className={styles.metrics}>
      {report.metrics.map((metric, index) => <div className={styles.metric} key={`${metric.label}-${index}`} aria-label={metric.context ? `${metric.context}: ${metric.label}` : metric.label}>
        <h3>{metric.label}</h3>
        <p className={styles.value}>{metric.value}</p>
        <p className={styles.change}><span className={metric.trend === 'up' ? styles.positive : styles.negative}>{metric.trend === 'up' ? '↑' : '↓'} {metric.change}</span> vs prev</p>
      </div>)}
    </div>
  </article>;
}

export function PerformanceView() {
  const [filter, setFilter] = useState<PerformanceFilter>('all');
  const visible = reportsForFilter(filter);
  const activeFilter = performanceFilters.find(item => item.id === filter)!;

  function handleTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = performanceFilters.findIndex(item => item.id === filter);
    const count = performanceFilters.length;
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + count) % count;
    const next = performanceFilters[nextIndex];
    setFilter(next.id);
    event.currentTarget.querySelector<HTMLButtonElement>(`#performance-tab-${next.id}`)?.focus();
  }

  return <div className={`app-shell ${styles.shell}`}>
    <Sidebar fullHeight />
    <div className="page"><div className="page-inner">
      <Topbar />
      <main className={styles.main}>
        <header className={styles.intro}>
          <h1>Performance</h1>
          <p>Track results across all your marketing services</p>
        </header>
        <div className={styles.filters} role="tablist" aria-label="Performance by service" onKeyDown={handleTabKeyDown}>
          {performanceFilters.map(item => <button type="button" role="tab" id={`performance-tab-${item.id}`} key={item.id} className={`${styles.filter} ${styles[item.tone]}`} aria-selected={filter === item.id} aria-controls="performance-results" tabIndex={filter === item.id ? 0 : -1} onClick={() => setFilter(item.id)}>{item.label}</button>)}
        </div>
        <section id="performance-results" role="tabpanel" aria-labelledby={`performance-tab-${filter}`} tabIndex={0} className={styles.results}>
          {visible.length > 0 ? <div className={styles.grid}>
            {[0, 1].map(column => <div className={styles.column} key={column}>
              {visible.filter((_, index) => index % 2 === column).map(report => <PerformanceCard key={report.id} report={report} />)}
            </div>)}
          </div> : <article className={`${styles.card} ${styles.empty} ${styles[activeFilter.tone]}`}>
            <h2>{activeFilter.label}</h2>
            <p>No performance report yet.</p>
            <p>Metrics will appear here when a report is available.</p>
          </article>}
        </section>
      </main>
    </div></div>
  </div>;
}

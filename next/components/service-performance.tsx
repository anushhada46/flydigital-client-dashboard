'use client';

import { useState, type KeyboardEvent } from 'react';
import { monthlySocialPerformance } from '../lib/social-performance';
import { ServiceMetrics } from './service-metrics';
import styles from './service-performance.module.css';

export function ServicePerformance() {
  const [activePeriod, setActivePeriod] = useState(0);

  function handlePeriodKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const lastPeriod = monthlySocialPerformance.length - 1;
    const nextPeriod = event.key === 'Home' ? 0 : event.key === 'End' ? lastPeriod : (activePeriod + (event.key === 'ArrowRight' ? 1 : lastPeriod)) % monthlySocialPerformance.length;
    setActivePeriod(nextPeriod);
    event.currentTarget.querySelector<HTMLButtonElement>(`#period-${monthlySocialPerformance[nextPeriod].id}`)?.focus();
  }

  return <>
    <div className={styles.periods} role="tablist" aria-label="Performance month" onKeyDown={handlePeriodKeyDown}>
      {monthlySocialPerformance.map((period, index) => <button className={styles.period} type="button" role="tab" id={`period-${period.id}`} key={period.id} aria-selected={activePeriod === index} aria-controls={`performance-${period.id}`} tabIndex={activePeriod === index ? 0 : -1} onClick={() => setActivePeriod(index)}>{period.label}</button>)}
    </div>
    {monthlySocialPerformance.map((period, index) => <section className={styles.panel} role="tabpanel" id={`performance-${period.id}`} key={period.id} aria-labelledby={`period-${period.id}`} hidden={activePeriod !== index} tabIndex={0}>
      <ServiceMetrics metrics={period.metrics} />
    </section>)}
  </>;
}

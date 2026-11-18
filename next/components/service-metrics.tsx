import type { SocialMetric } from '../lib/social-performance';
import styles from './service-metrics.module.css';

export function ServiceMetrics({ metrics }: { metrics: SocialMetric[] }) {
  return <div className={styles.grid} aria-label="Social media performance snapshots">
    {metrics.map(metric => <article className={styles.card} key={`${metric.platform}-${metric.label}`} aria-label={`${metric.platform} ${metric.label}`}>
      <h3>{metric.label}<span className={styles.srOnly}> — {metric.platform}</span></h3>
      <p className={styles.value}>{metric.value}</p>
      <p className={styles.change}><span className={metric.trend === 'up' ? styles.positive : styles.negative}>{metric.trend === 'up' ? '↑' : '↓'} {metric.change}</span> vs prev</p>
    </article>)}
  </div>;
}

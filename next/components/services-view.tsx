import Link from 'next/link';
import { Sidebar } from './sidebar-spec';
import { Topbar } from './topbar-spec';
import styles from './services-view.module.css';

const services = [
  {
    id: 'social-media-marketing', title: 'Social Media Marketing', color: 'blue',
    description: 'Content strategy, creative production, content calendar, and social media campaigns.',
  },
  {
    id: 'seo', title: 'SEO', color: 'green',
    description: 'Technical SEO, keyword optimization, content publishing, and link building.',
  },
  {
    id: 'ppc-google-ads', title: 'PPC / Google Ads', color: 'green',
    description: 'Google Ads campaign, budget management, and conversion optimization.',
  },
  {
    id: 'influencer-marketing', title: 'Influencer Marketing', color: 'pink',
    description: 'Creator research, outreach, content collection, and campaign reporting.',
  },
];

function ServiceCard({ service }: { service: typeof services[number] }) {
  return <article className={`${styles.card} ${styles[service.color]}`} id={service.id}>
    <div className={styles.cardTop}>
      <h2>{service.title}</h2>
      {service.id === 'social-media-marketing' ? <Link className={styles.detailsButton} href="/services/social-media-marketing">View Details<span className={styles.srOnly}> for {service.title}</span></Link> : <button className={styles.detailsButton} type="button" disabled>
        View Details
        <span className={styles.srOnly}> for {service.title}</span>
      </button>}
    </div>
    <p className={styles.description}>{service.description}</p>
    <p className={styles.status}>Active <span aria-hidden="true">|</span> Since <time dateTime="2026-06-01">June 1, 2026</time></p>
  </article>;
}

export function ServicesView() {
  return <div className={`app-shell ${styles.shell}`}>
    <Sidebar fullHeight />
    <div className="page"><div className="page-inner">
      <Topbar />
      <main className={styles.main}>
        <header className={styles.intro}>
          <h1>My Services</h1>
          <p>All active marketing services for ABC Restaurant</p>
        </header>
        <div className={styles.grid}>
          <div className={styles.column}>{[services[0], services[2]].map(service => <ServiceCard service={service} key={service.id} />)}</div>
          <div className={styles.column}>{[services[1], services[3]].map(service => <ServiceCard service={service} key={service.id} />)}</div>
        </div>
      </main>
    </div></div>
  </div>;
}

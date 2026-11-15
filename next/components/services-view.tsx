'use client';

import Link from 'next/link';
import { theme } from '../lib/theme';

const serviceCards = [
  { title: 'Social Media Marketing', tone: 'service-blue', description: 'Content strategy, creative production, content calendar, and social media campaigns.' },
  { title: 'SEO', tone: 'service-green', description: 'Technical SEO, keyword optimization, content publishing, and link building.' },
  { title: 'PPC / Google Ads', tone: 'service-green', description: 'Google Ads Campaign, budget management, and conversion optimization.' },
  { title: 'Influencer Marketing', tone: 'service-pink', description: 'Creator research, outreach, content collection, and campaign reporting.' },
];

function Icon({ children }: { children: React.ReactNode }) { return <span className="ui-icon" aria-hidden="true">{children}</span>; }

function ServicesSidebar() {
  const items = [['✓', 'Approvals'], ['↗', 'Performance'], ['▤', 'Reports'], ['▣', 'Files'], ['✉', 'Messages'], ['＋', 'Requests'], ['▱', 'Billing'], ['⚙', 'Account']];
  return <aside className="sidebar"><div className="brand"><div className="brand-mark">F</div><div><strong>flydigital</strong><small>CLIENT PORTAL</small></div></div><div className="client-switcher"><div className="client-avatar">AR</div><div><span>CLIENT ACCOUNT</span><b>ABC Restaurant</b><small>Rahul Sharma</small></div><span className="switcher-chevron">⌄</span></div><nav className="main-nav"><Link href="/" className="nav-link"><Icon>⌂</Icon>Dashboard</Link><div className="services-nav-group"><Link href="/services" className="nav-link active"><Icon>✦</Icon>My Services <span className="nav-chevron">⌃</span></Link><div className="subnav"><Link href="#social-media-marketing" className="subnav-active">Social Media Marketing</Link><Link href="#seo">SEO</Link><Link href="#ppc-google-ads">PPC / Google Ads</Link><Link href="#influencer-marketing">Influencer Marketing</Link></div></div>{items.map(([icon, label]) => <Link href={`/#${label.toLowerCase()}`} className="nav-link" key={label}><Icon>{icon}</Icon>{label}{label === 'Messages' && <span className="nav-badge">4</span>}</Link>)}</nav><div className="sidebar-profile"><div className="profile-avatar">RS</div><div><b>Rahul Sharma</b><small>rahul@abc.com</small></div><span className="profile-more">•••</span></div></aside>;
}

function ServicesTopbar() { return <header className="topbar"><div className="crumb"><span>CLIENT PORTAL</span><b>/ My Services</b></div><div className="top-actions"><label className="search"><span>⌕</span><input aria-label="Search" placeholder="Search reports, files, invoices..." /></label><button className="notification" aria-label="Notifications">♧<span>6</span></button><div className="top-avatar">RS</div></div></header>; }

function ServiceCard({ title, description, tone, id }: { title: string; description: string; tone: string; id: string }) { return <article className={`service-detail-card ${tone}`} id={id}><div><span className="service-index">SERVICE 0{serviceCards.findIndex(card => card.title === title) + 1}</span><h2>{title}</h2><p>{description}</p></div><div className="service-card-footer"><span>ACTIVE <i>•</i> SINCE JUNE 1, 2026</span><button>View Details <b>↗</b></button></div></article>; }

export function ServicesView() { return <div className="app-shell services-page" style={{ '--theme-ink': theme.colors.ink } as React.CSSProperties}><ServicesSidebar /><div className="page"><div className="page-inner"><ServicesTopbar /><main className="services-main"><div className="services-intro"><span className="section-label">YOUR MARKETING PARTNERSHIP <b>✦</b></span><h1>My Services</h1><p>All active marketing services for ABC Restaurant</p></div><div className="services-card-grid">{serviceCards.map((card, index) => <ServiceCard {...card} id={['social-media-marketing', 'seo', 'ppc-google-ads', 'influencer-marketing'][index]} key={card.title} />)}</div></main><footer>FlyDigital Client Portal <span>•</span> ABC Restaurant <span>•</span> September 2026</footer></div></div></div>; }

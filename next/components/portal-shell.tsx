'use client';

import Link from 'next/link';
import { useState } from 'react';
import { theme } from '../lib/theme';
import { Sidebar } from './sidebar-spec';
import { Topbar } from './topbar-spec';
import styles from './portal-shell.module.css';

type Props = { mode: 'workspace' | 'admin' };
const services = [['Social Media Marketing', 60, '12 posts scheduled'], ['Branding & Visual Identity', 10, 'Brand guide in progress'], ['SEO', 42, '8 keywords ranking'], ['PPC / Google Ads', 78, 'Campaign live']] as const;
const serviceBarColors = ['#009cde', '#f04e98', '#ee2737', '#ffd100'];

function Icon({ children }: { children: React.ReactNode }) { return <span className="ui-icon" aria-hidden="true">{children}</span>; }
function Card({ title, subtitle, eyebrow, tone, children, action }: { title: string; subtitle?: string; eyebrow?: string; tone: string; children: React.ReactNode; action?: string }) { return <section className={`dash-card ${tone}`}><div className="card-heading"><div>{eyebrow && <span className="card-eyebrow">{eyebrow}</span>}<h2>{title}</h2>{subtitle && <p className="card-subtitle">{subtitle}</p>}</div>{action && <button className="card-action">{action} <span>↗</span></button>}</div>{children}</section>; }

function LegacySidebar() {
  const [servicesOpen, setServicesOpen] = useState(true);
  const items = [['✓', 'Approvals'], ['↗', 'Performance'], ['▤', 'Reports'], ['▣', 'Files'], ['✉', 'Messages'], ['＋', 'Requests'], ['▱', 'Billing'], ['⚙', 'Account']];
  return <aside className="sidebar"><div className="brand"><div className="brand-mark">F</div><div><strong>flydigital</strong><small>CLIENT PORTAL</small></div></div><div className="client-switcher"><div className="client-avatar">AR</div><div><span>CLIENT ACCOUNT</span><b>ABC Restaurant</b><small>Rahul Sharma</small></div><span className="switcher-chevron">⌄</span></div><nav className="main-nav"><Link href="/" className="nav-link active"><Icon>⌂</Icon>Dashboard</Link><button className="nav-link services-toggle" onClick={() => setServicesOpen(!servicesOpen)}><Icon>✦</Icon>My Services <span className="nav-chevron">{servicesOpen ? '⌃' : '⌄'}</span></button>{servicesOpen && <div className="subnav">{['Social Media Marketing', 'SEO', 'PPC / Google Ads', 'Influencer Marketing'].map(item => <Link href="#services" key={item}>{item}</Link>)}</div>}{items.map(([icon, label]) => <Link href={`#${label.toLowerCase()}`} className="nav-link" key={label}><Icon>{icon}</Icon>{label}{label === 'Messages' && <span className="nav-badge">4</span>}</Link>)}</nav><div className="sidebar-profile"><div className="profile-avatar">RS</div><div><b>Rahul Sharma</b><small>rahul@abc.com</small></div><span className="profile-more">•••</span></div></aside>;
}

function LegacyTopbar() { return <header className="topbar"><div className="crumb"><span>CLIENT PORTAL</span><b>/ Dashboard</b></div><div className="top-actions"><label className="search"><span>⌕</span><input aria-label="Search" placeholder="Search reports, files, invoices..." /></label><button className="notification" aria-label="Notifications">♧<span>6</span></button><div className="top-avatar">RS</div></div></header>; }
function Welcome() { const currentMonthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date()); return <div className="welcome"><div><h1>Welcome back, <em>Rahul</em></h1><p>ABC Restaurant <i>|</i> {currentMonthYear}</p></div><div className="welcome-stamp">FD<br /><small>FLY DIGITAL<br />CLIENT PORTAL</small></div></div>; }
function Attention() { return <section className="attention"><div><h2><img className="attention-alert" src="/images/exclamation.svg" alt="" />These are the items that need your attention</h2></div><div className="attention-pills"><button type="button"><b>3</b> approvals pending</button><button type="button"><b>2</b> invoices overdue</button><button type="button"><b>1</b> task need your input</button></div></section>; }
function Services() { return <section className="dash-card blue services-dashboard-card"><div className="card-heading services-heading"><div className="services-title"><h2>Active Services</h2><span>4 services subscribed</span></div><button className="services-view-all" type="button">View all</button></div><div className="service-list" id="services">{services.map(([name, progress], index) => <div className="service-progress" key={name}><div className="progress-meta"><b>{name}</b><span>{progress}%</span></div><div className="progress-track"><i style={{ width: `${progress}%`, backgroundColor: serviceBarColors[index % serviceBarColors.length] }} /></div></div>)}</div></section>; }
function Approvals() { return <Card title="Pending Approvals" eyebrow="3 ITEMS WAITING" tone="green" action="View all"><div className="approval-list">{[['Static Post', 'Social Media Marketing', 'Due today'], ['Creator Content', 'Influencer Marketing', 'Due Sep 18'], ['Google Ads Creative', 'PPC / Google Ads', 'Due Sep 20']].map(([title, service, due]) => <div className="approval-item" key={title}><span className="approval-mark">!</span><div><b>{title}</b><small>{service} <i>•</i> {due}</small></div><button className="view-button">Review ↗</button></div>)}</div></Card>; }
function Activity() {
  const today = new Date();
  const activities = [
    { title: 'Invoice #FD-0924 paid', note: 'Payment received for the August retainer.', task: 'Billing', color: theme.colors.yellow, daysAgo: 0 },
    { title: 'New submission: September content plan', note: 'Content plan submitted for your review.', task: 'Submission', color: theme.colors.green, daysAgo: 1 },
    { title: 'Rahul commented on Static Post', note: 'Feedback added to the post creative.', task: 'Feedback', color: theme.colors.pink, daysAgo: 2 },
    { title: 'Monthly report is ready to view', note: 'Performance report uploaded for review.', task: 'Report', color: theme.colors.red, daysAgo: 4 },
  ];

  return <Card title="Recent Activity" eyebrow="LAST 7 DAYS" tone="blue">
    <div className="activity-list">{activities.map(({ title, note, task, color, daysAgo }) => {
      // Demo activity dates, relative to today until activity is backed by the API.
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      const dateLabel = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);

      return <div className="activity-item" key={title}>
        <time className="activity-tag activity-date-tag" dateTime={date.toISOString()}>{dateLabel}</time>
        <div className="activity-entry">
          <div className="activity-copy"><b>{title}</b><small>{note}</small></div>
          <span className="activity-tag activity-task-tag" style={{ backgroundColor: color }}>{task}</span>
        </div>
      </div>;
    })}</div>
  </Card>;
}
function Billing() { return <Card title="Billing" eyebrow="INVOICES & PAYMENTS" tone="blue" action="View billing"><div className="invoice-list">{[['FD-0925', 'September 2026', 'NPR 85,000', 'Overdue'], ['FD-0926', 'September 2026', 'NPR 42,500', 'Pending'], ['FD-0924', 'August 2026', 'NPR 85,000', 'Paid']].map(([id, month, amount, status]) => <div className="invoice" key={id}><div className="invoice-details"><b>{id}</b><small>{month}</small></div><div className="invoice-payment"><strong>{amount}</strong><small>{status}</small></div></div>)}</div></Card>; }
function Deliverables() {
  const deliverables = [
    { date: '2026-11-20', title: 'Ad Creative Refresh', description: 'Updated ad creatives ready for your review.', tag: 'Client reviewing', color: theme.colors.yellow },
    { date: '2026-11-23', title: 'Meta Ads Campaign', description: 'Social media campaign scheduled to launch.', tag: 'Scheduled', color: theme.colors.green },
    { date: '2026-11-30', title: 'Monthly SEO Report', description: 'Keyword rankings and search performance summary.', tag: 'In progress', color: theme.colors.blue },
  ];

  return <Card title="Upcoming" subtitle="Deliverables and milestones" eyebrow="COMING UP NEXT" tone="pink">
    <div className="activity-list">{deliverables.map(({ date, title, description, tag, color }) => <div className="activity-item" key={title}>
      <time className="activity-tag activity-date-tag" dateTime={date}>{new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`))}</time>
      <div className="activity-entry">
        <div className="activity-copy"><b>{title}</b><small>{description}</small></div>
        <span className="activity-tag activity-task-tag" style={{ backgroundColor: color }}>{tag}</span>
      </div>
    </div>)}</div>
  </Card>;
}
function Reports() { return <Card title="Recent Reports" eyebrow="LATEST DOWNLOADS" tone="pink"><div className="report-list">{[['SMM Performance Report', 'August 2026'], ['PPC Performance Report', 'August 2026'], ['SEO Performance Report', 'August 2026']].map(([title, month]) => <div className="report" key={title}><div><b>{title}</b><small>{month}</small></div></div>)}</div></Card>; }
function Messages() {
  const messages = [
    { name: 'Anisha Karki', subject: 'General Account', text: 'The September content calendar is ready for your review.', time: '2m', color: theme.colors.yellow },
    { name: 'Sujan Maharjan', subject: 'MetaAds', text: 'Could you review the new ad variations?', time: '1h', color: theme.colors.green },
    { name: 'Priya Shrestha', subject: 'Performance Reports', text: 'Your monthly performance report is live.', time: '3h', color: theme.colors.pink },
  ];

  return <Card title="Latest Messages" eyebrow="FROM YOUR TEAM" tone="red" action="View all"><div className="message-list">{messages.map(({ name, subject, text, time, color }) => {
    const nameParts = name.trim().split(/\s+/);
    const initials = `${nameParts[0][0]}${nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : ''}`.toUpperCase();
    return <div className="message" key={name}><span className="message-avatar" style={{ backgroundColor: color }} aria-label={name}>{initials}</span><div><b>{subject}<small>{time}</small></b><p title={`${name}: ${text}`}>{name}: {text}</p></div></div>;
  })}</div></Card>;
}
function Team() { return <Card title="Your Fly Team" eyebrow="PEOPLE BEHIND THE WORK" tone="yellow"><div className="team-list">{[['Anisha Karki', 'Account Manager', theme.colors.blue], ['Prakash Shrestha', 'Creative Lead', theme.colors.green], ['Sujan Maharjan', 'SEO Specialist', theme.colors.pink]].map(([name, role, color]) => {
  const nameParts = name.trim().split(/\s+/);
  const initials = `${nameParts[0][0]}${nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : ''}`.toUpperCase();
  return <div className="team-member" key={name}><span className="team-avatar" style={{ backgroundColor: color }} aria-label={name}>{initials}</span><div><b>{name}</b><small>{role}</small></div></div>;
})}</div></Card>; }

export function PortalShell({ mode }: Props) { return <div className={`app-shell ${styles.root}`} style={{ '--theme-ink': theme.colors.ink } as React.CSSProperties}><Sidebar /><div className="page"><div className="page-inner"><Topbar /><main><Welcome /><Attention /><div className="dashboard-grid"><div className="main-column"><Services /><Activity /><Deliverables /></div><div className="side-column"><Approvals /><Billing /><Reports /><Messages /><Team /></div></div></main><footer>FlyDigital Client Portal <span>•</span> ABC Restaurant <span>•</span> September 2026</footer></div></div></div>; }

import Link from 'next/link';

const menuItems = ['Dashboard', 'My Services', 'Approvals', 'Performance', 'Reports', 'Files', 'Message', 'Requests', 'Billing', 'Account'];
const activeServices = ['Social Media Marketing', 'SEO', 'PPC / Google Ads', 'Influencer Marketing'];

export function Sidebar() {
  return <aside className="sidebar">
    <div className="brand"><img src="/images/dashboard-logo.svg" alt="" /><div><strong>FlyDigital</strong><small>Client Portal</small></div></div>
    <div className="client-switcher"><div className="client-avatar">AR</div><div><b>ABC Restaurant</b><small>Rahul Sharma</small></div></div>
    <nav className="main-nav">{menuItems.map(label => <Link href={label === 'Dashboard' ? '/' : `#${label.toLowerCase().replaceAll(' ', '-')}`} className={`nav-link ${label === 'Dashboard' ? 'active' : ''}`} key={label}>{label}</Link>)}</nav>
    <div className="active-services"><h2>Active Services</h2>{activeServices.map(item => <Link href="#services" key={item}>{item}</Link>)}</div>
    <div className="sidebar-profile"><div className="profile-avatar">RS</div><div><b>Rahul Sharma</b><small>rahul@abc.com</small></div></div>
  </aside>;
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './sidebar-spec.module.css';

const menuItems = ['Dashboard', 'My Services', 'Approvals', 'Performance', 'Reports', 'Files', 'Messages', 'Requests', 'Billing', 'Account'];
const activeServices = ['Social Media Marketing', 'SEO', 'PPC / Google Ads', 'Influencer Marketing'];
const serviceIds = ['social-media-marketing', 'seo', 'ppc-google-ads', 'influencer-marketing'];

function menuHref(label: string) {
  if (label === 'Dashboard') return '/';
  if (label === 'My Services') return '/services';
  if (label === 'Approvals') return '/approvals';
  if (label === 'Performance') return '/performance';
  if (label === 'Reports') return '/reports';
  if (label === 'Files') return '/files';
  if (label === 'Messages') return '/messages';
  if (label === 'Requests') return '/requests';
  if (label === 'Billing') return '/billing';
  if (label === 'Account') return '/account';
  return `/#${label.toLowerCase().replaceAll(' ', '-')}`;
}

function serviceHref(index: number) {
  return index === 0 ? '/services/social-media-marketing' : `/services#${serviceIds[index]}`;
}

function defaultSelection(pathname: string) {
  if (pathname === '/approvals') return 'menu:Approvals';
  if (pathname === '/performance') return 'menu:Performance';
  if (pathname === '/reports') return 'menu:Reports';
  if (pathname === '/files') return 'menu:Files';
  if (pathname === '/messages') return 'menu:Messages';
  if (pathname === '/requests') return 'menu:Requests';
  if (pathname === '/billing') return 'menu:Billing';
  if (pathname === '/account') return 'menu:Account';
  if (pathname === '/services/social-media-marketing') return 'service:Social Media Marketing';
  return pathname === '/services' ? 'menu:My Services' : 'menu:Dashboard';
}

export function Sidebar({ fullHeight = false }: { fullHeight?: boolean }) {
  const pathname = usePathname();
  const [selectedItem, setSelectedItem] = useState(defaultSelection(pathname));

  useEffect(() => {
    const syncSelection = () => {
      if (['/approvals', '/performance', '/reports', '/files', '/messages', '/requests', '/billing', '/account'].includes(pathname)) {
        setSelectedItem(defaultSelection(pathname));
        return;
      }
      const hash = window.location.hash.slice(1);
      if (pathname === '/services/social-media-marketing') {
        setSelectedItem(defaultSelection(pathname));
        return;
      }
      const serviceIndex = serviceIds.indexOf(hash);
      if (pathname === '/services' && serviceIndex !== -1) {
        setSelectedItem(`service:${activeServices[serviceIndex]}`);
        return;
      }
      const menuItem = menuItems.find(label => menuHref(label) === `/${window.location.hash}`);
      setSelectedItem(pathname === '/services' ? 'menu:My Services' : `menu:${menuItem ?? 'Dashboard'}`);
    };
    syncSelection();
    window.addEventListener('hashchange', syncSelection);
    window.addEventListener('popstate', syncSelection);
    return () => {
      window.removeEventListener('hashchange', syncSelection);
      window.removeEventListener('popstate', syncSelection);
    };
  }, [pathname]);

  return <aside className={`sidebar ${styles.root}${fullHeight ? ` ${styles.fullHeight}` : ''}`}>
    <div className="brand"><img src="/images/dashboard-logo.svg" alt="" /><div><strong>FlyDigital</strong><small>Client Portal</small></div></div>
    <div className="client-switcher"><div className="client-avatar">AR</div><div><b>ABC Restaurant</b><small>Rahul Sharma</small></div></div>
    <nav className="main-nav">{menuItems.map(label => {
      const itemId = `menu:${label}`;
      const selected = selectedItem === itemId;
      return <Link href={menuHref(label)} className={`nav-link${selected ? ' active' : ''}`} aria-current={selected ? 'page' : undefined} onClick={() => setSelectedItem(itemId)} key={label}>{label}</Link>;
    })}</nav>
    <div className="active-services"><h2>Active Services</h2>{activeServices.map((item, index) => {
      const itemId = `service:${item}`;
      const selected = selectedItem === itemId;
      return <Link href={serviceHref(index)} className={selected ? 'active' : undefined} aria-current={selected ? 'location' : undefined} onClick={() => setSelectedItem(itemId)} key={item}>{item}</Link>;
    })}</div>
    <Link href="/account" className="sidebar-profile" aria-label="Rahul Sharma account" onClick={() => setSelectedItem('menu:Account')}><div className="profile-avatar">RS</div><div><b>Rahul Sharma</b><small>rahul@abc.com</small></div></Link>
  </aside>;
}

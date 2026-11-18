import styles from './topbar-spec.module.css';

export function Topbar() {
  return <header className={`topbar ${styles.root}`}><div className="top-actions"><label className="search"><span aria-hidden="true">⌕</span><input aria-label="Search" placeholder="Search reports, files, invoices..." /></label><button className="notification" aria-label="Notifications"><img src="/images/notification.png" alt="" /><span>6</span></button></div></header>;
}

import type { ReactNode } from 'react';
import { Sidebar } from './sidebar-spec';
import { Topbar } from './topbar-spec';
import styles from './workspace-page.module.css';

export function WorkspacePage({ title, subtitle, action, children }: { title: string; subtitle: string; action?: ReactNode; children: ReactNode }) {
  return <div className={`app-shell ${styles.shell}`}>
    <Sidebar fullHeight />
    <div className="page"><div className="page-inner">
      <Topbar />
      <main className={styles.main}>
        <header className={styles.intro}><div><h1>{title}</h1><p>{subtitle}</p></div>{action}</header>
        {children}
      </main>
    </div></div>
  </div>;
}

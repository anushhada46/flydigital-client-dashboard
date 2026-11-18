import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FlyDigital Client Portal Dashboard',
  description: 'ABC Restaurant client dashboard for FlyDigital.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

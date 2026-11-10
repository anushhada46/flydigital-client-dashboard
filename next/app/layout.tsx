import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Fly Digital — Client workspace', description: 'A calm command centre for your Fly Digital work.' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

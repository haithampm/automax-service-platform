import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export const metadata: Metadata = {
  title: 'AutoMax - Service Management Platform',
  description: 'Enterprise service management for Incidents, Requests, Complaints, Workflows and Admin',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#0d1117] text-white min-h-screen">
        <Providers>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}

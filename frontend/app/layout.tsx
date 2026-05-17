import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export const metadata: Metadata = {
  title: {
    default: 'Synergi IMS',
    template: '%s | Synergi IMS',
  },
  description: 'Synergi IMS - Integrated Incident Management System for enterprise service operations. Manage incidents, requests, complaints, workflows and administration.',
  keywords: ['incident management', 'service management', 'IMS', 'ITSM', 'helpdesk'],
  authors: [{ name: 'Synergi IMS Team' }],
  creator: 'Synergi IMS',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Synergi IMS',
    description: 'Integrated Incident Management System',
    type: 'website',
  },
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

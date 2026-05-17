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

const criticalStyles = `
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  html, body { margin: 0; min-height: 100%; background: #0d1117; color: #e6edf3; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  a { color: inherit; text-decoration: none; }
  button, input, select, textarea { font: inherit; }
  button { cursor: pointer; }
  svg { flex-shrink: 0; }
  .flex { display: flex; }
  .inline-flex { display: inline-flex; }
  .grid { display: grid; }
  .hidden { display: none; }
  .relative { position: relative; }
  .absolute { position: absolute; }
  .fixed { position: fixed; }
  .inset-0 { inset: 0; }
  .right-0 { right: 0; }
  .top-10 { top: 2.5rem; }
  .items-center { align-items: center; }
  .items-start { align-items: flex-start; }
  .justify-center { justify-content: center; }
  .justify-between { justify-content: space-between; }
  .flex-col { flex-direction: column; }
  .flex-1 { flex: 1 1 0%; }
  .flex-shrink-0 { flex-shrink: 0; }
  .min-h-screen { min-height: 100vh; }
  .h-screen { height: 100vh; }
  .h-full { height: 100%; }
  .h-14 { height: 3.5rem; }
  .w-16 { width: 4rem; }
  .w-60 { width: 15rem; }
  .w-80 { width: 20rem; }
  .w-full { width: 100%; }
  .max-w-lg { max-width: 32rem; }
  .overflow-hidden { overflow: hidden; }
  .overflow-y-auto { overflow-y: auto; }
  .min-w-0 { min-width: 0; }
  .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .cursor-pointer { cursor: pointer; }
  .rounded-md { border-radius: .375rem; }
  .rounded-lg { border-radius: .5rem; }
  .rounded-xl { border-radius: .75rem; }
  .rounded-full { border-radius: 9999px; }
  .border { border-width: 1px; border-style: solid; }
  .border-r { border-right: 1px solid #21262d; }
  .border-b { border-bottom: 1px solid #21262d; }
  .border-t { border-top: 1px solid #21262d; }
  .border-l { border-left: 1px solid #21262d; }
  .border-0 { border: 0; }
  .divide-y > :not([hidden]) ~ :not([hidden]) { border-top: 1px solid #21262d; }
  .bg-black\/60 { background: rgba(0,0,0,.6); }
  [class*="bg-[#0d1117]"] { background-color: #0d1117; }
  [class*="bg-[#161b22]"] { background-color: #161b22; }
  [class*="bg-[#1c2333]"] { background-color: #1c2333; }
  [class*="bg-[#21262d]"] { background-color: #21262d; }
  [class*="bg-[#6e40c9]"] { background-color: #6e40c9; }
  [class*="bg-[#2188ff]"] { background-color: #2188ff; }
  [class*="border-[#21262d]"] { border-color: #21262d; }
  [class*="border-[#30363d]"] { border-color: #30363d; }
  [class*="border-[#6e40c9]"] { border-color: rgba(110,64,201,.45); }
  [class*="text-white"] { color: #fff; }
  [class*="text-[#e6edf3]"] { color: #e6edf3; }
  [class*="text-[#8b949e]"] { color: #8b949e; }
  [class*="text-[#6e7681]"] { color: #6e7681; }
  [class*="text-[#6e40c9]"] { color: #a78bfa; }
  [class*="text-[#2188ff]"] { color: #58a6ff; }
  [class*="text-red-400"] { color: #f87171; }
  [class*="text-orange-400"] { color: #fb923c; }
  [class*="text-yellow-400"] { color: #facc15; }
  [class*="text-green-400"] { color: #4ade80; }
  [class*="text-blue-400"] { color: #60a5fa; }
  [class*="text-purple-400"] { color: #c084fc; }
  [class*="bg-red-500/"], [class*="bg-red-500\\/"] { background: rgba(239,68,68,.16); }
  [class*="bg-orange-500/"], [class*="bg-orange-500\\/"] { background: rgba(249,115,22,.16); }
  [class*="bg-yellow-500/"], [class*="bg-yellow-500\\/"] { background: rgba(234,179,8,.16); }
  [class*="bg-green-500/"], [class*="bg-green-500\\/"] { background: rgba(34,197,94,.16); }
  [class*="bg-blue-500/"], [class*="bg-blue-500\\/"] { background: rgba(59,130,246,.16); }
  [class*="bg-purple-500/"], [class*="bg-purple-500\\/"] { background: rgba(168,85,247,.16); }
  [class*="from-[#6e40c9]"], [class*="from-purple"], [class*="to-[#4f2d9e]"] { background: linear-gradient(135deg,#6e40c9,#4f2d9e); }
  .p-0 { padding: 0; } .p-3 { padding: .75rem; } .p-4 { padding: 1rem; } .p-5 { padding: 1.25rem; } .p-6 { padding: 1.5rem; }
  .px-2 { padding-left: .5rem; padding-right: .5rem; } .px-3 { padding-left: .75rem; padding-right: .75rem; } .px-4 { padding-left: 1rem; padding-right: 1rem; }
  .py-0\.5 { padding-top: .125rem; padding-bottom: .125rem; } .py-1 { padding-top: .25rem; padding-bottom: .25rem; } .py-1\.5 { padding-top: .375rem; padding-bottom: .375rem; } .py-2 { padding-top: .5rem; padding-bottom: .5rem; } .py-2\.5 { padding-top: .625rem; padding-bottom: .625rem; } .py-3 { padding-top: .75rem; padding-bottom: .75rem; } .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
  .pl-2 { padding-left: .5rem; } .pl-9 { padding-left: 2.25rem; } .pr-4 { padding-right: 1rem; }
  .m-0 { margin: 0; } .mx-auto { margin-left: auto; margin-right: auto; } .ml-auto { margin-left: auto; } .mt-0\.5 { margin-top: .125rem; } .mt-1 { margin-top: .25rem; } .mt-2 { margin-top: .5rem; } .mt-3 { margin-top: .75rem; } .mb-1 { margin-bottom: .25rem; } .mb-2 { margin-bottom: .5rem; } .mb-3 { margin-bottom: .75rem; } .mb-4 { margin-bottom: 1rem; } .mb-6 { margin-bottom: 1.5rem; }
  .gap-0\.5 { gap: .125rem; } .gap-1 { gap: .25rem; } .gap-1\.5 { gap: .375rem; } .gap-2 { gap: .5rem; } .gap-2\.5 { gap: .625rem; } .gap-3 { gap: .75rem; } .gap-4 { gap: 1rem; } .gap-6 { gap: 1.5rem; }
  .space-y-1 > :not([hidden]) ~ :not([hidden]) { margin-top: .25rem; } .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; } .space-y-5 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.25rem; } .space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.5rem; }
  .text-\[9px\] { font-size: 9px; } .text-\[10px\] { font-size: 10px; } .text-xs { font-size: .75rem; line-height: 1rem; } .text-sm { font-size: .875rem; line-height: 1.25rem; } .text-lg { font-size: 1.125rem; line-height: 1.75rem; } .text-xl { font-size: 1.25rem; line-height: 1.75rem; } .text-2xl { font-size: 1.5rem; line-height: 2rem; }
  .font-medium { font-weight: 500; } .font-semibold { font-weight: 600; } .font-bold { font-weight: 700; } .uppercase { text-transform: uppercase; } .tracking-widest { letter-spacing: .1em; } .leading-tight { line-height: 1.25; } .leading-relaxed { line-height: 1.625; } .text-left { text-align: left; } .text-center { text-align: center; }
  .shadow-sm { box-shadow: 0 1px 2px rgba(0,0,0,.22); } .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0,0,0,.65); }
  .transition-colors, .transition-all { transition: all .18s ease; }
  .duration-200 { transition-duration: .2s; } .duration-300 { transition-duration: .3s; }
  .card { background: #1c2333; border: 1px solid #30363d; border-radius: .75rem; padding: 1.25rem; box-shadow: 0 1px 2px rgba(0,0,0,.22); }
  input, select, textarea { background: #0d1117; border: 1px solid #30363d; color: #e6edf3; border-radius: .5rem; }
  input::placeholder, textarea::placeholder { color: #6e7681; }
  input:focus, select:focus, textarea:focus { outline: none; border-color: #6e40c9; box-shadow: 0 0 0 2px rgba(110,64,201,.25); }
  header { backdrop-filter: blur(8px); }
  table { border-collapse: collapse; }
  th, td { border-color: #30363d; }
  @media (min-width: 640px) { .sm\\:block { display: block; } .sm\\:grid-cols-2 { grid-template-columns: repeat(2,minmax(0,1fr)); } }
  @media (min-width: 1024px) { .lg\\:grid-cols-4 { grid-template-columns: repeat(4,minmax(0,1fr)); } }
  @media (min-width: 1280px) { .xl\\:grid-cols-3 { grid-template-columns: repeat(3,minmax(0,1fr)); } .xl\\:col-span-2 { grid-column: span 2 / span 2; } }
  .grid-cols-1 { grid-template-columns: repeat(1,minmax(0,1fr)); } .grid-cols-2 { grid-template-columns: repeat(2,minmax(0,1fr)); } .grid-cols-4 { grid-template-columns: repeat(4,minmax(0,1fr)); }
  .z-50 { z-index: 50; }
  .max-h-72 { max-height: 18rem; }
  .hover\\:bg-[#161b22]:hover { background: #161b22; } .hover\\:bg-[#21262d]:hover { background: #21262d; } .hover\\:text-white:hover { color: #fff; }
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalStyles }} />
      </head>
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

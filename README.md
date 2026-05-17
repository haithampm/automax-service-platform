# Synergi IMS

**Synergi IMS** is an enterprise-grade Integrated Incident Management System built with Next.js 14, TypeScript, and Tailwind CSS. It provides a unified platform to manage incidents, service requests, customer complaints, automated workflows, and user administration — all in a clean, dark-themed UI.

---

## Features

### Core Modules
- **Dashboard** — Live KPI cards, module overview, recent activity feed, and system status
- **Incident Management** — Full lifecycle: create, assign, escalate, resolve with SLA tracking and breach detection
- **Request Management** — Service requests with approval workflows and fulfillment tracking
- **Complaint Management** — Customer complaints with escalation levels and SLA monitoring
- **Workflow Automation** — Auto-routing, escalation, and assignment rule builder
- **Admin Panel** — User management, role-based access control (RBAC), and department management
- **Settings** — SLA rules, notification preferences, and system integrations

### UI/UX
- Collapsible sidebar with Lucide icons and active state highlighting
- Expandable search bar in the header with instant focus animation
- Real-time notifications panel with read/unread state and mark-all-read
- Dynamic breadcrumb navigation
- Responsive layout supporting all screen sizes
- Consistent dark theme with a full CSS design token system

### Technical
- Next.js 14 App Router with TypeScript
- Tailwind CSS with custom design system and CSS variables
- `@tanstack/react-query` for server state management
- `react-hot-toast` for toast notifications
- Recharts for analytics charts
- Lucide React for iconography
- `clsx` + `tailwind-merge` for conditional class merging
- Radix UI primitives (Dialog, Dropdown, Tooltip)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| State | React Query (@tanstack) |
| Icons | Lucide React |
| Charts | Recharts |
| UI Primitives | Radix UI |
| Notifications | react-hot-toast |
| Deployment | Vercel |

---

## Project Structure

```
synergi-IMS/
└── frontend/
    ├── app/
    │   ├── layout.tsx          # Root layout with Sidebar + Header
    │   ├── page.tsx            # Root redirect to /dashboard
    │   ├── globals.css         # Design system + Tailwind utilities
    │   ├── providers.tsx       # React Query provider
    │   ├── dashboard/          # Dashboard page
    │   ├── incidents/          # Incident management
    │   ├── requests/           # Service requests
    │   ├── complaints/         # Complaint management
    │   ├── workflows/          # Workflow automation
    │   ├── settings/           # System settings
    │   ├── admin/
    │   │   ├── users/          # User management
    │   │   └── roles/          # Role & permission management
    │   └── api/                # Next.js API routes
    │       ├── dashboard/
    │       ├── incidents/
    │       └── requests/
    ├── components/
    │   ├── Sidebar.tsx         # Collapsible navigation sidebar
    │   └── Header.tsx          # Top bar with search + notifications
    └── lib/
        └── types.ts            # Shared TypeScript interfaces
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/haithampm/synergi-IMS.git
cd synergi-IMS/frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

### Type Check

```bash
npm run type-check
```

---

## Deployment

The application is deployed on **Vercel**. The root directory for Vercel deployment is `frontend`.

To deploy your own instance:
1. Fork this repository
2. Connect to Vercel and set **Root Directory** to `frontend`
3. Deploy

---

## Design System

Synergi IMS uses a consistent set of CSS design tokens defined in `globals.css`:

| Token | Value | Usage |
|---|---|---|
| `--color-brand` | `#6e40c9` | Primary purple brand color |
| `--color-bg-primary` | `#0d1117` | Main background |
| `--color-bg-secondary` | `#161b22` | Card/input backgrounds |
| `--color-text-primary` | `#e6edf3` | Main text |
| `--color-text-muted` | `#6e7681` | Placeholder / muted text |

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

*Built with Next.js 14 · Tailwind CSS · TypeScript · Vercel*

# AutoMax Service Platform

A full-stack enterprise service management platform built with Next.js 14, featuring dark-themed UI inspired by GitHub's design system.

## Features

- **Dashboard** - Real-time stats, charts, and KPIs for incidents, requests, and complaints
- **Incident Management** - Full lifecycle: create, assign, escalate, resolve with SLA tracking
- **Request Management** - Service requests with approval workflows
- **Complaint Management** - Customer complaints with SLA breach detection
- **Workflows** - Automation rules for routing, escalation, and assignment
- **Admin Panel** - User management, role-based access control (RBAC), permissions
- **Settings** - SLA rules, notification preferences, integrations

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Charts**: Recharts for analytics visualization
- **Icons**: Lucide React
- **API**: Next.js Route Handlers (REST API)
- **Deployment**: Vercel

## Quick Start

```bash
# Clone the repo
git clone https://github.com/haithampm/automax-service-platform.git
cd automax-service-platform/frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
  app/
    dashboard/     - Main dashboard with stats and charts
    incidents/     - Incident management
    requests/      - Service requests
    complaints/    - Customer complaints
    workflows/     - Automation workflows
    admin/
      users/       - User management
      roles/       - Roles and permissions
    settings/      - Platform settings
    api/           - Backend API routes
  components/
    Sidebar.tsx    - Navigation sidebar
    Header.tsx     - Top header with breadcrumb & notifications
  lib/
    types.ts       - TypeScript interfaces
```

## Deploy on Vercel

1. Connect your GitHub repo to Vercel
2. Set the **Root Directory** to `frontend`
3. Framework: **Next.js** (auto-detected)
4. Click **Deploy**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/haithampm/automax-service-platform&root-directory=frontend)

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/dashboard` | GET | Dashboard statistics |
| `/api/incidents` | GET, POST | List/create incidents |
| `/api/requests` | GET, POST | List/create requests |
| `/api/complaints` | GET, POST | List/create complaints |
| `/api/workflows` | GET, POST | List/create workflows |
| `/api/admin/users` | GET, POST | User management |
| `/api/admin/roles` | GET, POST | Role management |
| `/api/settings` | GET, PUT | Platform settings |

## License

MIT

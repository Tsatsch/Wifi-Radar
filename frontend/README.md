## Wifi-Radar Frontend

### Overview

This directory contains the **Next.js 16 / React 19 / TypeScript** frontend for Wifi-Radar, built with the App Router (`app/`), Tailwind CSS v4, and a shadcn-style component library on top of Radix UI primitives.

### Tech stack

- **Framework**: Next.js 16 (App Router, `app/` directory)
- **Language**: TypeScript
- **UI & Design**: React 19, Tailwind CSS v4, Radix UI, shadcn-style components in `components/ui`
- **Forms & Validation**: `react-hook-form`, `zod`, `@hookform/resolvers`
- **Other**: `@vis.gl/react-google-maps` for maps, `recharts` for charts, `sonner` for toasts

### Getting started

1. Install dependencies (from the repo root or `frontend/`):

```bash
pnpm install
# or
npm install
```

2. Run the dev server from `frontend/`:

```bash
npm run dev
# or
pnpm dev
```

3. Open `http://localhost:3000` in your browser.

### Useful scripts (from `frontend/`)

- `npm run dev` – start the Next.js dev server
- `npm run build` – production build
- `npm run start` – start the production server (after `build`)
- `npm run lint` – run ESLint

### Project layout (high level)

- `app/` – App Router entry (`layout.tsx`, `page.tsx`, route segments)
- `components/` – Feature and layout components (e.g. `map-view`, `sidebar-leaderboard`, `top-nav`)
  - `components/ui/` – Reusable UI primitives (buttons, inputs, dialogs, etc.)
- `hooks/` – Reusable React hooks (e.g. `use-toast`, `use-mobile`)
- `lib/` – Utilities (e.g. `cn` class name helper)
- `public/` – Static assets (icons, images)
- `styles/` – Global styles and Tailwind entrypoints

### Conventions

- Prefer **server components** by default; add `"use client"` only when needed (interactivity, browser APIs, third-party UI libs).
- Use **Tailwind CSS** with the `cn` helper (`lib/utils.ts`) for conditional classes.
- Reuse existing primitives in `components/ui` before creating new ones; follow existing patterns when adding new components.
- Use **TypeScript** everywhere and keep props/return types explicit when it improves clarity.

### Backend API Integration

The frontend integrates with the backend API to fetch Wi-Fi statistics computed using Chainlink CRE workflows.

#### Environment Variables

Set the backend API URL in `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
# or for production:
NEXT_PUBLIC_API_BASE_URL=http://35.222.217.64
```

#### Using Statistics Hook

The `useStatistics` hook fetches Wi-Fi statistics from the backend:

```tsx
import { useStatistics } from "@/hooks/use-statistics"

function MyComponent() {
  const { statistics, loading, error, refresh } = useStatistics()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {statistics.map((stat) => (
        <div key={stat.wifiName}>
          <h3>{stat.wifiName}</h3>
          <p>Average Speed: {stat.averageSpeed} Mbps</p>
          <p>Measurements: {stat.totalMeasurements}</p>
        </div>
      ))}
    </div>
  )
}
```

#### Statistics Component

A ready-to-use `StatisticsPanel` component is available:

```tsx
import { StatisticsPanel } from "@/components/statistics-panel"

function MyPage() {
  return <StatisticsPanel />
}
```

#### API Endpoints

- `GET /api/statistics` – Returns Wi-Fi statistics aggregated by network name
- `GET /health` – Backend health check

The statistics are computed from data points stored on Filecoin and processed using Chainlink CRE workflows for decentralized consensus.



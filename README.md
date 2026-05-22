# IrishInvoice Frontend

Document Intelligence Platform for Irish SMEs — built with React 18 + TypeScript + Vite.

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- React Router v6
- TanStack Query v5
- Zustand (auth/UI state)
- React Hook Form + Zod
- Tailwind CSS v3
- Lucide React (icons)
- Recharts (analytics)
- React Dropzone (file upload)

## Getting Started

```bash
npm install
npm run dev
```

Requires the FastAPI backend running at `http://localhost:8000`.

## Pages

- `/login` — Login
- `/register` — Register
- `/` — Inbox (document list)
- `/documents/:id` — Document detail (split-pane viewer + extracted fields)
- `/dashboard` — Analytics dashboard
- `/exports` — Export runs
- `/settings` — Profile & settings

## Environment

All `/api/*` requests are proxied to `http://localhost:8000` via Vite dev server.

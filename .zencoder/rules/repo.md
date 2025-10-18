# LaudraTrack Repository Overview

## Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript/JavaScript hybrid (TypeScript types present, many components in JS)
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **Database**: MongoDB via custom `lib/db` helpers
- **APIs**: Next.js Route Handlers under `app/api`

## Key App Routes

1. **`app/page.js`** – Landing page.
2. **`app/admin`** – Admin portal (dashboard, orders, reports, users, calendar).
3. **`app/customer`** – Customer-facing tracking portal.
4. **`app/staff`** – Staff portal.

## Important Directories

- **`components/admin`** – Reusable admin UI components (tables, forms, calendar view).
- **`lib`** – Shared utilities (API clients, auth helpers, data formatting, DB models).
- **`hooks`** – Custom React hooks (`useApi`, `useAuth`, `useForm`).
- **`docs`** – Project documentation and setup guides.
- **`scripts`** – Node scripts (e.g., create admin/staff users).

## Data Flow Highlights

- Authentication handled with JWT middleware under `lib/auth`.
- Admin pages typically fetch via internal API routes (`/api/...`).
- Orders and appointments stored/retrieved using Mongo models defined in `lib/db`.

## Development Notes

- Environment configuration expected via `.env.local` based on `.env.example`.
- Tailwind configured in `tailwind.config.js`; global styles in `app/globals.css`.
- Run `npm install` followed by `npm run dev` for local development.

Keep this summary updated when major architectural changes occur.

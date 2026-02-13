# Overview

This is an event registration (inscription) system for "Happy Run" — a running event at Bandeiras Empresarial in Votorantim, Brazil, organized by Humani Treinamentos. The application provides a public-facing landing page where participants can register for the race (providing name, phone, and t-shirt size) and make PIX payments, plus an admin dashboard for managing registrations, confirming payments, and configuring settings like the PIX key.

The project is a full-stack TypeScript application with a React frontend and Express backend, using PostgreSQL for data persistence.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend

- **Framework**: React 18 with TypeScript
- **Routing**: Wouter with hash-based routing (`useHashLocation`). Routes are `/#/` for landing page and `/#/admin` for admin panel.
- **UI Components**: shadcn/ui component library (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS v4 with CSS variables for theming. Dark theme by default with turquesa (#0ADDC8) as the primary accent color.
- **Fonts**: Bebas Neue (display/titles) and Work Sans (body text), loaded from Google Fonts
- **State Management**: 
  - Server state: TanStack React Query for API data fetching and caching
  - Local state: Zustand with persistence (`client/src/lib/storage.ts`) for client-side config like PIX key
- **Forms**: React Hook Form with Zod validation via `@hookform/resolvers`
- **Animations**: Framer Motion
- **Build tool**: Vite with path aliases (`@/` → `client/src/`, `@shared/` → `shared/`, `@assets/` → `attached_assets/`)

## Backend

- **Framework**: Express 5 on Node.js
- **Language**: TypeScript, executed via `tsx`
- **API Design**: RESTful JSON API under `/api/` prefix
- **Key API Routes** (defined in `server/routes.ts`):
  - `GET /api/inscriptions` — list all registrations
  - `POST /api/inscriptions` — create a registration
  - `PATCH /api/inscriptions/:id/payment` — toggle payment confirmation
  - `DELETE /api/inscriptions/:id` — remove a registration
  - `POST /api/inscriptions/clear` — clear all registrations
  - `GET /api/config/:key` — get a config value
  - `POST /api/config` — set a config value
- **Static serving**: In production, serves built client files from `dist/public/`. In development, uses Vite dev server middleware with HMR.

## Database

- **Database**: PostgreSQL (required via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Schema** (defined in `shared/schema.ts`):
  - `users` — id, username (unique), password
  - `inscriptions` — id, nome, telefone, tamanho, pagamento_confirmado (boolean), data_inscricao (timestamp)
  - `configs` — id, key (unique), value
- **Migrations**: Drizzle Kit with `drizzle-kit push` command (`npm run db:push`)
- **Connection**: `pg.Pool` via `node-postgres` in `server/db.ts`

## Storage Layer

- `server/storage.ts` implements a `DatabaseStorage` class conforming to an `IStorage` interface, providing a clean abstraction over database operations. This pattern makes it easy to swap storage implementations.

## Build & Deployment

- **Development**: `npm run dev` starts the Express server with Vite middleware for HMR
- **Production build**: `npm run build` runs a custom build script (`script/build.ts`) that:
  1. Builds the client with Vite (output to `dist/public/`)
  2. Bundles the server with esbuild (output to `dist/index.cjs`), externalizing most dependencies except an allowlist
- **Production start**: `npm start` runs `node dist/index.cjs`

## Shared Code

The `shared/` directory contains schema definitions and types used by both frontend and backend. Drizzle table definitions generate both database schemas and Zod validation schemas, ensuring type safety across the stack.

# External Dependencies

- **PostgreSQL**: Required. Connection via `DATABASE_URL` environment variable. Used for all persistent data storage.
- **Google Fonts**: Bebas Neue and Work Sans loaded via CDN in `index.html`
- **Replit-specific plugins** (development only):
  - `@replit/vite-plugin-runtime-error-modal` — runtime error overlay
  - `@replit/vite-plugin-cartographer` — dev tooling
  - `@replit/vite-plugin-dev-banner` — development banner
- **No external auth service**: Authentication appears to be basic/local (username/password in users table, no OAuth or external auth provider)
- **No external payment processing**: PIX payments are handled via displaying a PIX key/QR code; payment confirmation is manual via the admin panel
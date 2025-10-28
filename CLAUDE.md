# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Environment Setup

### Prerequisites

Before running the project, you need to set up accounts and obtain API keys:

1. **Clerk** (Authentication & User Management)
   - Create account at https://dashboard.clerk.com
   - Create a new application
   - Copy Publishable Key and Secret Key
   - Configure webhook endpoint for user events

2. **Neon** (PostgreSQL Database)
   - Create account at https://console.neon.tech
   - Create a new project
   - Copy your connection string (DATABASE_URL)

3. **Mux** (Video Hosting & Streaming)
   - Create account at https://dashboard.mux.com
   - Generate API token credentials
   - Configure webhook for upload completion events

4. **UploadThing** (File Uploads)
   - Create account at https://uploadthing.com
   - Create a new project
   - Copy your API token

5. **Upstash** (Redis + Workflows)
   - Create account at https://console.upstash.com
   - Create Redis database for rate limiting
   - Create QStash for background jobs
   - Set up ngrok tunnel for local webhook testing

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Then update `.env` with your actual credentials from the services above.

**Important**: Never commit `.env` to version control. The `.env.example` file shows the required variables without secrets.

## Project Overview

This is a **YouTube clone** built with Next.js 15, TypeScript, and a modern web stack. It's a full-featured video sharing platform with creator studio capabilities, video recommendations, commenting, playlists, subscriptions, and user profiles.

## Quick Commands

### Development
- `npm run dev:all` - Run dev server with ngrok webhook tunnel (port 3008)
- `npm run dev` - Run dev server only (port 3008)
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

### Database
- `npm run db:studio` - Open Drizzle Studio GUI for database inspection
- `npm run db:generate` - Generate database migrations from schema changes
- `npm run db:migrate` - Apply pending database migrations

## Architecture

### Technology Stack

**Framework & Language:**
- Next.js 15 with App Router (not Pages Router)
- TypeScript with strict mode
- React 19 (server & client components)

**API & Data:**
- **tRPC** + **React Query** for end-to-end type-safe APIs
- `@neondatabase/serverless` PostgreSQL with Drizzle ORM
- Superjson for complex type serialization (Date, Map, etc.)
- React `cache()` utility for request-level deduplication

**Auth:**
- Clerk for authentication, user management, and profiles
- Webhook integration at `/api/users/webhook` for Clerk events
- Protected routes enforced via middleware

**Video Services:**
- Mux for video hosting, streaming, and encoding
- Mux webhooks for upload completion events
- UploadThing for thumbnail/file uploads

**Infrastructure:**
- Upstash Redis for rate limiting (10 req/10s per user)
- Upstash Workflows for async background jobs
- Ngrok for local webhook tunneling during development

**UI:**
- Tailwind CSS + Tailwind Merge for styling
- Radix UI for accessible, headless components
- Lucide React for icons
- React Hook Form for form state
- Sonner for toast notifications

### Code Organization

**Modular Structure** - Each feature is self-contained:
```
/src/modules/[feature]/
  ├── server/procedures.ts      # tRPC queries/mutations
  ├── ui/components/            # Feature-specific components
  ├── ui/sections/              # Composite sections
  ├── ui/views/                 # Full page views
  ├── types.ts                  # TypeScript types
  └── ui/layouts/               # Layout wrappers
```

Key modules: `videos`, `comments`, `playlists`, `subscriptions`, `studio`, `search`, `users`, `categories`, `video-reactions`, `comment-reactions`, `video-views`, `home`, `auth`.

**API Routes:**
- `/api/trpc/[trpc]` - tRPC endpoint
- `/api/uploadthing/*` - File upload handler
- `/api/users/webhook` - Clerk user events
- `/api/videos/webhook` - Mux video events
- `/api/videos/workflows/*` - Background workflows

**App Router:**
- `/(auth)` - Sign-in/sign-up pages
- `/(home)` - Main feed, trending, subscriptions, search, watch pages
- `/(studio)` - Protected creator dashboard
- `/playlists` - Playlist management

### Data Flow

1. **Server Components** fetch data via tRPC procedures (at build/render time)
2. **HydrateClient** wrapper passes prefetched data to React Query
3. **Client Components** use `useQuery`/`useMutation` hooks for subsequent updates
4. **tRPC Context** extracts Clerk user ID via `auth()` for protected procedures
5. **Protected Procedures** verify user exists in DB, apply rate limits, then execute

### Database Schema

Core tables: `users`, `videos`, `categories`, `videoViews`, `videoReactions`, `comments`, `commentReactions`, `subscriptions`, `playlists`, `playlistVideos`.

Key features:
- UUIDs for all primary keys
- Cascade delete relationships
- Enums for visibility (`private`, `public`) and reaction types (`like`, `dislike`)
- Unique constraints on user-video reactions and views
- Clerk integration via `clerkId` on users table

### Authentication Flow

1. Clerk handles sign-in/sign-up via UI components
2. `clerkMiddleware` protects routes: `/studio/*`, `/playlists/*`, `/feed/subscriptions/*`, `/feed/channels/*`
3. Webhook at `/api/users/webhook` syncs Clerk events to database:
   - `user.created` - Creates user record
   - `user.updated` - Updates profile
   - `user.deleted` - Removes user
4. Protected tRPC procedures verify user exists in DB

## Key Implementation Details

### Type-Safe APIs with tRPC

All API calls are type-safe. Client has full IDE autocompletion for server procedures:

```typescript
// Client
const { data } = trpc.videos.getById.useQuery({ id: videoId });

// Server
export const videosRouter = router({
  getById: publicProcedure.input(z.object({ id: z.string() })).query(...)
});
```

### Protected Routes & Rate Limiting

Protected procedures use `protectedProcedure` which:
1. Verifies user is authenticated via Clerk
2. Fetches user from DB (fails if not found)
3. Applies rate limit via Upstash Redis
4. Executes handler

### Video Upload Flow

1. Frontend uses `@mux/mux-uploader-react` component
2. Upload creates Mux asset and stores `muxAssetId`, `muxUploadId`
3. Mux webhook fires on completion
4. `/api/videos/webhook` updates video record with `muxPlaybackId`, `muxStatus`
5. Playback uses `@mux/mux-player-react` with playback ID

### Image Handling

Configure Mux and UploadThing domains in `next.config.ts`:
- `image.mux.com` - Video thumbnails
- `utfs.io`, `dpv7gebbeu.ufs.sh` - UploadThing files

## Development Workflow

### Adding a New Feature

1. Create module folder in `/src/modules/[feature]`
2. Define Zod schema for inputs in module
3. Create tRPC procedures in `server/procedures.ts`
4. Build UI components in `ui/components/`
5. If protected, use `protectedProcedure` and add route protection in middleware
6. For rate-limited operations, protection is built into `protectedProcedure`

### Database Changes

1. Update schema in `/src/db/schema.ts`
2. Run `npm run db:generate` to create migration
3. Run `npm run db:migrate` to apply
4. Regenerate Drizzle types: `npm run db:generate` (if needed)

### Webhook Setup (Local Development)

The `dev:all` script runs ngrok with a reserved URL (`great-lamprey-subtly.ngrok-free.app`). Configure webhook endpoints in respective dashboards:
- **Clerk**: `https://great-lamprey-subtly.ngrok-free.app/api/users/webhook`
- **Mux**: `https://great-lamprey-subtly.ngrok-free.app/api/videos/webhook`

## Testing & Deployment

**No testing framework currently configured.** Consider adding Jest + React Testing Library for unit tests and Playwright for E2E tests.

**Deployment:**
- Designed for Vercel
- All environment variables must be set in Vercel dashboard
- Use Neon for database, Mux for video, Clerk for auth (Vercel-compatible services)

## Notes

- Use Server Components by default; only use Client Components where necessary (interactivity, hooks)
- Always use tRPC for APIs, never raw API routes (except webhooks)
- Path alias `@/` maps to `/src/`
- Drizzle relations are defined via `relations()` helper; always keep schema.ts and relations in sync
- Rate limiting is per-user, enforced at procedure level for protected routes
- Mux asset status is stored; poll or use webhooks to detect upload completion

## Project Dependencies

### Framework & Core
- `Next.js` (^15.2.3) - React framework with App Router for full-stack development
- `React` (^19.0.0) - JavaScript library for building user interfaces with server and client components
- `React DOM` (^19.0.0) - React package for DOM manipulation

### Type Safety & Validation
- `TypeScript` (^5) - JavaScript with static type checking
- `Zod` (^3.24.2) - TypeScript-first schema validation with static type inference
- `Drizzle-Zod` (^0.7.0) - Zod schema generation from Drizzle ORM models

### API & Data Layer
- `tRPC` (^11.0.0-rc.824) - End-to-end typesafe RPC framework with client, react-query, and server packages
- `React Query` (^5.67.2) - Powerful asynchronous state management library for server state
- `Drizzle ORM` (^0.40.0) - TypeScript ORM for SQL databases with great developer experience
- `Drizzle-Kit` (^0.30.5) - CLI tool for Drizzle migrations and schema management
- `@neondatabase/serverless` (^0.10.4) - Serverless PostgreSQL client for Neon database

### Authentication & User Management
- `@clerk/nextjs` (^6.12.4) - Complete authentication and user management solution with webhooks

### Video & Media Services
- `@mux/mux-node` (^10.1.0) - Mux API client for managing video assets and playback
- `@mux/mux-player-react` (^3.3.0) - React component for streaming video playback
- `@mux/mux-uploader-react` (^1.1.2) - React component for handling video uploads

### File Uploads
- `@uploadthing/react` (^7.3.0) - React hooks for file uploading
- `uploadthing` (^7.5.2) - File upload solution with easy setup

### Rate Limiting & Caching
- `@upstash/redis` (^1.34.5) - Redis client for rate limiting and caching
- `@upstash/ratelimit` (^2.0.5) - Rate limiting solution powered by Upstash Redis

### Background Jobs & Workflows
- `@upstash/workflow` (^0.2.6) - Orchestration and scheduling for background jobs
- `Svix` (^1.61.3) - Webhook management and delivery service

### UI & Styling
- `Tailwind CSS` (^4) - Utility-first CSS framework for rapid UI development
- `@tailwindcss/postcss` (^4) - PostCSS plugin for Tailwind CSS
- `Tailwind Merge` (^3.0.2) - Utility to merge Tailwind CSS classes intelligently
- `Tailwindcss-Animate` (^1.0.7) - Animation utilities for Tailwind CSS
- `Radix UI` (multiple packages) - Unstyled, accessible React components including Avatar, Dialog, Dropdown Menu, Label, Select, Separator, Slot, Toggle Group, and Tooltip

### Forms & State Management
- `React Hook Form` (^7.54.2) - Performant, flexible form validation with hooks
- `@hookform/resolvers` (^4.1.3) - Validation resolvers for React Hook Form

### UI Components & Utilities
- `Lucide React` (^0.479.0) - Beautiful, consistent icon library
- `Sonner` (^2.0.1) - Toast notification library for React
- `Vaul` (^1.1.2) - Unstyled drawer component for React
- `Embla Carousel React` (^8.5.2) - Carousel/slider library for React

### Utilities & Helpers
- `Date-fns` (^4.1.0) - Modern date utility library
- `Superjson` (^2.2.2) - Serialization library for complex JavaScript types (Date, Map, Set, etc.)
- `CLSX` (^2.1.1) - Utility for constructing className strings conditionally
- `Class Variance Authority` (^0.7.1) - Library for creating composable component APIs
- `Next-Themes` (^0.4.4) - Theme provider for Next.js with dark mode support
- `Concurrently` (^9.1.2) - Run multiple npm scripts concurrently

### Environment & Configuration
- `Dotenv` (^16.4.7) - Environment variable loader from .env files
- `TSX` (^4.19.3) - TypeScript execution environment for Node.js

### Bundling & Code Quality
- `ESLint` (^9) - JavaScript linter for code quality
- `ESLint Config Next` (15.2.1) - Next.js ESLint configuration
- `@eslint/eslintrc` (^3) - ESLint configuration utility

### Runtime Safety
- `Server-Only` (^0.0.1) - Ensures code runs only on the server side
- `Client-Only` (^0.0.1) - Ensures code runs only on the client side
- `React Error Boundary` (^5.0.0) - Error boundary component for React

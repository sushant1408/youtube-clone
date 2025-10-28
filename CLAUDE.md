# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

## Environment Variables

Required for full functionality:

```bash
DATABASE_URL                          # Neon PostgreSQL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY     # Clerk auth
CLERK_SECRET_KEY                      # Clerk auth
CLERK_SIGNING_SECRET                  # Clerk webhook signing
CLERK_WEBHOOK_ENDPOINT_SECRET         # Clerk dashboard webhook
MUX_TOKEN_ID & MUX_TOKEN_SECRET       # Video hosting
MUX_WEBHOOK_SECRET                    # Mux video events
UPLOADTHING_TOKEN                     # File uploads
UPSTASH_REDIS_REST_URL & TOKEN        # Rate limiting & caching
QSTASH_TOKEN                          # Workflows
NEXT_PUBLIC_APP_URL                   # App base URL (http://localhost:3008 dev)
```

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

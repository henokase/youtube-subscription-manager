## Project Overview
Build a full-stack Next.js app to authenticate users via YouTube OAuth, list all subscriptions with previews, enable bulk selection, and unsubscribe with confirmation dialogs. Focus on core unsubscribe/notifications toggle first, expandable to other features. Target deployment on Vercel.


## Functional Requirements
- User authenticates with Google OAuth 2.0, granting `https://www.googleapis.com/auth/youtube` scope.
- Dashboard lists subscriptions (paginated) with channel name, thumbnail, subscriber count, and notification status.
- Bulk actions: select all/deselect, unsubscribe selected, toggle notifications.
- Search/filter by channel name; export list as CSV.
- Rate limiting and progress indicators for bulk operations.


## Non-Functional Requirements
- Responsive UI for mobile/desktop (Tailwind CSS, aligning with your stack).
- Secure token storage (cookies/HTTP-only sessions, no localStorage).
- Error handling for API quotas (10,000 units/day default), retries, and offline states.
- Performance: Load 50 subscriptions initially, infinite scroll for more.
- Accessibility: ARIA labels on interactive elements, keyboard navigation.


## Technical Stack
| Component | Technology | Rationale |
|-----------|------------|-----------|
| Framework | Next.js 15 (App Router) | Server actions for API calls, built-in auth patterns, SSR for SEO/private data. |
| Auth | NextAuth.js (Google provider) | Handles OAuth flow, token refresh seamlessly. |
| API Client | Googleapis npm (@googleapis/youtube) | Official SDK for subscriptions.list/delete. |
| UI/Styling | Tailwind CSS, shadcn/ui | Rapid prototyping, responsive components. |
| Deployment | Vercel (primary), cPanel fallback | GitHub integration, env vars for secrets. |


## API Integrations
- **YouTube Data API v3**: Key endpoints: `subscriptions.list` (mine=true), `subscriptions.delete(id)`, `channels.list` for details.
- Google Cloud Console setup: Enable API, create OAuth credentials (web client, authorized URIs: http://localhost:3000, production domain).
- Quotas: Monitor via Google Cloud dashboard; request increases if needed.


## Setup Instructions
1. `npx create-next-app@latest youtube-subs-manager --typescript --tailwind --app`
2. `npm i next-auth @googleapis/youtube @auth/google-providers`
3. Configure `auth.ts` with Google client ID/secret from env vars.
4. Implement `/api/youtube/subscriptions/route.ts` as GET (list) and server action for delete.
5. Add pages: login, dashboard with table from `useQuery` or SWR.


## Security Considerations
- Validate all API inputs server-side to prevent injection.
- Scope OAuth minimally; revoke access option in UI.
- CORS: Restrict to your domain.
- Rate limit bulk deletes (e.g., 1/sec) to avoid 429 errors.


## Future Enhancements
- Notification management via `subscriptions.insert` (snippet.notifications).
- Analytics: Subscription age, view stats.
- PWA for app-like feel on Android.
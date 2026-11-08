# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:**
1 - Foundation
**Last completed:**
03 PostHog Initialization
**Next:**
04 Database Schema

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [ ] 04 Database Schema

### Phase 2 — Profile Page

- [ ] 05 Profile Page — Full UI
- [ ] 06 Profile Save Logic
- [ ] 07 AI Profile Extraction from Resume
- [ ] 08 Resume PDF Generation from Profile

### Phase 3 — Find Jobs Page

- [ ] 09 Find Jobs Page — Full UI
- [ ] 10 Adzuna Job Discovery
- [ ] 11 Filter + Sort + Pagination

### Phase 4 — Job Details Page

- [ ] 12 Job Details Page — Full UI
- [ ] 13 Company Research Agent

### Phase 5 — Dashboard

- [ ] 14 Dashboard Page — Full UI
- [ ] 15 Stats Bar — Real Data
- [ ] 16 Recent Activity — Real Data
- [ ] 17 Analytics Charts — PostHog Data

---

## Decisions Made During Build

_Add decisions here as they are made during implementation._

---

## Notes

_Add notes here as the build progresses — workarounds, patterns, anything that differs from the context files._

- Auth foundation started with InsForge SSR helpers, login page, OAuth callback/refresh routes, proxy protection, and protected route scaffolds.
- Login page now handles OAuth initialization failures by redirecting back to `/login?error=oauth_failed` and rendering a recoverable banner instead of throwing.
- PostHog now captures `page_viewed`, `marketing_cta_clicked` with destination, `sign_in_started`, and `signed_out` from the current application surfaces.
- PostHog initialization is managed by the PostHog Wizard in `instrumentation-client.ts`; application code should add events through the shared capture helper without creating a second client initialization.

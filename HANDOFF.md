# Xlay — Engineering Handoff & Current State

> **Tagline:** "Show Up."  
> **What it is:** A Snapchat-native link-in-bio platform for Nigerian creators, students, and event-goers. Users sign in with Snapchat, their Bitmoji becomes the face of a public card at `xlay.me/username`, carrying their links, stats, music, and best friends.  
> **Production Domain:** `https://xlay.me`  
> **GitHub Repo:** `https://github.com/Jay-sage/Xlay`  
> **Local Path:** `C:\Users\ADMIN\.gemini\antigravity\scratch\xlay`  
> **Last Updated:** 2026-11-21 (HEAD: `e124e9c`)

---

## 1. Stack & Rules (Decided — Do Not Revisit)

- **Framework:** Next.js 16.4.6 (App Router, Turbopack), React 19.3.0, TypeScript `strict: true`
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss` + `postcss.config.mjs`). All design tokens are CSS variables in `app/globals.css`. Fonts via `next/font/google`: `Syne` (display) and `DM Sans` (body).
- **Package Manager:** `pnpm` (v12.21.0), single lockfile, one React version. Never use dedupe hacks.
- **Database / Auth / Storage:** Supabase (`xiadouznnbpwrhfpqumh`, region `eu-west-1`, URL `https://xiadouznnbpwrhfpqumh.supabase.co`). Row Level Security (RLS) on every table.
- **Hosting:** Vercel (Project `xlay`, ID `prj_rvqSVQmw3CFZbPr2M2fszwus6od1`, Team `jaysages-projects`).
- **Next.js 16 Note:** Middleware uses `proxy.ts` exporting `export async function proxy(request: NextRequest)` (not `middleware.ts`).
- **Working Method:** Work in phases. Present a short plan and wait for approval before building a new phase. Commit small and often. Keep migrations in `/supabase/migrations`. Never hardcode secrets.

---

## 2. What Is Built & Working Right Now

### Phase 0 — Foundation ✅
- Repo initialized, CI workflow (`.github/workflows/ci.yml`), `app/api/health`, `app/error.tsx`, `app/loading.tsx`, `app/not-found.tsx`.
- Base layout with `Syne` + `DM Sans`, dark-first CSS variable design tokens (`#080808` base, `#E8FF47` accent, `.glass` / `.glass-panel` with solid fallback, reduced-motion support).

### Phase 1 — Snap Review Build (Core Complete, UI Polish & Tests Pending)
- **Snap Login Kit OAuth 2.0 (PKCE + state):**
  - Routes: `/login`, `/auth/snap`, `/auth/callback`, `/auth/logout`, `/auth/denied`, `/auth/error`.
  - `lib/snap/index.ts` sends a GraphQL `POST` to `https://kit.snapchat.com/v1/me` with `{me{displayName bitmoji{avatar} externalId}}`.
  - Maps `snap_external_id` to a Supabase Auth user via admin API (`lib/supabase/admin.ts`) and establishes a real Supabase session via `@supabase/ssr` cookies (`auth.uid()` works in RLS).
  - **Tested & working locally end-to-end.**
- **Full-Body 3D Bitmoji Engine (`lib/snap/bitmoji.ts` + `components/ui/Avatar.tsx`):**
  - Extracts the opaque Login Kit `avatarId` from Snap's `sdk.bitmoji.com/3d/render/{templateId}-{avatarId}-v1.png` URL and renders official Snapchat 3D full-body transparent poses via `https://sdk.bitmoji.com/3d/render/{poseId}-{avatarId}-v1.png?transparent=1&ua=2`.
  - Verified working poses in `BITMOJI_POSES`:
    - `30415970` — **Arms Crossed** *(default)*
    - `582513516` — **Calm Stand**
    - `36713223` — **Heart Hands**
    - `10226022` — **Neutral 3D**
    - `10219858` — **Shades Stand**
    - `headshot` — **Classic Circle**
  - Adding more Snapchat poses is trivial: inspect `web.snapchat.com` DevTools for `images.bitmoji.com/3d/avatar/{POSE_ID}-...` and add `{POSE_ID}` to `BITMOJI_POSES`.
  - Single `Avatar` component (`components/ui/Avatar.tsx`) driven by `avatar_source` and `avatar_pose`, Snap-compliant (Bitmoji art is unmodified; ambient glow/rings stay behind/around it).
- **Onboarding (`/onboarding`):**
  - Step 1: Username claim with live availability check (`lib/username.ts`: 3–20 chars, `[a-zA-Z0-9_]`, not in `reserved_usernames`).
  - Step 2: Optional email (skippable).
- **Dashboard (`/dashboard`):**
  - `/` — Live iPhone frame Card Preview (`CardPreview.tsx`)
  - `/links` — Add, toggle, reorder, delete links with platform auto-detection
  - `/stats` — Self-entered Streak & Snap Score + visibility toggles + total view count
  - `/themes` — 4 starter themes (`midnight`, `phantom`, `lagoon`, `ember`)
  - `/music` — **Apple Music / iTunes Search API** (`/api/itunes`) with 30s official preview playback and 1-click selection (replaced MP3 uploads to avoid copyright/storage risk)
  - `/friends` — Best Friends invite link creation (max 3 accepted enforced by DB trigger) + revoke
  - `/share` — Tagged share links (`?ref=snapchat|whatsapp|tiktok|instagram`)
  - `/settings` — Live **Bitmoji Pose (3D)** picker, display name, bio, privacy toggle, JSON data export, permanent account deletion
- **Public Card (`/[username]`):**
  - Full-screen background, tap-to-enter reveal that starts Apple Music 30s preview, full-body 3D Bitmoji, ambient stats, icon-only glass pill links, Best Friends Bitmoji cluster, volume slider, "Powered by Xlay" footer.
  - Private cards render a "This card is private" screen.
  - View logging (`/api/views`): `?ref=` → in-app browser UA → `Referer` → `direct` (`lib/referrer.ts`). Filters link-preview bots. Daily-salted SHA-256 visitor hash (never stores IP). In-memory 5-min deduplication.
  - Click logging (`/api/links`).
- **Best Friends Invite Flow (`/invite/[token]`):**
  - Shows owner + live preview of what appears on their card, prompts Snapchat login if signed out, enforces max 3 accepted friends.
- **Legal & SEO:**
  - `/privacy`, `/terms`, `/data-deletion`, `/contact`, `app/robots.ts`, `app/sitemap.ts`.

---

## 3. Database Schema (Applied in Supabase)

Migrations in `supabase/migrations/`:
1. `20261115000000_foundation.sql` — `reserved_usernames` (16 reserved slugs, RLS public read)
2. `20261120000000_phase1_tables.sql` — `profiles`, `links`, `best_friend_invites`, `card_views`, `link_clicks`, `get_public_card(text)`, `get_view_count(uuid)`, RLS policies, triggers (`trg_profiles_no_reserved_username`, `trg_profiles_updated_at`, `trg_bfi_max_friends`), Storage buckets (`music`, `avatars`)
3. `20261121000000_bitmoji_pose.sql` — adds `avatar_pose text not null default '30415970'` to `profiles` and updates `get_public_card`

---

## 4. Known Gaps / Immediate Next Priorities

1. **Design Overhaul + Theme Editor (User's #1 next goal):**
   - User plans to connect a **Design MCP** (e.g. Figma) to replace the starter "AI-sloppy" UI with bespoke components and build a rich interactive **Theme Editor** (backgrounds, accent/glow, glass materials, font pairings, card/pill shapes, live iPhone preview).
2. **Remaining Phase 1 Polish & Security Items:**
   - **Unit & SQL Tests:** Vitest tests for `lib/username.ts`, `lib/referrer.ts`, bot filtering, visitor hash, plus SQL RLS policy tests.
   - **Rate Limiting:** `/api/views` currently uses an in-memory `Map` (resets on serverless cold start); Best Friends invite creation needs server-side rate limiting.
   - **Friend Revocation in Settings:** Friends need a "Cards I appear on" section in `/dashboard/settings` so they can revoke their Bitmoji from someone else's card anytime.
   - **Account Deletion Completeness:** `/dashboard/settings` currently deletes storage + `profiles` row from the client, which does not delete the `auth.users` record. Move account deletion to a server route (`POST /api/account/delete`) using `createAdminClient().auth.admin.deleteUser(user.id)` so `auth.users` + all cascading rows + storage files are permanently deleted.
   - **Snap Portal README Section:** Add exact Snap Developer Portal submission fields (redirect URIs, privacy/terms URLs, description, review demo steps) to `README.md`.
   - **Invite Redirect Preservation:** `/auth/snap` should read `?next=/invite/[token]`, store it in an httpOnly cookie, and redirect there after `/auth/callback` completes.
   - **Username Claim Passthrough:** Landing page form submits `/login?claim=<username>` — persist `claim` through OAuth into `/onboarding` so the input pre-fills.
3. **Deployment / Ops:**
   - Connect GitHub repo `Jay-sage/Xlay` to Vercel project `xlay` (Settings → Git) for auto-deploys.
   - Ensure `SUPABASE_SERVICE_ROLE_KEY`, `SNAP_CLIENT_ID`, and `SNAP_CLIENT_SECRET` are set in Vercel Environment Variables (Production + Preview).
   - Push latest local commits (`git push origin main`).

---

## 5. Snap Compliance Checklist (Non-Negotiable)

- Bitmoji artwork is shown **unmodified** — rings/glows go around or behind it, never on top. No filters, recoloring, or overlays on the art.
- Bitmoji display is **free for all users** and never behind a paywall.
- A friend's Bitmoji appears on another user's card **only after** that friend authenticates with Snapchat and explicitly accepts.
- No Bitmoji art in marketing visuals (except real screenshots of the working integration).
- Privacy Policy (`/privacy`) and Data Deletion (`/data-deletion`) must stay live, linked from footer, and accurately match what the code does (session cookie only, no ad trackers, no IP storage).

---

## 6. Roadmap (Future Phases — Do Not Build Until Approved)

- **Phase 2 (Post-Snap Approval):** Casual analytics (hero sentence, visitor faces, traffic source icons), full Customize/Theme Editor, love reactions, wishlist (10 items free, `/go/[id]`), Paystack donations & wishlist cash gifts (5% split, behind `FEATURE_PAYSTACK` flag), QR codes, email capture.
- **Phase 3 (Later):** Xlay Events, Pro plan, newsletters (Brevo SMTP behind `FEATURE_BREVO_SMTP` flag), push notifications, Aura score.

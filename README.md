# Xlay — "Show Up."

> Snapchat-native link-in-bio platform for Nigerian creators, students, and event-goers.
> Public URL format: `xlay.me/[username]`

---

## Antigravity IDE Integration & Conversation Reference
- **Active Conversation ID**: [`34818d21-c9a5-4958-9d05-65b8dfe6c588`](conversation://34818d21-c9a5-4958-9d05-65b8dfe6c588)
- **Artifacts Path**: `C:\Users\ADMIN\.gemini\antigravity\brain\34818d21-c9a5-4958-9d05-65b8dfe6c588`
- **Transcript Logs**: `C:\Users\ADMIN\.gemini\antigravity\brain\34818d21-c9a5-4958-9d05-65b8dfe6c588\.system_generated\logs\transcript.jsonl`

---

## Architectural Guardrails & Stack
- **Framework**: Next.js App Router (TypeScript strict, Tailwind CSS, pnpm package manager).
- **Session & Auth**: Supabase Auth as session layer; Snap Login Kit OAuth 2.0 with PKCE and server-side state.
- **Database & Storage**: Supabase Postgres with strict Row-Level Security (RLS) on all tables; Storage for custom track uploads.
- **Hosting**: Vercel (Auto-deploys via GitHub, preview deployments, domain `xlay.me`).
- **Typography**: Syne (Display), DM Sans (Body).
- **Design Principles**: Dark first (`#080808` base, `#101010` surfaces, `#E8FF47` accent sparingly used), iOS-style glass panels with solid fallbacks for unsupported devices, responsive down to 390px, 768px, and 1440px.

---

## Roadmap
- [x] **Phase 0**: Foundation (Workspace, CI, base layout, tokens, boundaries, `/api/health`, Supabase restoration).
- [ ] **Phase 1**: Snap Review Build (Public landing, Snap Login Kit OAuth, onboarding, dashboard, public card `/[username]`, music, invites, legal pages).
- [ ] **Phase 2**: Post-Snap Approval (Analytics, extended customization, love reactions, iTunes previews, wishlists, Paystack donations behind feature flag).
- [ ] **Phase 3**: Scaling (Xlay Events, Pro tiers, newsletters, push notifications, Aura score).

# Latch — Meet beyond the profile.

**Latch** is a mobile-first, three-language dating web app centered on real conversations and shared interests (*Archetypes*).

## Current functionality
- Responsive Discover profiles with games, films, music and other Archetypes
- Nearby **city match** or international country search (no GPS or actual radius tracking)
- Email/password account registration using Supabase Auth
- Private date of birth with self-declared 18+ check
- Private photos in Supabase Storage (signed URLs, authenticated visibility)
- Likes, mutual matches, direct messages, in-app activity feed
- Browser notifications **while website is open** (not Web Push in the background)
- Block and report actions (operator moderation dashboard not built)
- Profile privacy / international discovery opt-ins, per-user data export
- Swedish, English and Spanish; basic cookies choice with **no analytics SDK** installed
- Draft multilingual legal/privacy/cookie notices

### Honest production status
**Development beta, not suitable for unrestricted public release.** Legal pages are working drafts without a named controller. There is no real photo/identity verification, robust age assurance, proactive content moderation, secure self-service account deletion, background push subscriptions or comprehensive global privacy-law review. Do not claim verified badges or full legal compliance. Resolve these before accepting the public.

The four illustrated preview profiles are intentionally labeled as **examples** and are not real people.

## Local development
Requires Node.js 22+.

```sh
npm install
cp .env.example .env.local
npm run dev
```

Set the following environment variables to the **existing Latch Supabase project**:

```dotenv
VITE_SUPABASE_URL=https://lzcuhmszshahknmdmezl.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your publishable key>
```

Publishable keys are intentionally browser-safe **only with tested RLS**. Never expose service_role/secret keys, SMTP credentials or cloud access tokens to the web app or this repository.

To build and type-check:

```sh
npm run typecheck
npm run build
```

## Deploy to GitHub Pages

This repo includes `.github/workflows/pages.yml` which builds the app and deploys `dist/` when code is pushed to main.

1. Open **GitHub → Astarkmarkus/Latch → Settings → Pages**.
2. Choose **Build and deployment → Source → GitHub Actions**.
3. Open **Actions** and run **Deploy Latch** if it has not automatically started.
4. After a successful deployment, the default URL will be **https://astarkmarkus.github.io/Latch/**.

Set **Supabase Authentication → URL Configuration → Site URL** and **Redirect URLs** to the final public address. Enable email confirmation and configure an email delivery provider before public onboarding.

## Database
Supabase project: `lzcuhmszshahknmdmezl` (previous dashboard name `MarcheseCRM`). Existing CRM tables and legacy Auth users were removed at the owner's explicit request. Latch schema uses ten `latch_*` tables, Row Level Security, match and notification triggers, and a private photo bucket.

**Renaming the Supabase dashboard project name** requires an update in the Supabase Dashboard (General Settings) because the connected tools do not expose a project rename action. The project identifier and URL must stay unchanged.

## Next milestone
Build a real onboarding safety gate, moderation queue, verified-photo workflow, consent/retention controls, GDPR deletion flow and full policy review; add push subscriptions via a secure backend.

# Latch

**Meet beyond the profile.**

A privacy-minded, mobile-first dating web app with shared-interest archetypes, nearby/worldwide discovery, and Swedish, English and Spanish localization.

> Status: development preview — not suitable for public launch until photo verification, moderation, legal review, and production push delivery are complete.

## Stack
React + TypeScript + Vite; Supabase Auth, Postgres/RLS and private Storage; Cloudflare Pages or any static host.

## Setup
1. `npm install`
2. `cp .env.example .env.local` and add the project URL + **publishable** Supabase key (never a secret/service-role key).
3. `npm run dev` for local preview.
4. `npm run build` for deployment (`dist/`).

Database migration lives under `supabase/migrations/`. Auth email confirmation and redirect URLs must be configured in Supabase Dashboard.

## Responsible launch
Draft terms/privacy/cookies are placeholders until a named operator, contact address, retention schedule, subprocessor list, moderation workflow, GDPR/DPIA review, jurisdiction-specific compliance and verification provider are configured.

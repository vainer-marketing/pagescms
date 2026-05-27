# Vainer CMS rebrand — design spec

Date: 2026-05-27. Status: approved (Zach), build.

## Goal
Turn the forked Pages CMS into a branded, client-friendly **"Vainer CMS"** so non-technical clients (e.g. Sara Freed) get a clean, on-brand experience and never see raw GitHub/technical artifacts. This fork (`vainer-marketing/pagescms`, deployed as the `vainer-cms` Vercel project at cms.vainermarketing.com) is the shared CMS for ALL Vainer clients, so the rebrand is reusable, not per-client.

## Brand kit (extracted from vainermarketing.com)
- Accent / primary: **`#fece04`** (Vainer yellow)
- Dark surface: **`#111113`** (near-black); also `#08090a`
- Headings/display font: **Space Grotesk** (Google font)
- Body font: **Inter** (Google font)
- Logo: pulled from the live site (`/images/home/vainerfavicon.png` + the horizontal logo)

## Decisions
- Name: **Vainer CMS** (matches vainermarketing.com spelling).
- Scope: rebrand + friendly project names + email-only sign-in + visual theme.
- Visual treatment = **HYBRID**: brand-forward (dark `#111113`, logo, yellow CTA) on the high-impact surfaces (**sign-in screen + emails**); keep the **editor interior light/white** with yellow+black accents for content readability.
- Friendly project name: clients see e.g. "Sara Freed", never `vainer-marketing/project-sara-freed`. Mechanism: a helper that **auto-derives** from the repo (strip `project-` prefix -> title-case) with a small **override map** for edge cases. Owner login hidden from client-facing views.

## Changes
1. **`lib/brand.ts`** (new): `BRAND_NAME = "Vainer CMS"`; `BRAND_COLORS` (yellow/dark); `friendlyProjectName(repo, owner?)` (derive + override map, default override `project-sara-freed -> "Sara Freed"`).
2. **Name swap**: point the ~30 "Pages CMS" literals at `BRAND_NAME` (app/layout.tsx metadata, components/sign-in.tsx, about.tsx, document-title.tsx, lib/auth.ts, lib/actions/collaborator.ts, lib/commit-message.ts, and the 3 email templates).
3. **Sign-in screen** (components/sign-in.tsx): REMOVE the "Sign in with GitHub" button (email magic-link only for everyone). Rebrand as a branded dark landing: `#111113` panel, Vainer logo, Space Grotesk heading, single email field, yellow `#fece04` submit button. Owners still link GitHub via Settings -> Connect (unchanged path).
4. **Friendly project name wiring**: use `friendlyProjectName` in the home project card/RepoSelect, path-breadcrumb (hide owner), document-title, and the invite email subject/body.
5. **Emails** (components/email/{invite,login,collaborator-added}.tsx + theme.ts): dark header band with logo, yellow CTA button, Space Grotesk/Inter, friendly copy, friendly project name, NO repo slugs. Sender stays `Vainer Marketing <no-reply@mail.vainermarketing.com>`.
6. **Theme** (app/globals.css / Tailwind tokens + fonts): set the shadcn `--primary` (and ring/accent) to Vainer yellow `#fece04` with readable foreground; load Space Grotesk (headings/brand) + Inter (body) via next/font; apply across the app. Editor body stays light.
7. **Logo/favicon**: download the site's mark; replace `app/icon.svg` (favicon) + `public/images/email-logo.png` (email header).

## Ship
- Commit to `vainer-marketing/pagescms`. **Git-connect** the `vainer-cms` Vercel project so future tweaks auto-deploy (replaces the manual `vercel deploy --prod` model). Redeploy.
- Re-test: re-send the invite to `zachweissbusiness@gmail.com`, confirm the branded email + email-only sign-in + friendly project name end-to-end. Then invite the real Sara.

## Non-goals (this pass)
- Full "de-GitHub-ification" of every interior screen (commit/branch terminology) — deferred.
- Multi-tenant per-client theming (one Vainer brand for all clients is fine).

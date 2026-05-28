# View live / View site — design spec

Date: 2026-05-28. Status: approved (Zach), build.

## Goal
Let clients open the published page they're editing with one click. Two surfaces:
1. A **"View site"** link in the project sidebar (opens the deployed homepage).
2. A **"View live"** button on each entry editor (opens the deployed URL for that specific post).

Reusable across every Vainer client (driven by per-repo `.pages.yml` config).

## Config additions (`.pages.yml`)
- Root: `site.baseUrl` — the deployed origin, e.g. `https://sarafreed.com`.
- Per content entry: `view.liveUrl` — a path template using `{slug}` or `{fields.x}`.

Example:
```yaml
site:
  baseUrl: https://sarafreed.com
content:
  - name: blog
    type: collection
    path: src/content/blog
    view:
      liveUrl: "/relationship-advice/{slug}"
    fields: [...]
```

`{slug}` = the file's basename minus extension (e.g. `src/content/blog/foo.md` -> `foo`). Other tokens resolve from the entry's saved fields (`{fields.title}` or `{title}`) using the existing `interpolate()` helper in `lib/schema.ts`.

## Behavior
- "View site" appears only when `site.baseUrl` is set. Always opens in a new tab.
- "View live" appears only when (a) `site.baseUrl` is set, (b) the entry's schema has `view.liveUrl`, and (c) the entry has been saved (has a `path`). Opens in a new tab.
- Unconfigured collections (e.g. testimonials, FAQs) show no button — they're not standalone URLs.

## Files
- `lib/config-schema.ts` — add `site.baseUrl` at root + `view.liveUrl` per content entry.
- `lib/config.ts` — normalize: strip trailing slash from `site.baseUrl`.
- `lib/live-url.ts` (NEW) — `getSiteBaseUrl(config)`, `resolveEntryLiveUrl({config, schema, path, fields})`.
- `components/repo/repo-sidebar.tsx` — inject a "View site" item above Content.
- `components/entry/entry.tsx` — render a "View live" button next to History in the header.

## Non-goals
- Branch/draft previews (each commit getting its own *.vercel.app preview URL). Deferred until a client actually needs it.
- Per-collection URL templating beyond `{slug}` + saved field values.

# CLAUDE.md — The Corporate Supplier Sustainability Portal 2026

Reference: `product-spec.md` (Tier 1, D1+A1, Netlify-only static site). Read it before making changes.

## What this is

A single-page, static HTML site (`index.html`) with no build step, no backend, and no
persisted data. Netlify serves the repo root directly (`netlify.toml` sets `publish = "."`).

## File layout

- `index.html` — the entire tool. All content is hardcoded.
- `assets/The_Corporate_Supplier_Questionnaire_2026.xlsx` — the downloadable ESRS
  questionnaire, served as a static file. Never populate it server-side.
- `docs/` — reference PDFs (Supplier Code of Conduct, Global Environmental Policy, and
  internal strategy/charter documents). The Code of Conduct and Environmental Policy are
  linked from the "Key Resources" section.
- `product-spec.md` — the source of truth for scope, copy, brand rules, and acceptance
  criteria. `PROGRESS.md` tracks status against it.

## Brand rules (enforce on every change)

- Fonts: Playfair Display (headlines, 700 weight), DM Sans 300 (body), DM Sans 500
  (labels/emphasis) — Google Fonts CDN only.
- Colours: Ink `#000000`, Stone `#B6B09F`, Linen `#EAE4D5`, Chalk `#F2F2F2`, White
  `#FFFFFF`, Acid Lime `#C8F135`.
- Acid Lime: at most two uses per page, always against black — currently the
  "Supplier Programme 2026" eyebrow pill and the timeline step-number badges.
- Square corners everywhere (`border-radius: 0`), no shadows, no gradients.
- Cards: 0.5px Stone border, Linen or White background.
- No blue links — underline + Ink colour only.
- Copy: short declarative sentences, active voice, no exclamation points, no emoji.

## Behavioural constraints from the spec

- Both submission paths (EcoVadis and questionnaire download) must always be visible
  together. Do not add logic that hides, dims, or gates either path based on user input
  (this was a real defect in an earlier draft — Section 9 of the spec is explicit that no
  such gating should exist).
- "Submit EcoVadis Scorecard" opens `https://ecovadis.com` in a new tab
  (`target="_blank" rel="noopener noreferrer"`).
- "Download Assessment" downloads the XLSX via a plain anchor with the `download`
  attribute — no JS-driven download logic.
- No forms, no data submission through this portal. Any interactivity that starts
  persisting or collecting supplier input needs a new spec (this tool is D1/A1, Tier 1).

## Working on this repo

- This is Tier 1: no database, no auth, no environment variables. Don't introduce any of
  those without updating `product-spec.md` first — it would change the tier.
- Test locally (e.g. `python3 -m http.server`) before pushing; confirm all links and the
  XLSX download resolve.
- Deploys via Netlify on push to `main`.

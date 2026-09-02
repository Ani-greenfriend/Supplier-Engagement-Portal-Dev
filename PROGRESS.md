# PROGRESS — The Corporate Supplier Sustainability Portal 2026

Tracks status against `product-spec.md` Section 13 (Acceptance Criteria) and Section 14
(Build Path).

## Build session — 2026-09-02

First Session Setup and Tier 1 build, run against the retroactive spec:

- Created `docs/` and `assets/`; moved the questionnaire XLSX and reference PDFs there
  from the repo root.
- Renamed `supplier-onboarding.html` → `index.html` so Netlify serves it at the site root
  with no redirect needed.
- Rebuilt the page against Section 8/9 of the spec. The existing build had drifted from
  the spec in two ways that acceptance criteria would have caught:
  - It used an interactive yes/no "decision tree" that dimmed/hid one submission path
    based on the visitor's answer. Section 9 requires both paths visible simultaneously
    with no gating — replaced with the static two-card layout the spec describes.
  - The EcoVadis CTA sent an email instead of opening ecovadis.com in a new tab
    (acceptance criterion 5) — fixed.
- Drafted "Why We Are Asking" body copy per Section 15 (open item, no copy was supplied
  in the interview). Builder should review before deployment.
- Linked "View Document" and "View Policy" directly to the real PDFs now in `docs/`
  (`The_Corporate_Supplier_Code_of_Conduct_2026.pdf`,
  `The_Corporate_Global_Environmental_Policy.pdf`) instead of leaving them as `#`.
- Added `netlify.toml` (`publish = "."`) so the static root deploys cleanly.

## Acceptance criteria (Section 13)

| # | What to verify | Status |
|---|---|---|
| 1 | All 7 content sections render in order | Done |
| 2 | Brand identity applied correctly | Done |
| 3 | Stats row shows all 4 figures | Done |
| 4 | "Supplier Programme 2026" pill is Pattern A | Done |
| 5 | EcoVadis button opens ecovadis.com in a new tab | Done |
| 6 | Download button triggers the XLSX download | Done |
| 7 | Contact EHS mailto pre-fills recipient/subject | Done |
| 8 | Timeline shows all 4 steps in order | Done |
| 9 | Responsive below 768px, no horizontal overflow | Done |
| 10 | Deploys to Netlify, live URL works | Pending — needs an actual Netlify deploy |

## Open items (Section 15)

- [ ] Confirm whether Netlify MCP is connected, or connect the repo to Netlify manually.
- [ ] Confirm the deployed URL once live.
- [ ] Builder to review the drafted "Why We Are Asking" copy before go-live.
- [ ] `the-corporate-brand` skill file was never provided — brand rules were applied
  directly from `product-spec.md` Section 10 instead. Add the skill file to
  `.claude/skills/` if/when it's supplied.

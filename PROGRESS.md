# PROGRESS — The Corporate Supplier Sustainability Portal 2026

> Claude Code: read this file at the start of every session, before touching
> anything. Update it at every save point. Replace content — do not append.
> History lives in git.

**Session:** 2 — v1.2 build complete, pending deploy
**Last updated:** 2 September 2026 — by Claude Code (session 2)
**Live URL:** none confirmed yet — Netlify deploy status was never verified after session 1

## Current state
Landing page live as `index.html`. All v1.1 sections unchanged (Nav, Hero, Why We Are Asking, What Happens Next, Key Resources, Footer). The "Two Routes" section's Full Questionnaire card now shows all three v1.2 actions: "Download Blank Questionnaire" (unchanged static download), "Fill Out Online" (opens the new Guided Form overlay), "Upload Completed File" (opens the new Upload & Review overlay). EcoVadis card is untouched. Both new overlays are built and tested end-to-end locally with Playwright (see Build decisions): 7-section wizard sourced from `js/questionnaire-data.js`, a declaration step, a shared Review screen with per-section Edit links, upload parsing for both .xlsx and .csv with SECTION+QUESTION-text row matching, client-side generation of a completed XLSX matching the source workbook's structure, and a shared Confirmation screen. SheetJS is self-hosted at `js/vendor/xlsx.full.min.js` (not CDN-loaded) so the site has no runtime dependency on a third-party script host. Not yet deployed to Netlify this session.

## Last session
2026-09-02 (Session 2) — Built the v1.2 revision end-to-end: extracted the master question list programmatically from `assets/The_Corporate_Supplier_Questionnaire_2026.xlsx` into `js/questionnaire-data.js`; built the Guided Form wizard, Upload & Review flow, shared Review/Confirmation screens, and client-side XLSX export in `js/app.js`; updated the Full Questionnaire card to three actions; added overlay CSS respecting all brand rules (no third Acid Lime use, square corners, no shadows). Verified locally with a headless-browser test pass: validation blocking, section navigation, Edit-from-Review, .xlsx and .csv upload with out-of-order/unrecognised rows, bad-file-type error path, generated-file structure (spot-checked with openpyxl), zero network requests during any of the three flows, and no horizontal overflow at a 375px viewport. Not yet deployed.

## Remaining work
- [ ] Deploy this build to Netlify via MCP and confirm the live URL loads on desktop and mobile (criterion 17)
- [ ] Builder: review the "Why We Are Asking" copy (carried over from session 1)
- [ ] Builder: review the dropdown defaults, esp. the 3 questions with "Partial / In Progress" (spec Section 9/15)
- [ ] Builder: confirm the declaration step assumption (signatory name + date) is wanted (spec Section 15) — proceeded with it per the spec's own instruction to do so absent objection
- [ ] Full acceptance-criteria pass against the live deployed URL (local testing covered criteria 1–16; 17 needs the live URL)

## Build decisions
- SheetJS (xlsx@0.18.5, full.min build) is self-hosted at `js/vendor/xlsx.full.min.js` instead of loaded from a CDN — this sandbox's network policy blocked the jsdelivr CDN during local testing, and self-hosting removes any runtime dependency on a third-party script host being reachable, which is a stronger fit for a tool that must work with zero external network dependency for its data flows anyway.
- Guided Form / Upload & Review question text is extracted from the source workbook once (at build time, by Claude Code reading the .xlsx directly) into `js/questionnaire-data.js`, rather than fetched by the browser at runtime — this guarantees zero network requests fire from the overlays (Hard Rule / acceptance criterion 14) while still keeping the question data traceable to the workbook rather than hand-typed into a spec. If the workbook changes, re-extract this file in a future session — do not hand-edit question text without checking the workbook first.
- The workbook's only `Conditional`-type row is the S1 EcoVadis-scorecard-link field, which is excluded from both new flows per spec Section 8 (a visitor reaches these flows only by having no scorecard). No other row in the workbook is typed `Conditional` — the PFAS substitution-roadmap question used as the spec's illustrative example is actually typed `Open-Ended` in the workbook and is treated as always-required, per the Hard Rule that field types come from the workbook, not from the spec's prose. No conditional-trigger logic was built since no active field needs it; add it if the workbook adds a real `Conditional` row.
- The completed export replicates the source workbook's row layout exactly except the two excluded S1 EcoVadis-bypass rows (workbook rows 8–9) are omitted entirely, since neither new flow ever collects that data — columns and section order are otherwise identical.
- The PFAS auto-flag note (workbook row 19, NOTES/EVIDENCE column) is carried into the generated file unconditionally, matching how it exists in the static blank workbook today — it does not react to the supplier's actual PFAS answer, per spec ("no live effect in this build").
- The workbook's declaration row (row 43) has label text in the NOTES/EVIDENCE-area columns rather than separate value cells, so the generated file appends the supplier's typed name/date directly after each label in the same cell (e.g. "Authorised Signatory Name: Jane Doe") to keep the column structure identical while still carrying the data.
- Upload & Review and the Guided Form share one overlay element and one Review-screen renderer in `js/app.js`, switched by a `mode` flag, rather than duplicating the review markup/logic per flow.

## Known issues
- No brand skill file (the-corporate-brand) has ever been supplied — brand rules are applied directly from product-spec.md Section 10 instead; install it per First Session Setup if it's supplied later.
- Dropdown answer options for 3 questions (SBTi target, Human Rights Policy alignment, conflict-minerals/3TG policy) were defaulted by the Tool Architect to include a "Partial / In Progress" option — builder should review before deployment (spec Section 9).
- The Guided Form's declaration step (signatory name + date) is an assumption carried from the spec (Section 15), not an explicit builder confirmation — confirm before or during the build.
- Live Netlify URL has never been confirmed reachable since v1.1 — verify on next deploy.

## Notes for next session
None.

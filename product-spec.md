# Product Spec — The Corporate Supplier Sustainability Portal 2026

**Version:** 1.2
**Date:** 2 September 2026
**Author:** Zyad Hatquai
**Status:** Confirmed

---

## Section 1 — Tool Summary

**Tool name:** The Corporate Supplier Sustainability Portal 2026

**What it does:** A single-page public landing page that onboards Tier 1 suppliers into The Corporate's ESRS-aligned sustainability assessment programme. It communicates the company's net-zero targets, explains the two submission paths, and routes each supplier to the correct action. Suppliers with a valid EcoVadis scorecard go to ecovadis.com as before. Suppliers without one can now complete the full ESRS questionnaire in three ways: download the blank Excel and return it however they already do today, fill it in online through a guided step-by-step form, or upload a completed Excel/CSV and have the tool read it back to them for review — all three end with the supplier downloading a completed file to send in by email themselves.

**Who uses it:** Tier 1 supplier contacts — sustainability managers, EHS leads, and procurement representatives at supplier organisations — who receive the URL directly from The Corporate's procurement or EHS team.

**Why it exists:** To formally launch The Corporate's 2026 supplier sustainability assessment without requiring direct explanation from the internal team, and to make the full questionnaire genuinely easier to complete — instead of only a blank Excel to fill in unassisted, suppliers get a guided online alternative and a way to double-check an offline-completed file before they send it in.

**Build status:** Iteration — previous version (v1.1, built 2 September 2026) was a static routing page: two always-visible cards (EcoVadis link, blank Excel download), no data entry, no file processing of any kind. This build (v1.2) adds two new ways to complete the full questionnaire — an online guided form and an upload-and-review flow — while leaving the EcoVadis path untouched. Nothing is sent or stored by the tool: this is a deliberate MVP scope while the underlying database and an internal review tool are still future work (see Section 12).

---

## Section 2 — Classification

### Data Model

**Decision:** D2 — Session

| Label | What it means | This tool? |
|-------|--------------|-----------|
| D1 — Hardcoded | All data is written into the code by the developer. Users cannot input anything that persists. The tool displays what the developer put in. | No |
| D2 — Session | Data enters the tool during use and disappears when the tab closes. No database. Covers both uploaded files and form inputs. | Yes |
| D3 — Persisted | Data is written to a database and survives after the session ends. Supabase is required. | No |

**Reason:** Suppliers now type answers into a guided form, or upload a completed Excel/CSV that the tool reads and displays for review. That data is used entirely inside the browser — to render the form, populate the review screen, and generate a completed export file — and is never sent to or stored on a server. The supplier downloads the completed file themselves and emails it in, exactly like today's manual process, just with an easier way to fill it in or double-check it first. Persisting submissions in a database is a deliberate next phase, not part of this build (see Section 12).

**D3 triggers — none apply, by explicit choice for this build:**
- [ ] Data must be retrievable after the session ends
- [ ] Multiple sessions contribute to the same dataset
- [ ] An audit trail or history is needed
- [ ] Data submitted by one person must be visible to another
- [ ] Results must be accessible via a URL after the session ends
- [ ] Files uploaded by users must be stored and retrievable later

> All six of these would in fact become true once the planned internal review tool is built — that is exactly why it is specced as a separate, later, Tier 2 build rather than folded into this one.

---

### Access Model

**Decision:** A1 — Public

| Label | What it means | This tool? |
|-------|--------------|-----------|
| A1 — Public | Anyone with the URL can use it. No login, no account required. | Yes |
| A2 — Authentication | Users must log in. All logged-in users see the same thing and have the same permissions. | No |
| A3 — Authorization | Users must log in and have different roles. Different roles see different data or have different permissions. | No |

**Reason:** Unchanged from v1.1 — the page is distributed to Tier 1 suppliers as a direct link. No account or login is required, and this build does not change that: confirmed explicitly in the interview that the new online form and upload flow must stay login-free.

---

### Tier

**Tier:** 1

| Tier | D+A combination | Stack | Deployment |
|------|----------------|-------|------------|
| 1 | D1+A1 or D2+A1 | Netlify only | Netlify |
| 2 | D3+A1 | Netlify + Supabase (no auth) | Netlify |
| 3 | D3+A2 or D3+A3 | Netlify + Supabase (auth + RLS) | Netlify |

D2 + A1 = Tier 1. No new infrastructure — this stays Netlify-only, same as today.

---

### Standalone or Stack

**This tool is:** Standalone for this build — it has no database and shares nothing with any other tool.

> A companion internal tool (an EHS/procurement dashboard for reviewing submissions) has been explicitly named as the intended next step, once this tool's data model moves to D3 with a Supabase project behind it. That would make this a two-tool stack sharing one Supabase project. It is out of scope for this spec — see Section 12 — and will be specced as its own build once this MVP has validated the online-fill and upload experience.

---

## Section 3 — Arms

### AI API Arm

**Active:** No

---

### Export Arm

**Active:** Yes

| Detail | Answer |
|--------|--------|
| Format | XLSX |
| What is exported | Two things. (1) Unchanged: the blank `The_Corporate_Supplier_Questionnaire_2026.xlsx` static asset, served for direct download exactly as in v1.1. (2) New: a completed version of that same workbook — same sections, same columns — generated entirely in the browser (no server call) and populated with the supplier's answers, whether typed into the guided form or read from an uploaded file and confirmed on the review screen. The supplier downloads this completed file and sends it to sustainability@thecorporate.com themselves, the same way they would today. |
| PDF design intent | N/A — format is XLSX only |

---

### Email Arm

**Active:** No

> Explicitly ruled out for this build. Nothing is sent automatically by the tool. The existing "Contact EHS" mailto link is unchanged and is not a triggered arm — it is a passive link the supplier can choose to click, same as v1.1. Automated email delivery of completed submissions is deferred to a future iteration alongside database persistence (see Section 12).

---

### Scheduled Automation Arm

**Active:** No

---

## Section 4 — Stack and Deployment

### All Tiers

| Detail | Answer |
|--------|--------|
| Frontend framework | HTML/CSS/JS — kept consistent with the existing v1.1 build. The new guided form and upload/review flow add real interactivity, but it is bounded (a fixed multi-step form, client-side file parsing and generation) and does not warrant migrating the whole single-page site to a framework. Claude Code should add this functionality with vanilla JS plus a client-side spreadsheet library (e.g. SheetJS/xlsx.js, loaded from a CDN or bundled) for reading and writing the XLSX/CSV files — no backend, no build step. |
| Deployment target | Netlify |
| Netlify MCP | Active — Netlify is connected via Claude Desktop Connectors. Claude Code will deploy automatically. |

**GitHub — pre-build requirement:**
The builder uploads this spec to the GitHub repo root (this repo already exists: `Ani-greenfriend/Supplier-Engagement-Portal-Dev`). Claude Code commits changes regularly and pushes to main. It does not create or configure the repo.

### CONDITIONAL: Supabase project

N/A — this build is Tier 1. No Supabase project is created or used.

---

## Section 5 — Data Architecture

N/A — Data Model is D2, not D3. There is no database and no schema. All data the supplier enters or uploads exists only in their browser during that visit, and in the completed file they download and control themselves. Nothing is written anywhere by the tool.

---

## Section 6 — Access and Permissions

N/A — Access Model is A1. No authentication, no roles, no RLS.

---

## Section 7 — GDPR

**GDPR outcome:** Not applicable — confirmed during the interview.

The guided form and the upload/review screen do involve personal-ish fields (contact name, company name, contact email, as carried over from the existing questionnaire's Section 1) plus company-level operational data (emissions figures, policies, etc.). However, this framework's GDPR trigger is tied specifically to server-side storage (D3): this tool never transmits or stores any of that data anywhere — it exists only in the supplier's own browser during their visit, and in the file they download and choose what to do with. There is no database, no upload endpoint, and no server processing of any kind. Once the tool moves to D3 (see Section 12 — the future internal review tool), the GDPR consent framework must be revisited at that point, since data would then be persisted and reviewed by someone other than the supplier.

---

## Section 8 — Screen and UI Structure

> Structural note: this tool remains a single scrolling landing page with no new URL routes. The guided form and the upload-and-review flow are both presented as an in-page overlay/modal that opens on top of the landing page, with a clear close/back control returning to it — consistent with v1.1's "single scrolling view" design intent, just with two new self-contained flows layered on top.

### Landing Page (unchanged sections)

Nav bar, Hero, "Why We Are Asking", "What Happens Next" timeline, "Key Resources", and Footer are all unchanged from v1.1 — see the v1.1 spec content for full detail. Only the "Two Routes. One Destination." section changes, below.

### Section: Two Routes. One Destination. (updated)

- **Purpose:** Route Tier 1 suppliers to the correct submission path — unchanged in intent, expanded in how the questionnaire path can be completed.
- **What is visible:** Two cards, side by side (stacks on mobile), unchanged layout pattern:
  - **Card 1 — EcoVadis Scorecard:** Completely unchanged from v1.1. Label "ECOVADIS SCORECARD", explanatory copy, one primary CTA button "Submit EcoVadis Scorecard" that opens `https://ecovadis.com` in a new tab (`target="_blank" rel="noopener noreferrer"`).
  - **Card 2 — Full Questionnaire:** Label "FULL QUESTIONNAIRE", updated copy explaining there are now three ways to complete it, and three buttons:
    1. **"Download Blank Questionnaire"** (secondary style) — unchanged from v1.1: downloads `assets/The_Corporate_Supplier_Questionnaire_2026.xlsx` via a plain anchor with the `download` attribute.
    2. **"Fill Out Online"** (primary style, new) — opens the Guided Form overlay described below.
    3. **"Upload Completed File"** (secondary style, new) — opens the Upload & Review overlay described below.
- **User actions:** Click any of the three Card 2 buttons; click "Submit EcoVadis Scorecard" (unchanged).
- **What happens next:** Download starts immediately (button 1); an overlay opens in-page (buttons 2 and 3); no page navigation occurs, and both cards stay visible and clickable regardless of what the visitor selects — no path is hidden, dimmed, or gated based on any prior choice, consistent with v1.1's non-gating rule.

### Overlay: Guided Form (new)

- **Purpose:** Let a supplier complete the full ESRS questionnaire online, section by section, without needing Excel.
- **What is visible:** A step-by-step form mirroring the seven sections of `assets/The_Corporate_Supplier_Questionnaire_2026.xlsx` — Claude Code reads that workbook directly (columns: SECTION, ESRS REF, TYPE, QUESTION/METRIC) as the single source of truth for the exact question text, order, and field type, rather than having the questions retyped into this spec. This keeps the questionnaire content and the guided form from drifting apart if the workbook is ever revised. The seven sections, in order:
  1. General Information (from S1 — legal name/country and primary contact fields only; the EcoVadis-bypass question and its conditional link field are **not** repeated here, since the visitor already reached this form by having no scorecard)
  2. Climate & Decarbonisation (S2 / ESRS E1)
  3. Pollution & PFAS (S3 / ESRS E2)
  4. Water & Marine Resources (S4 / ESRS E3)
  5. Circular Economy & Waste (S5 / ESRS E5)
  6. Biodiversity & Ecosystems (S6 / ESRS E4)
  7. Social, Labour & Governance (S7 / ESRS S2, G1)
  - A progress indicator (e.g. "Section 3 of 7") and Back/Next navigation.
  - After section 7: a **declaration step** — typed authorised-signatory name and date, mirroring the workbook's closing declaration row (row 43). Flagged in Section 15 as an assumption for the builder to confirm.
  - After the declaration step: a **Review screen** listing every answer grouped by section, with an Edit link back into each section, before the final Submit.
- **User actions:** Fill in each field (see Section 9 for field-type-to-control mapping and validation), move Back/Next between sections, edit any answer from the Review screen, click "Submit" on the Review screen, close the overlay at any point (answers are lost on close — no draft-saving, consistent with D2).
- **What happens next:** Clicking Submit on the Review screen generates the completed XLSX (see Export Arm) in the browser, triggers its download, and shows the Confirmation screen described below.

### Overlay: Upload & Review (new)

- **Purpose:** Let a supplier who already completed the questionnaire offline (the downloaded blank Excel, filled in) upload it and see their answers read back before sending it in — a chance to catch mistakes, not a data-entry flow.
- **What is visible:** A file upload control accepting `.xlsx` or `.csv` (matching the same column structure as the source workbook: SECTION, ESRS REF, TYPE, QUESTION/METRIC, SUPPLIER RESPONSE, NOTES/EVIDENCE, STATUS). After a file is selected, the tool parses it in the browser (same client-side library as the Export arm — nothing is uploaded to a server) and shows the same section-by-section Review screen as the Guided Form flow, pre-filled from the uploaded file, with every field still editable.
- **User actions:** Choose a file; if parsing fails or the file doesn't match the expected structure, see a clear on-screen error and either re-upload or switch to "Fill Out Online" instead; edit any pre-filled answer; click "Confirm & Download" once satisfied.
- **What happens next:** Same as the Guided Form — generates the completed XLSX, triggers its download, and shows the Confirmation screen.

### Confirmation Screen (shared by both new flows)

- **Purpose:** Confirm the download happened and tell the supplier exactly what to do next, since the tool cannot send anything on their behalf.
- **What is visible:** A short confirmation message in The Corporate's brand voice, along the lines of: "Your completed questionnaire has downloaded. Please email the file to sustainability@thecorporate.com to complete your submission." A reminder that they should check the file before sending. A close/return-to-portal control.
- **User actions:** Close the overlay and return to the landing page.
- **What happens next:** No further tool action — the supplier sends the email themselves, exactly as in v1.1's manual process.

---

## Section 9 — Logic and Calculations

This tool does not score or calculate anything. Its logic is entirely about field types, validation, and reading/writing spreadsheet files client-side.

**Field-type-to-control mapping** (from the workbook's TYPE column):

| Workbook TYPE | Form control | Required? |
|---|---|---|
| Required | Single-line text input | Always |
| Dropdown | Select dropdown | Always |
| Conditional | Same control as it would otherwise be, shown/required only when its triggering answer requires it (e.g. the PFAS substitution-roadmap question only appears if "Does your organisation use PFAS?" = Yes) | Only when triggered |
| Quantitative | Number input, with the unit shown in the field label (e.g. "metric tonnes CO₂e") | Always |
| Open-Ended | Multi-line textarea | Always |

**Dropdown answer options** — the workbook does not list explicit option lists, so the architect interview set these defaults; the builder should review before deployment (see Section 15):
- Most Dropdown questions (PFAS use, high-water-stress location, protected-area proximity, human-rights due diligence conducted) default to **Yes / No**.
- Three questions get a third **Partial / In Progress** option, since a binary answer would misrepresent a common real answer: SBTi-validated decarbonisation target (S2), Human Rights and Labour Rights Policy aligned with the UN Guiding Principles (S7), and the verified conflict-minerals (3TG) policy (S7).

**Upload-parsing logic:** Each row of the uploaded file is matched back to the master question list (read from the same source workbook) by SECTION plus the exact QUESTION/METRIC text, not by row position — this keeps matching correct even if the supplier reordered or added rows. Unrecognised rows (e.g. a supplier's own extra notes) are ignored, not surfaced as errors. Missing required answers are highlighted on the Review screen and block "Confirm & Download" until filled in, identical to the Guided Form's own validation.

**Edge cases:**
- Wrong file type or a file that doesn't parse → clear on-screen error; supplier can re-upload or switch to "Fill Out Online".
- Required field left blank (either flow) → Review screen highlights it and blocks the final download until resolved.
- The PFAS "auto-flag" note in the workbook ("⚠ triggers PFAS Risk review") has no live effect in this build — there is no reviewer to notify. It is preserved only as a visual flag inside the generated completed file, matching how it exists in the static workbook today. Live flagging/alerting is deferred to the future internal review tool (Section 12).

---

## Section 10 — Brand and Visual Direction

**Brand reference:** No brand skill file has been supplied (unchanged from v1.1 — this was an open item then and remains one now). Brand rules are applied directly from this section, as they were in v1.1.

**Visual feel:** Corporate minimalism — restraint over decoration. Precise, direct, composed, authoritative. No gradients, no shadows, no rounded corners. Unchanged from v1.1.

**Key brand rules Claude Code must enforce throughout, including on the new overlays:**
- Fonts: Playfair Display (headlines), DM Sans 300 (body), DM Sans 500 (labels/emphasis) — Google Fonts CDN.
- Colours: Ink (#000000), Stone (#B6B09F), Linen (#EAE4D5), Chalk (#F2F2F2), White (#FFFFFF), Acid Lime (#C8F135).
- Acid Lime: maximum 2 uses per page, always against #000000 — already spent on the hero eyebrow and the timeline step numbers; the new overlays must not introduce a third use.
- Square corners everywhere (`border-radius: 0`), no shadows, no gradients — including form fields, buttons, and the overlay container itself.
- No blue links — underline + Ink colour only.
- Copy: short declarative sentences, active voice, no exclamation points, no emoji — including validation messages and the confirmation screen.

---

## Section 11 — API and Credentials

This tool requires no external services and no API keys. All spreadsheet reading and writing happens client-side in the browser via a JS library (e.g. SheetJS/xlsx.js) loaded from a CDN or bundled with the site — no server, no environment variable, no credential.

| Service | What it does | Key required | Where stored |
|---------|-------------|-------------|-------------|
| None | — | — | — |

**Credentials readiness:** Nothing to prepare before the build session.

---

## Section 12 — Out of Scope — Phase 2

| Deferred feature | Reason it is deferred |
|-----------------|----------------------|
| Persisting submissions in a database, plus an internal review tool for EHS/procurement to browse them (who's submitted, who hasn't, PFAS flags, etc.) | Explicit next step named by the builder — validate the online-fill and upload experience first; this becomes a Tier 2/3 companion tool sharing a future Supabase project |
| Automated email sending of completed submissions | Requires the Email arm and a backend function; deferred alongside persistence — for now suppliers send the file themselves, as they do today |
| Live/automatic flagging (e.g. the PFAS auto-flag) reaching a reviewer | Requires a reviewer-facing tool and persisted data; not possible without a backend |
| Automated EcoVadis scorecard validation | Requires EcoVadis API access; deferred pending API availability (carried over from v1.0/v1.1) |
| Submission tracker — % of Tier 1 suppliers who have responded | Requires persisted data and a supplier roster; deferred to the internal review tool |
| Supplier login and saved progress across visits | Moves the tool to Tier 3; deferred to a future build iteration (carried over from v1.0/v1.1) |
| EcoVadis scorecard upload or email-based submission | Considered during scoping; the builder confirmed the EcoVadis path stays exactly as it is today (opens ecovadis.com) — not part of this build |

---

## Section 13 — Acceptance Criteria

| # | What to verify | Expected result | Done? |
|---|---------------|-----------------|-------|
| 1 | Landing page unchanged sections still render correctly | Hero, Why We Are Asking, Timeline, Key Resources, Footer — identical to v1.1, no regressions | [ ] |
| 2 | EcoVadis card is completely unchanged | "Submit EcoVadis Scorecard" opens https://ecovadis.com in a new tab; copy and styling identical to v1.1 | [ ] |
| 3 | Full Questionnaire card shows all three actions | "Download Blank Questionnaire", "Fill Out Online", and "Upload Completed File" all visible and correctly styled (one primary, two secondary) | [ ] |
| 4 | Blank download still works | Clicking "Download Blank Questionnaire" downloads the unmodified static XLSX asset, unchanged from v1.1 | [ ] |
| 5 | Guided Form covers all 7 sections in the correct order | Section content, order, and field types match `assets/The_Corporate_Supplier_Questionnaire_2026.xlsx` exactly | [ ] |
| 6 | Guided Form validation blocks incomplete submission | Review screen highlights any blank Required/Dropdown/Quantitative/Open-Ended/triggered-Conditional field and blocks download until resolved | [ ] |
| 7 | Guided Form Review screen allows editing before submit | Every answer is editable from the Review screen via a per-section Edit link | [ ] |
| 8 | Upload & Review accepts both .xlsx and .csv | Both formats parse correctly when they match the expected column structure | [ ] |
| 9 | Upload & Review handles a bad file gracefully | An unparseable or wrong-structure file shows a clear on-screen error, does not crash, and offers the Guided Form as an alternative | [ ] |
| 10 | Upload & Review correctly matches rows to questions | Answers land under the correct section/question even if the uploaded file's row order differs from the source workbook | [ ] |
| 11 | Both new flows generate a correctly completed XLSX on submit | Downloaded file matches the source workbook's structure with the supplier's answers populated in the SUPPLIER RESPONSE column | [ ] |
| 12 | Confirmation screen appears after both flows | Message matches Section 8 intent, brand voice, and includes the "email it to sustainability@thecorporate.com" instruction | [ ] |
| 13 | No path is ever hidden or gated | Both Two Routes cards, and all three Card 2 buttons, remain visible and clickable regardless of any prior selection in an overlay | [ ] |
| 14 | No network requests fire from the new flows | Browser devtools network tab shows no requests triggered by form input, file upload, or the completed-file download — confirms D2, nothing is transmitted | [ ] |
| 15 | Brand rules hold inside the new overlays | Square corners, correct fonts/colours, Acid Lime still used at most twice across the whole page including overlays | [ ] |
| 16 | Page remains fully responsive, including the new overlays | Guided Form and Upload & Review are usable and legible on viewports below 768px, no horizontal overflow | [ ] |
| 17 | Tool deploys to Netlify and is accessible at the live URL | Live URL loads correctly on desktop and mobile; existing acceptance criteria 1–10 from v1.1 remain true | [ ] |

---

## Section 14 — Build Path

**This tool's tier:** Tier 1

---

### Pre-build steps — complete these before opening Claude Code

- [x] Tool Architect skill — interview complete, this spec is written and confirmed by the builder
- [ ] Project Governor skill — CLAUDE.md and PROGRESS.md updated from this spec
- [x] GitHub repo already exists: `Ani-greenfriend/Supplier-Engagement-Portal-Dev`
- [ ] This updated product-spec.md committed to the GitHub repo root
- [ ] CLAUDE.md and PROGRESS.md updated in the GitHub repo root (via Project Governor)
- [x] Netlify already connected (Netlify MCP active)
- [x] No credentials to prepare for this tool

---

### Tier 1 — build session

- [ ] Open Claude Code in the project folder (GitHub repo connected to Netlify)
- [ ] Claude Code reads this product-spec.md, the updated CLAUDE.md, and PROGRESS.md
- [ ] Claude Code reads `assets/The_Corporate_Supplier_Questionnaire_2026.xlsx` directly to source the guided form's question text, order, and field types
- [ ] Claude Code builds the Guided Form and Upload & Review overlays plus the updated Full Questionnaire card, per Section 8
- [ ] Claude Code implements client-side XLSX/CSV parsing and generation (no backend)
- [ ] Test locally before deploying — confirm no network requests fire from either new flow
- [ ] Claude Code sets environment variables (none needed) and deploys automatically (Netlify MCP active)

---

## Section 15 — Open Questions

| Question | Who answers it | Blocking? |
|----------|---------------|-----------|
| Dropdown answer options were defaulted by the architect (mostly Yes/No, three questions with an added Partial/In Progress option) — see Section 9 | Builder — review before deployment | No — Claude Code proceeds with the defaults, flagged for review |
| Exact wording of the Confirmation screen message and the guided form's declaration step | Claude Code drafts following The Corporate brand voice; builder reviews before deployment | No — Claude Code resolves during build |
| Whether the workbook's closing declaration (signatory name + date) should be a required step in the Guided Form, as assumed in Section 8 | Builder — confirm before or during the build session | No — Claude Code proceeds with the assumption unless told otherwise |
| Which JS library Claude Code uses for client-side XLSX/CSV read/write | Claude Code — technical implementation choice, no product impact | No |
| When persistence (D3) and the internal review tool are ready to be specced | Builder — run Tool Architect again when ready | No — tracked in Section 12 |

---

## Section 16 — Tool Version History

| Version | Date | What changed in the tool |
|---------|------|--------------------------|
| v1.0 | 12 June 2026 | Retroactive spec of the existing supplier onboarding landing page (supplier_onboarding.html). Spec created to establish Project Governor and Claude Code session compatibility. |
| v1.1 | 2 September 2026 | First Tier 1 build session. Renamed the page to `index.html` and moved static assets into `assets/` and `docs/`. Replaced an interactive yes/no decision-tree UI with the static two-card layout Section 8/9 specified — the decision tree gated/dimmed one submission path based on the visitor's answer, which was explicitly prohibited at the time. Fixed the EcoVadis CTA to open `https://ecovadis.com` in a new tab. Drafted the "Why We Are Asking" copy and linked "View Document"/"View Policy" to the real PDFs now in `docs/`. Added `netlify.toml`, `CLAUDE.md`, and `PROGRESS.md`. |
| v1.2 | 2 September 2026 | Added two new ways to complete the full questionnaire: an online guided form mirroring the Excel's 7 sections, and an upload-and-review flow that reads a completed Excel/CSV back to the supplier before they download and send it in. Data model moved from D1 (hardcoded) to D2 (session — no database, nothing persisted or transmitted). Export arm expanded to generate a completed XLSX client-side. EcoVadis card and all other v1.1 sections are unchanged. Database persistence and an internal review tool for EHS/procurement were explicitly scoped out as the next iteration. |

---

*This spec is written for Claude Code. It assumes zero prior context. Every decision, rule, and requirement must be explicit enough that the builder can hand this document to Claude Code without a single verbal explanation.*

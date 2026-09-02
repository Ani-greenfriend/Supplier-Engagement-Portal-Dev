# The Corporate Supplier Sustainability Portal 2026

## Identity
Public single-page landing page that onboards Tier 1 suppliers into The Corporate's 2026 ESRS/CSRD supplier sustainability assessment, accessed via a direct link with no login.
Tier: 1 — public page, no database, nothing persists after the browser tab closes (D2+A1)
Spec version governed: v1.2 — the version of docs/product-spec.md these rules were derived from.
Position: Standalone — no database, shares nothing with any other tool. A future internal review tool (Tier 2/3) is planned to eventually share a Supabase project with this one once persistence is added; it does not exist yet and this file does not govern it.

## Session Protocol
At the start of every session:
1. Pull the latest from main before reading anything else.
2. Check docs/product-spec.md: if its version is newer than the "Spec version governed" line in this file, STOP. Tell the builder: "The spec has changed since this CLAUDE.md was written — re-run the Project Governor on the revised spec before building, or these rules may contradict it." Do not build against a stale CLAUDE.md.
3. Read PROGRESS.md in the project root — it is the current state of this build. If it is missing, recreate it with the structure at the end of this section, then continue.
4. Increment the session number and update the date in PROGRESS.md.
5. If "Notes for next session" has content: repeat the notes back to the builder, treat them as this session's priorities, then clear the section.
6. First Session Setup already ran in a prior session (docs/ and assets/ exist, netlify.toml is in place) — do not repeat it.

Save point — after completing any module, feature, or fix:
1. Update PROGRESS.md: current state, remaining work, build decisions, known issues.
2. Commit and push to main.
3. Tell the builder in one line: "Save point committed: [what changed]."
Do not start the next piece of work before the save point is pushed. Never end a session without one — an ending session is a save point.

PROGRESS.md structure (for the recreate rule): status header (Session / Last updated / Live URL), Current state, Last session (3–5 lines, replace each session), Remaining work (shrinking checklist), Build decisions (one line each), Known issues, Notes for next session.

## Commands
```
npx serve .
```

## Tech Stack
HTML · CSS · JavaScript · Netlify
Deployment: GitHub → Netlify, auto-deploys from main. Netlify MCP is active — create the site, set environment variables, and deploy via MCP.

## Arms
Export — browser only, no server function — blank XLSX download (unchanged), plus a client-side-generated completed XLSX populated from the Guided Form or Upload & Review answers, matching the source workbook's structure exactly (columns and section order).

## Hard Rules
- This tool has no external services and no API keys. Do not add any backend call, database, or credential without first updating product-spec.md — that would change the tier.
- No path is ever hidden, dimmed, or gated based on a prior user choice: the EcoVadis card and all three Full Questionnaire actions (download, fill out online, upload) stay visible and clickable at all times (spec Section 8). A gated decision-tree UI was explicitly removed from an earlier build — do not reintroduce one.
- No network requests of any kind fire from the Guided Form or Upload & Review flows. All file reading and writing happens client-side in the browser. This is what keeps the tool D2 (session-only) instead of D3 — do not add a fetch/XHR call for this data under any circumstance.
- Guided Form and Upload & Review question text, order, and field types are read directly from assets/The_Corporate_Supplier_Questionnaire_2026.xlsx at build time — do not hand-type or duplicate the questions elsewhere. If the workbook changes, the forms must follow it.
- The EcoVadis card's behavior is unchanged and out of scope for this revision: "Submit EcoVadis Scorecard" opens https://ecovadis.com in a new tab. Do not add an email option, file upload, or any other change to this card.

## Brand
No brand skill yet. These inline rules apply until one is added to the repo (then install it per First Session Setup and defer to it):
- Background: #F2F2F2 (Chalk) · Accent: #C8F135 (Acid Lime — max 2 uses per page, always against #000000, never on a light background) · Font: Playfair Display (headlines, 700), DM Sans (body 300, labels/emphasis 500)
- No drop shadows. Square corners only — border-radius: 0 everywhere, including form fields and the new overlays.
- Full palette: Ink #000000, Stone #B6B09F, Linen #EAE4D5, Chalk #F2F2F2, White #FFFFFF, Acid Lime #C8F135. No blue links — underline + Ink colour only.

## Business Rules
- Field-type mapping (from the workbook's TYPE column): "Required" → single-line text input; "Dropdown" → select; "Conditional" → same control as its target field, shown/required only when its trigger condition is met; "Quantitative" → number input with the unit shown in the label; "Open-Ended" → multi-line textarea. All are required except Conditional fields, which are required only when triggered.
- Dropdown defaults: Yes/No for most questions; add a third "Partial / In Progress" option for the SBTi target question, the Human Rights Policy alignment question, and the conflict-minerals (3TG) policy question (spec Section 9) — flagged for builder review before deployment.
- Upload & Review matches uploaded rows to the master question list by SECTION plus exact QUESTION/METRIC text, not row position. Unrecognised rows (e.g. extra supplier notes) are ignored, not surfaced as errors.
- Both Guided Form and Upload & Review block the final "Submit"/"Confirm & Download" until every Required/Dropdown/Quantitative/Open-Ended field, and every triggered Conditional field, has an answer.
- The Guided Form's General Information section covers only the workbook's S1 legal-name/country and contact fields — it does not repeat the EcoVadis-bypass question, since the visitor already reached this form by having no scorecard.
- The workbook's PFAS "auto-flag" note has no live effect in this build (there is no reviewer yet) — preserve it only as a visual flag inside the generated completed file.
- The Guided Form's final step before Submit is a typed declaration (signatory name + date) mirroring the workbook's closing declaration row — this is an assumption from the spec (Section 15); confirm with the builder before or during the build.
- Both new flows end on a shared Confirmation screen instructing the supplier to email the downloaded file to sustainability@thecorporate.com — the tool never sends anything itself.

Out of scope — do not build:
- Persisting submissions to a database, or any internal review dashboard for EHS/procurement — planned as a separate future Tier 2/3 tool
- Automated email sending of submissions — no Email arm this round
- Live/automatic flagging (e.g. PFAS) reaching a reviewer
- Automated EcoVadis scorecard validation via API
- A submission tracker showing % of suppliers responded
- Supplier login or saved progress across visits
- Any change to the EcoVadis card's behavior (upload, email submission, etc.)

## Reference Docs
Read before building the related part:
- docs/product-spec.md — full module specs, UI sections, logic, arm detail (v1.2)
- assets/The_Corporate_Supplier_Questionnaire_2026.xlsx — source of truth for the Guided Form and Upload & Review question text, order, and field types
PROGRESS.md in the root is read at every session start per the Session Protocol.

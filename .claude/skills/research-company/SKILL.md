---
name: research-company
description: Research a Chinese biotech company and produce or update its entry in data/companies.json with verified facts and source citations. Use when the user wants to add a new "major player" to the dashboard, or upgrade an existing draft (verified:false) entry to verified.
---

# Research a company

Generate or update a verified `Company` record from web research.

## When to use

- User says "research <company>" or "/research-company <id>"
- User asks to upgrade a draft (`verified: false`) entry to verified
- User asks to add a new player to the "Major players" dashboard

## Inputs

- A company `id` (kebab-case, matching companies.json) OR a new company name
- Optional hints from the user (e.g. "focus on the 2021 STAR listing", "verify the Merck deal value")

## Required reading before starting

- `lib/types.ts` — confirm the current `Company` and `Source` schemas
- `data/companies.json` — current entry if it exists (preserve user-curated fields)
- `data/chapters.json` — chapter IDs you'll use to build the per-chapter timeline
- `data/companies.json` BeiGene entry as the canonical example of "verified" depth

## Workflow

### 1. Locate or create the entry

Read `data/companies.json`. If the id exists, treat it as an upgrade — keep the existing `id`, `category`, and any user-customized fields. If not, append a new record at the end of the array.

### 2. Run parallel research (one batch)

Issue several `WebSearch` calls in parallel, one per dimension. Always include the company's English name in every query. Tailor queries to the current year (use the `currentDate` value in context, not your training cutoff).

Suggested dimensions:

- **Identity & founding**: `<name> founders history founding year headquarters`
- **Listings & IPO**: `<name> NASDAQ HKEX 18A STAR Market IPO listing dates raise`
- **Latest financials**: `<name> 2025 annual revenue market cap full year results`
- **Lead asset**: `<name> lead drug FDA EMA NMPA approval indications status`
- **Major deals**: `<name> partnership license-out deal value`
- **Recent strategic moves**: `<name> rebrand redomicile BIOSECURE 2024 2025`
- **Pipeline**: `<name> pipeline Phase 3 readouts approved drugs`

### 3. Cross-reference primary sources

For Tier 1 companies (BeiGene/BeOne, WuXi AppTec, Hengrui, Innovent, Akeso, Legend, Zai Lab, Insilico, Kelun, BGI), follow up with `WebFetch` on:

- Company investor-relations page
- Most recent earnings press release (BusinessWire / GlobeNewswire / company IR)
- SEC filings (10-K for US listers, 20-F for ADRs)
- HKEX filings — use `hkexnews.hk` paths
- Wikipedia as a sanity check, never as a primary source

For Tier 2/3, three or four searches usually suffice.

### 4. Synthesize into the schema

Fill the `Company` object exactly per `lib/types.ts`. Conventions:

- **Name**: use the most commonly recognized English name. If the company has rebranded (BeiGene → BeOne), use `Old / New` form so historical chapters still parse for readers.
- **nameZh**: include the canonical 中文 name.
- **headquarters**: dot-separated city list if multi-HQ (e.g. `Basel · Beijing · Cambridge MA`).
- **founders**: comma-separated, full names (with middle initial if used in filings).
- **shortDescription**: one factual sentence — the company's role in the China biotech story.
- **narrativeHook**: one or two sentences for *why this company matters* — pulled out as a quote-style line in the tooltip. Earn it.
- **today**: snapshot dated in `asOf` (YYYY-MM). Numbers should be from the most recent reported full year (use `revenueYear` to disambiguate from `asOf`). `approvedDrugCount` should count internally-discovered approved drugs, not in-licensed commercial products.
- **listings**: format as `EXCHANGE: TICKER` (e.g. `NASDAQ: ONC`).
- **modalities**: pick from {`small molecule`, `monoclonal antibody`, `bispecific`, `ADC`, `CAR-T`, `gene therapy`, `mRNA`, `oligonucleotide`}.
- **leadAsset.status**: include market count and most recent revenue if known (`Approved in 75 markets; $2.6B FY2024 revenue`).
- **biggestDeal**: include partner, type, year, valueBillions if disclosed. If headline is in another currency, convert to USD.

### 5. Build the timeline

Map company milestones to current chapter IDs. Read `data/chapters.json` to get the canonical list. Each timeline entry has `chapterId`, `status`, `approvedDrugCount`, optional `pipelineStage`, optional `listings`, optional `note`.

Common mappings (current chapter IDs as of 2026-04):

- `republican-foundations` (1917–1949), `insulin-and-artemisinin` (1949–1978) — only relevant if the company traces lineage to a Republican-era institution (rare).
- `reform-and-opening` (1978–1998) — state-origin firms (Sinopharm, Hengrui originals).
- `platforms-and-parks` — pre-2010 buildup (BGI, WuXi AppTec, Sinovac, CanSino founding).
- `innovator-generation` (2010–2014) — most innovator founding years (BeiGene, Innovent, Junshi, Akeso, Zai Lab, Legend).
- `bi-jingquan-bigbang` (2015–2016) — first IPOs after 722 self-inspection; WuXi Biologics spinoff.
- `harmonisation-and-hong-kong` (2017–2018) — HK 18A wave + Amgen-style strategic deals.
- `first-american-approvals` (2019–2020) — Brukinsa, Carvykti, COVID-era vaccine scaling.
- `procurement-and-value` (2021–2022) — STAR listings, NRDL/VBP impact, ADC platforms maturing.
- `going-global` (2023–2024) — license-out boom, ADC mega-deals, Phase 3 readouts.
- `frontier-era` (2025–2026) — BeOne rebrand, BIOSECURE Act, AI-discovery readouts.

A company doesn't need a timeline entry for every chapter — only the chapters where something noteworthy happened to it.

### 6. Collect sources

Build a `sources` array of every URL you actually used as evidence (not every URL that came up in search). Each entry:

```json
{
  "title": "Page title — short version",
  "publisher": "Publisher / domain",
  "url": "https://...",
  "accessedDate": "YYYY-MM-DD"
}
```

Order sources by relevance (most-cited first). Aim for 6–12 sources per Tier 1 entry, 3–5 for Tier 2/3.

Prefer:
- Company press releases and IR filings (BusinessWire, GlobeNewswire, company IR pages)
- Regulator pages (FDA, EMA, NMPA)
- SEC and HKEX filings
- Reputable trade press (Endpoints News, FiercePharma, BioPharma Dive, BioSpace, Reuters)

Avoid as primary citations:
- Wikipedia (use as a sanity check only)
- Anonymous blog posts
- LinkedIn profiles
- Press-release wire services without an identified primary source

### 7. Mark verification status

- `verified: true` — every required field was confirmed against at least one primary or reputable secondary source. `lastVerified` set to today's date (YYYY-MM-DD).
- `verified: false` (no `lastVerified`) — incomplete; some fields couldn't be confirmed. Add a `// TODO` note in the user-facing report listing what's missing. The tooltip footer will render this entry as red "Unverified — research pending".

Never use `verified: true` if any required field is a guess.

### 8. Write the entry

Use `Edit` on `data/companies.json` to update or insert the record. Preserve JSON formatting conventions (2-space indent, trailing newline). Don't use `Write` — that would risk clobbering other entries.

After writing, run `npx tsc --noEmit` from the project root to verify the entry parses cleanly.

### 9. Report to the user

Write a short summary in chat:

- Headline: company name + verification status
- Bullet list of the most important verified facts
- Bullet list of anything you couldn't confirm (and why)
- Sources section as a markdown bulleted list of `[title](url)` pairs
- One-line suggestion of the next company that would benefit from the same depth, if applicable

Do not paste the full JSON entry back to the user — they can read it in the file.

## Constraints

- **Never invent numbers.** If you can't confirm a value from a source, set the field to `null` (or omit it from JSON if the type allows) and list it in your report under "could not confirm".
- **Always include `accessedDate`** — financial figures change.
- **Don't overwrite user-curated fields silently.** If the existing record has data you'd change, surface the diff in the report and ask before overwriting (`shortDescription`, `narrativeHook`, `category` are the most likely to be user-customized).
- **Use `currentDate` from context** for `accessedDate` and `lastVerified` — don't use your training cutoff.

## Example invocation

```
/research-company beigene
```

Reads existing BeiGene record, runs ~6 parallel WebSearch calls, follows up with WebFetch on 2–3 IR pages, fills the schema, sets `verified: true`, writes 8 sources, type-checks, reports back.

## Update cadence

Re-run the skill on a company when:
- `lastVerified` is more than 6 months old (financial data drifts)
- A major event happened (FDA approval, mega-deal, IPO, rebrand)
- The user asks for a refresh

When updating, preserve the existing `timeline` entries that pre-date the refresh — only add or amend the most recent entries.

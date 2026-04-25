---
name: research-reform
description: Research a Chinese regulatory reform and produce or update its entry in data/reforms.json with verified facts, plain-language descriptions, and source citations. Use when the user wants to add a new reform to the timeline, or upgrade an existing thin entry to the full tooltip schema.
---

# Research a regulatory reform

Generate or update a verified `Reform` record from web research. The hard part is **not** finding the document — most Chinese reforms have law-firm explainers in English. The hard part is rewriting it in plain language.

## When to use

- User says "research <reform>" or "/research-reform <id>"
- User asks to upgrade a thin reform entry (only `name`, `date`, `category`, `shortDescription`, `impact`) to the full schema
- User adds a new reform to `reforms.json`

## Inputs

- A reform `id` (kebab-case, matching reforms.json) OR a new reform name
- Optional hints (e.g. "verify the effective date", "list the companies that listed under it")

## Required reading before starting

- `lib/types.ts` — the `Reform` type (note which fields are optional)
- `data/reforms.json` — current entry if it exists; preserve user-curated fields
- `data/reforms.json` `hk-18a` entry — the canonical "fully verified" example
- `data/companies.json` — needed for the `affectedCompanyIds` field
- `data/citations.json` — global citation registry (shared with company tooltips and `[[cite:id]]` markers)
- `data/chapters.json` — to understand which chapter the reform fits in narratively

## Workflow

### 1. Locate or create the entry

Read `data/reforms.json`. If the id exists, treat it as an upgrade — keep the existing `id`, `category`, and any user-customized fields. If not, append a new record at the end.

### 2. Run parallel research (one batch)

Issue several `WebSearch` calls in parallel. Tailor queries to the reform's domain.

Suggested dimensions:

- **Primary document**: `<reform name> State Council document number text`, `<reform name> 国务院 全文`
- **Issuing authority**: which body promulgated it — State Council, NMPA, NPC Standing Committee, NDRC, NHC, MOST, etc.
- **Effective date**: many Chinese reforms have a lag between issued and effective (e.g. Vaccine Administration Law: issued 2019-06, effective 2019-12)
- **Key provisions**: the 2–4 substantive rules — *not* the preamble or whereas clauses
- **Law-firm explainers**: Latham & Watkins, Ropes & Gray, Covington & Burling, Charltons, King & Wood Mallesons, Foley & Lardner — these are usually the cleanest English summaries
- **Impact analysis**: how the reform actually changed industry behavior
- **Affected companies**: which players' stories pivot on this reform

### 3. Cross-reference primary sources

Do a `WebFetch` follow-up on at least one of:

- The official Chinese government release (State Council `gov.cn`, NMPA `nmpa.gov.cn`, NPC Observer translation)
- A law-firm advisory that walks through the rule in English
- The relevant Wikipedia article (sanity check only)

For high-stakes reforms (BIOSECURE, Vaccine Administration Law, HKEX 18A, ICH accession, value-oriented oncology guideline), get **two independent law-firm advisories** to triangulate the key provisions and effective date.

### 4. Synthesize into the schema

Fill the `Reform` object exactly per `lib/types.ts`. Conventions for each field:

- **id**: kebab-case, stable. Don't rename once referenced from `chapters.json` or prose `[[reform:id|...]]` tokens.
- **name**: the most commonly used English name. Use the formal name when there's no informal handle (e.g. "HKEX Chapter 18A", "BIOSECURE Act"). Avoid acronyms in the name unless that's the primary identifier.
- **nameZh**: official Chinese name. Use the canonical wording from the issuing body's release. Skip if there's no Chinese name (e.g. "BIOSECURE Act").
- **date**: when issued (YYYY-MM, YYYY-MM-DD if specific). Match what the original press release says.
- **effectiveDate**: when it took legal effect. Set this only if it differs from `date`.
- **category**: one of `approval` (drug-review reforms), `market_access` (NRDL, VBP, pricing), `capital_markets` (HKEX, STAR, listings), `geopolitical` (BIOSECURE, sanctions, biosecurity).
- **agency**: full name of the issuing body. e.g. "State Council of the People's Republic of China", "Hong Kong Exchanges and Clearing Limited", "Standing Committee of the National People's Congress". Don't abbreviate here.
- **documentRef**: the formal document reference. Examples: "Guofa [2015] No. 44", "Order 117", "Main Board Listing Rules, Chapter 18A — Biotech Companies", "Section 851 of FY2026 NDAA".
- **shortDescription**: see "Plain-language rules" below.
- **impact**: see "Plain-language rules" below.
- **keyProvisions**: see "Plain-language rules" below.
- **affectedCompanyIds**: see step 5.
- **sources**: see step 6.
- **verified** / **lastVerified**: see step 7.

### Length budget (HARD limits — measure your output)

Each field has a strict character cap, calibrated on the canonical `hk-18a` entry. Drafts that exceed these are wrong, not "thorough" — the tooltip is dense visual real estate, and an over-long bullet renders as three lines of small text that crowds out the next field.

| Field | Cap | Shape |
|---|---|---|
| `shortDescription` | **≤120 chars** | One sentence. The "what does it do" line. |
| `impact` | **≤200 chars** | One sentence. Lead with the single most surprising number. |
| `keyProvisions` | **4 bullets, ≤80 chars each** | One rule per bullet, no parenthetical sub-clauses. |

**Count the characters before you submit.** If a draft exceeds the cap, cut — don't argue with it.

How to cut:

- **One fact per field.** If you have a second important fact, it doesn't go in the same field; push it to a different field or drop it.
- **Drop dates that aren't decisive.** "By 2023, 63 biotechs had listed" beats "by end-2023, 63 biotechs had listed under the regime, peaking at 20 IPOs in 2021." (The peak number is its own thought; pick one.)
- **Drop parenthetical asides.** `(added by the December 2017 expansion)`, `(US$1.5B)`, `(under the old Drug Administration Law)` — almost always cuttable.
- **Numbers beat adjectives.** "85% cut" beats "deeply discounted." "$1.3B fine" beats "monstrous penalty."
- **Active voice cuts ~20% length.** "Beijing froze the track in 2023" beats "the track was frozen by Beijing in 2023."
- **Drop the second clause.** Many drafts have `<headline fact>; the <second fact>` — kill the semicolon and everything after.

Worked example — bad → good:

> **`impact` (566 chars, BAD):** "WuXi AppTec sold its US and UK cell-and-gene-therapy units to Altaris (announced Dec 2024, closed 2025) and its US medical-device-testing arm to NAMSA; BeiGene re-incorporated in Switzerland as BeOne Medicines (completed May 27, 2025). Final law dropped the named-company list from earlier drafts but kept BGI, MGI, and Complete Genomics on the path to designation via the Pentagon's 1260H list."

That's four separate facts in one field. Compare:

> **`impact` (149 chars, GOOD):** "Forced WuXi to sell its US cell-and-gene-therapy units and BeiGene to redomicile in Switzerland, all months before the law's first compliance deadline."

One fact, one consequence, ≤200 chars.

### Plain-language rules (THE important part)

The tooltip is the only place a reader gets context — most readers are not securities lawyers, FDA reviewers, or China specialists. **If a sentence requires field-specific knowledge to parse, rewrite it.**

Rules of thumb:

- **No jargon without a quick gloss.** "Pre-revenue biotechs" → "biotechs that don't yet sell a drug." "Conditional approval" → "lets a drug launch on a single Phase II trial if it treats an unmet need." "MAH pilot" → "lets the company that owns a drug license its manufacture out, instead of having to build the factory itself."
- **Concrete > abstract.** "Tightened oversight of the human-genetic-resources regime" is abstract. "Required Beijing's sign-off before any Chinese DNA samples could leave the country" is concrete.
- **Numbers > adjectives.** "Significant" / "substantial" / "deeply discounted" should be replaced with the actual number whenever you have it. "Hengrui's camrelizumab cut its NRDL price by ~85% to win listing" beats "deeply discounted to win NRDL listing."
- **No legalese.** "Promulgated" → "issued." "Notwithstanding" → "even though." "Pursuant to" → "under." "Inter alia" → just remove it. If a Chinese government document uses bureaucratic phrasing, translate it into English a journalist would write.
- **Active voice.** "The State Council issued document No. 44" beats "Document No. 44 was issued by the State Council."

Specific guidance per field:

#### shortDescription (one sentence)

The "what does it do" line. A general reader, having read just this sentence, should understand the basic mechanism.

| Bad | Better |
|---|---|
| "Pre-revenue biotech listing pathway on the HKEX Main Board." | "Lets clinical-stage biotechs list in Hong Kong before they have a drug on the market." |
| "Codifies lifecycle accountability for vaccine MAHs." | "Holds vaccine companies legally responsible from R&D through every shot administered, with criminal penalties for fraud." |
| "Authorizes administrative bans on biotech firms of concern." | "Lets the US government cut off federal money — including grants and contracts — to named Chinese biotech firms." |

#### impact (one or two sentences)

The "why it mattered" line. What actually changed in industry behavior because of this reform? Use a measurable consequence whenever possible — number of companies it touched, dollar value moved, drugs approved, deals broken.

| Bad | Better |
|---|---|
| "Unlocked tens of billions in biotech funding overnight." | "Solved the valley-of-death financing problem for pre-revenue Chinese biotech; by end-2023, 63 biotechs had listed under the regime, peaking at 20 IPOs in 2021." |
| "Restored predictability to clinical-trial review." | "Cut the median NDA review time from 200 working days to 130, and let foreign clinical-trial data count toward Chinese approval — the change that made China-only Phase III trials viable for global filings." |

#### keyProvisions (3–5 short bullets)

The substantive rules — what the regulation actually requires. Each bullet should be a single rule, decodable on first read.

Bad: a verbatim copy of the regulation's text. Translates poorly.

Good: a paraphrase that reads like an explainer in *Endpoints News* or *FT Lex*.

Example (HKEX 18A):

```
- "At least one Core Product past the concept stage with regulatory milestones met"
- "Expected market capitalisation ≥ HK$1.5 billion at listing"
- "≥125% working capital for the next 12 months"
- "Meaningful pre-IPO investment from a 'Sophisticated Investor'"
```

The list above is *almost* good — it's accurate, but "Core Product" and "Sophisticated Investor" are HKEX terms of art the reader hasn't seen. Better:

```
- "Must have at least one drug past Phase I with formal regulator sign-off"
- "Company must be worth ≥ HK$1.5 billion (~US$190M) at listing — 3× the normal Main Board threshold"
- "Must have 125% of next-12-months operating costs in the bank at IPO"
- "Must have raised pre-IPO money from a healthcare-specialist investor (VC, big pharma, sovereign fund) who held the stake ≥6 months"
```

The HKEX terms ("Core Product", "Sophisticated Investor") are real — keep them in single quotes when you need to flag the legal definition, but always pair with a plain-language gloss.

### 5. Build the affected-companies list

Map the reform to companies in `data/companies.json` whose stories pivot on it. Use the `id` (not the name).

Examples:

- `hk-18a` → `innovent`, `junshi`, `henlius`, `beigene`, `akeso`, `everest`, `jw-therapeutics`, `imab` (the 18A IPO wave)
- `vbp` → `hengrui`, `innovent`, `junshi` (PD-1 firms hit hardest by volume-based procurement)
- `biosecure-enacted` → `wuxi-apptec`, `wuxi-bio`, `bgi`, `beigene` (named on 1260H or directly affected)
- `nrdl-resume` → `hengrui`, `beigene`, `innovent`, `junshi` (deep-discount wave)

Keep the list to companies the reform *materially* affected — not every Chinese biotech in the dataset. 4–10 companies is typical.

When a reform affects an entire industry but no specific subset (e.g. ICH accession affects everyone), it's OK to omit `affectedCompanyIds` rather than list all 28 companies.

### 6. Collect sources via the central registry

Citations live in `data/citations.json` as a single global registry. Do **not** invent inline source metadata.

For each source:

1. **Look it up first.** Many sources are already there — reuse the id.
2. **If new, append to `data/citations.json`.** Schema:

```json
{
  "id": "stable-kebab-case-id",
  "authors": "Latham & Watkins LLP" | "Last, F. M." | "South China Morning Post",
  "title": "Page title",
  "publisher": "Publisher / outlet",
  "year": 2024,
  "url": "https://..."
}
```

Id conventions: `<publisher-slug>-<topic>-<year>`. Examples: `lw-biosecure-becomes-law-2025`, `charltons-chapter-18a`, `nmpa-vaccine-administration-law`.

3. **On the reform entry, set `sources: string[]`** — citation ids in order of relevance. Aim for 3–5 citations per fully verified reform.

Source-quality preferences (highest trust first):

- Official Chinese government releases (gov.cn, nmpa.gov.cn, npc.gov.cn, scio.gov.cn)
- Translations from authoritative trackers (China Law Translate, NPC Observer, CSET)
- Law-firm advisories (Latham, Ropes & Gray, Covington, Charltons, King & Wood, Foley)
- Reputable trade press for impact analysis (Reuters, FT, STAT, Endpoints, FiercePharma, BioPharma Dive)

Avoid as primary citations:

- Wikipedia (sanity check only — never the only source for a non-trivial claim)
- Anonymous blog posts
- Press-release wires without an identified primary source

### 7. Mark verification status

- `verified: true` — every required field was confirmed against at least one primary or reputable secondary source. `lastVerified` set to today's date (YYYY-MM-DD, use `currentDate` from context).
- `verified: false` (no `lastVerified`) — incomplete; some fields couldn't be confirmed. The tooltip footer renders this entry as red "Unverified — research pending."

Never use `verified: true` if any required field is a guess.

### 8. Write the entry

Use `Edit` on `data/reforms.json` to update or insert the record. Preserve JSON formatting (2-space indent, trailing newline). Don't use `Write` — that would risk clobbering other entries.

After writing, run `npx tsc --noEmit` from the project root to verify the entry parses cleanly.

### 9. Report to the user

Write a short summary in chat:

- Headline: reform name + verification status
- Bullet list of the most important verified facts
- Bullet list of anything you couldn't confirm (and why)
- The full text of `shortDescription` and `impact` so the user can sanity-check the plain-language pass
- Sources section as a markdown bulleted list of `[title](url)` pairs

Do not paste the full JSON entry back to the user — they can read it in the file.

## Constraints

- **Never invent dates or document numbers.** If you can't find the exact issuing date, leave `effectiveDate` unset rather than guess.
- **Don't paste legalese.** If you find yourself copying language from the source verbatim, stop and rewrite. The tooltip is for readers, not lawyers.
- **Don't overwrite user-curated fields silently.** If the existing record has a `shortDescription` or `impact` you'd change, surface the diff in the report and ask before overwriting.
- **Use `currentDate` from context** for `lastVerified` — don't use your training cutoff.

## Example invocation

```
/research-reform vaccine-admin-law
```

Reads existing record, runs ~5 parallel WebSearch calls (NPCSC release, Covington advisory, Reuters coverage, Hogan Lovells advisory, NMPA English page), follows up with WebFetch on the NMPA release and one law firm. Fills the schema. Writes 4 sources. Sets `verified: true`. Reports the rewritten plain-language descriptions back to the user for review.

## Update cadence

Re-run the skill on a reform when:

- The reform was amended or supplemented (e.g. a new implementing regulation was issued)
- A major event re-anchored its impact (e.g. a high-profile company was sanctioned under it)
- The user asks for a refresh

Reforms are mostly stable — they don't drift like company financials. Most entries won't need re-verification more than once.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useNarrative } from "@/lib/narrativeStore";
import companiesData from "@/data/companies.json";
import type {
  Company,
  CompanyCategory,
  CompanyTimelineEntry,
} from "@/lib/types";
import Tooltip from "@/components/Tooltip";
import { getCitation } from "@/lib/citations";

const HOVER_GRACE_MS = 200;

const CATEGORY_ORDER: CompanyCategory[] = [
  "pharma",
  "mnc_pharma",
  "platform",
  "investor",
  "academic",
  "hospital",
  "regulator",
  "exchange",
];

const companies = companiesData as Company[];

const CATEGORY_LABEL: Record<CompanyCategory, string> = {
  pharma: "Chinese pharma",
  mnc_pharma: "MNC pharma",
  platform: "Platform",
  investor: "Investor",
  academic: "Academic",
  hospital: "Hospital",
  regulator: "Regulator",
  exchange: "Exchange",
};

const CATEGORY_COLOR: Record<CompanyCategory, string> = {
  pharma: "var(--color-accent)",
  mnc_pharma: "#2a4868",
  platform: "#2c5d3f",
  investor: "#b08530",
  academic: "#a4543a",
  hospital: "#4a7a7a",
  regulator: "#6b3a5a",
  exchange: "#4a525a",
};

type Hovered = { rect: DOMRect; company: Company; fromProse?: boolean };

export default function CompanyGrid() {
  const activeIds = useNarrative(
    (s) => s.chapters[s.currentIndex].activeCompanyIds,
  );
  const currentChapter = useNarrative(
    (s) => s.chapters[s.currentIndex],
  );
  const highlightedEntity = useNarrative((s) => s.highlightedEntity);
  const proseHighlightedId =
    highlightedEntity?.type === "company" ? highlightedEntity.id : null;
  const activeSet = new Set(activeIds);
  const [hovered, setHovered] = useState<Hovered | null>(null);
  const tileRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelHide = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };
  const scheduleHide = () => {
    cancelHide();
    hideTimer.current = setTimeout(() => setHovered(null), HOVER_GRACE_MS);
  };

  useEffect(() => {
    if (!proseHighlightedId) {
      setHovered((prev) => (prev?.fromProse ? null : prev));
      return;
    }
    const el = tileRefs.current.get(proseHighlightedId);
    const company = companies.find((c) => c.id === proseHighlightedId);
    if (!el || !company) return;
    cancelHide();
    setHovered({
      rect: el.getBoundingClientRect(),
      company,
      fromProse: true,
    });
  }, [proseHighlightedId]);

  const byCategory = useMemo(() => {
    const map = new Map<CompanyCategory, Company[]>();
    for (const c of companies) {
      if (!map.has(c.category)) map.set(c.category, []);
      map.get(c.category)!.push(c);
    }
    return map;
  }, []);

  return (
    <section className="space-y-2">
      <header className="flex items-baseline justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[--color-muted]">
          Major players
        </h3>
        <span className="num text-xs text-[--color-muted]">
          {activeIds.length} / {companies.length}
        </span>
      </header>
      <div>
        {CATEGORY_ORDER.map((cat) => {
          const list = byCategory.get(cat);
          if (!list || list.length === 0) return null;
          const activeInCat = list.filter((c) => activeSet.has(c.id)).length;
          return (
            <div
              key={cat}
              className="grid grid-cols-[5.5rem_1.5rem_1fr] items-center gap-x-1.5 py-px"
            >
              <span
                className="truncate text-[9px] font-medium uppercase tracking-wider leading-none"
                style={{ color: CATEGORY_COLOR[cat] }}
                title={CATEGORY_LABEL[cat]}
              >
                {CATEGORY_LABEL[cat]}
              </span>
              <span className="num text-right text-[9px] leading-none text-[--color-muted]">
                {activeInCat}/{list.length}
              </span>
              <div className="flex flex-wrap gap-[3px]">
                {list.map((c) => {
                  const isActive = activeSet.has(c.id);
                  const isHighlighted = hovered?.company.id === c.id;
                  const color = CATEGORY_COLOR[c.category];
                  return (
                    <div
                      key={c.id}
                      ref={(el) => {
                        if (el) tileRefs.current.set(c.id, el);
                        else tileRefs.current.delete(c.id);
                      }}
                      onMouseEnter={(e) => {
                        cancelHide();
                        setHovered({
                          rect: e.currentTarget.getBoundingClientRect(),
                          company: c,
                        });
                      }}
                      onMouseLeave={scheduleHide}
                      className="h-2.5 w-2.5 rounded-[2px] transition-shadow"
                      style={{
                        backgroundColor: isActive ? color : "transparent",
                        border: `1px solid ${
                          isActive ? color : "var(--color-rule)"
                        }`,
                        boxShadow: isHighlighted
                          ? `0 0 6px 2px ${color}`
                          : undefined,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <Tooltip
        show={!!hovered}
        anchorRect={hovered?.rect ?? null}
        onMouseEnter={cancelHide}
        onMouseLeave={scheduleHide}
      >
        {hovered ? (
          <CompanyTooltip
            company={hovered.company}
            isActive={activeSet.has(hovered.company.id)}
            chapterId={currentChapter.id}
            chapterDate={currentChapter.date}
          />
        ) : null}
      </Tooltip>
    </section>
  );
}

function CompanyTooltip({
  company,
  isActive,
  chapterId,
  chapterDate,
}: {
  company: Company;
  isActive: boolean;
  chapterId: string;
  chapterDate: string;
}) {
  const t = company.today;
  const timelineEntry = company.timeline?.find((e) => e.chapterId === chapterId);

  return (
    <div className="space-y-2">
      <Identity company={company} />
      <CategoryRow company={company} />

      {isActive && timelineEntry && (
        <Section label={`As of ${chapterDate}`}>
          <TimelineBlock entry={timelineEntry} />
        </Section>
      )}

      {t && (
        <Section label={`Today (${t.asOf})`}>
          <TodayBlock today={t} />
        </Section>
      )}

      {t?.leadAsset && (
        <Section label="Lead asset">
          <LeadAssetBlock asset={t.leadAsset} />
        </Section>
      )}

      {(company.modalities?.length || company.productClasses?.length || company.therapeuticAreas?.length) && (
        <Section label="What they make">
          <PlatformBlock company={company} />
        </Section>
      )}

      {t?.biggestDeal && (
        <Section label="Largest deal">
          <DealBlock deal={t.biggestDeal} />
        </Section>
      )}

      {!company.today && (
        <div className="text-[--color-fg]">{company.shortDescription}</div>
      )}
      {!company.today && company.signature && (
        <div className="text-[--color-muted]">
          <span className="text-[10px] uppercase tracking-wider">
            Signature:
          </span>{" "}
          {company.signature}
        </div>
      )}

      {company.narrativeHook && (
        <p className="border-l-2 border-[--color-accent] pl-2 italic text-[--color-fg]">
          {company.narrativeHook}
        </p>
      )}

      {company.sources && company.sources.length > 0 && (
        <Section label={`Sources (${company.sources.length})`}>
          <SourceList ids={company.sources} />
        </Section>
      )}

      <VerificationFooter company={company} />
    </div>
  );
}

function Identity({ company }: { company: Company }) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-semibold text-[--color-fg]">
          {company.name}
          {company.nameZh ? (
            <span className="ml-1.5 text-[--color-muted]">
              {company.nameZh}
            </span>
          ) : null}
        </span>
        <span className="num text-[10px] text-[--color-muted]">
          founded {company.founded}
        </span>
      </div>
      {(company.headquarters || company.founders) && (
        <div className="text-[10px] text-[--color-muted]">
          {company.headquarters && <>{company.headquarters}</>}
          {company.headquarters && company.founders && <> · </>}
          {company.founders && <>by {company.founders}</>}
        </div>
      )}
    </div>
  );
}

function CategoryRow({ company }: { company: Company }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[--color-muted]">
      <span
        aria-hidden
        className="inline-block h-2 w-2 rounded-[2px]"
        style={{ backgroundColor: CATEGORY_COLOR[company.category] }}
      />
      {CATEGORY_LABEL[company.category]}
      {company.subcategory && (
        <>
          <span aria-hidden className="text-[--color-rule]">·</span>
          <span className="text-[--color-fg]">{company.subcategory}</span>
        </>
      )}
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-0.5 border-t border-[--color-rule] pt-1.5">
      <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[--color-muted]">
        {label}
      </div>
      <div className="text-[--color-fg]">{children}</div>
    </div>
  );
}

function TimelineBlock({
  entry,
}: {
  entry: CompanyTimelineEntry | undefined;
}) {
  if (!entry) {
    return <span className="italic text-[--color-muted]">No data yet.</span>;
  }
  return (
    <div className="space-y-0.5">
      {entry.status && <div>{entry.status}</div>}
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-[--color-muted]">
        {entry.approvedDrugCount !== undefined && (
          <span>
            <span className="num text-[--color-fg]">
              {entry.approvedDrugCount}
            </span>{" "}
            approved
          </span>
        )}
        {entry.pipelineStage && <span>{entry.pipelineStage}</span>}
        {entry.listings && entry.listings.length > 0 && (
          <span>{entry.listings.join(" · ")}</span>
        )}
      </div>
      {entry.note && (
        <div className="text-[10px] italic text-[--color-muted]">
          {entry.note}
        </div>
      )}
    </div>
  );
}

function TodayBlock({ today }: { today: NonNullable<Company["today"]> }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]">
      {today.marketCapBillions !== undefined && (
        <Stat label="Market cap" value={`$${today.marketCapBillions}B`} />
      )}
      {today.revenueBillions !== undefined && (
        <Stat
          label={`Revenue ${today.revenueYear ?? ""}`.trim()}
          value={`$${today.revenueBillions}B`}
        />
      )}
      {today.approvedDrugCount !== undefined && (
        <Stat label="Approved drugs" value={String(today.approvedDrugCount)} />
      )}
      {today.listings && today.listings.length > 0 && (
        <Stat label="Listed" value={today.listings.join(" · ")} />
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  full,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <div className="text-[9px] uppercase tracking-wider text-[--color-muted]">
        {label}
      </div>
      <div className="num text-[--color-fg]">{value}</div>
    </div>
  );
}

const MODALITY_LABEL: Record<string, string> = {
  smallMol: "Small molecule",
  peptide: "Peptide",
  recombinant: "Recombinant protein",
  biosimilar: "Biosimilar",
  novelMab: "Monoclonal antibody",
  bispecific: "Bispecific antibody",
  adc: "ADC",
  vaccine: "Vaccine",
  cellTherapy: "Cell therapy",
  nucleicAcid: "Nucleic acid (mRNA/oligonucleotide)",
  geneTherapy: "Gene therapy",
  radiopharm: "Radiopharmaceutical",
};

const STATUS_LABEL: Record<string, string> = {
  approved: "approved",
  phase3: "Ph3",
  phase2: "Ph2",
  phase1: "Ph1",
  preclinical: "preclin",
};

function PlatformBlock({ company }: { company: Company }) {
  return (
    <div className="space-y-1">
      {company.modalities && company.modalities.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {company.modalities.map((m) => (
            <span
              key={m}
              className="rounded-sm border border-[--color-rule] px-1.5 py-0.5 text-[10px] text-[--color-fg]"
            >
              {MODALITY_LABEL[m] ?? m}
            </span>
          ))}
        </div>
      )}
      {company.therapeuticAreas && company.therapeuticAreas.length > 0 && (
        <div className="text-[10px] text-[--color-muted]">
          <span className="uppercase tracking-wider">TA:</span>{" "}
          {company.therapeuticAreas.join(" · ")}
        </div>
      )}
      {company.productClasses && company.productClasses.length > 0 && (
        <ul className="space-y-0.5 text-[10px]">
          {company.productClasses.map((p, i) => (
            <li
              key={`${p.name}-${i}`}
              className="flex items-baseline justify-between gap-2"
            >
              <span className="text-[--color-fg]">{p.name}</span>
              {p.status && (
                <span className="num text-[--color-muted]">
                  {STATUS_LABEL[p.status] ?? p.status}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LeadAssetBlock({
  asset,
}: {
  asset: NonNullable<NonNullable<Company["today"]>["leadAsset"]>;
}) {
  return (
    <div className="space-y-0.5">
      <div className="font-medium text-[--color-fg]">{asset.name}</div>
      {asset.mechanism && (
        <div className="text-[10px] text-[--color-muted]">
          {asset.mechanism}
          {asset.indication ? ` · ${asset.indication}` : ""}
        </div>
      )}
      {asset.status && (
        <div className="text-[10px] italic text-[--color-muted]">
          {asset.status}
        </div>
      )}
    </div>
  );
}

function DealBlock({
  deal,
}: {
  deal: NonNullable<NonNullable<Company["today"]>["biggestDeal"]>;
}) {
  return (
    <div className="text-[10px]">
      <span className="text-[--color-fg]">{deal.partner}</span>{" "}
      <span className="text-[--color-muted]">
        · {deal.type} · {deal.year}
      </span>
      {deal.valueBillions !== undefined && (
        <span className="num text-[--color-fg]">
          {" "}
          · ${deal.valueBillions}B
        </span>
      )}
    </div>
  );
}

function SourceList({ ids }: { ids: string[] }) {
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] leading-tight">
      {ids.map((id) => {
        const found = getCitation(id);
        if (!found) {
          return (
            <span
              key={id}
              className="num text-[--color-accent]"
              title={`Missing citation: ${id}`}
            >
              [?]
            </span>
          );
        }
        const { citation, index } = found;
        return (
          <a
            key={id}
            href={`#cite-${citation.id}`}
            title={`${citation.authors}, "${citation.title}" (${citation.year})`}
            className="num font-medium text-[--color-accent] no-underline hover:underline"
          >
            [{index + 1}]
          </a>
        );
      })}
    </div>
  );
}

function VerificationFooter({ company }: { company: Company }) {
  if (company.verified === true) return null;
  return (
    <div className="border-t border-[--color-rule] pt-1.5 text-[9px] uppercase tracking-wider text-[--color-accent]">
      Unverified — research pending
    </div>
  );
}


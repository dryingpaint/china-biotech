"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useNarrative } from "@/lib/narrativeStore";
import { entities } from "@/lib/entities";
import type {
  Entity,
  EntityCategory,
  EntityTimelineEntry,
} from "@/lib/types";
import Tooltip from "@/components/Tooltip";
import { getCitation } from "@/lib/citations";

const HOVER_GRACE_MS = 200;
const EMPTY_IDS: string[] = [];

const CATEGORY_ORDER: EntityCategory[] = [
  "pharma",
  "mnc_pharma",
  "platform",
  "investor",
  "academic",
  "hospital",
  "regulator",
  "exchange",
];

const CATEGORY_LABEL: Record<EntityCategory, string> = {
  pharma: "Chinese pharma",
  mnc_pharma: "MNC pharma",
  platform: "Platform",
  investor: "Investor",
  academic: "Academic",
  hospital: "Hospital",
  regulator: "Regulator",
  exchange: "Exchange",
};

const CATEGORY_COLOR: Record<EntityCategory, string> = {
  pharma: "var(--color-accent)",
  mnc_pharma: "#2a4868",
  platform: "#2c5d3f",
  investor: "#b08530",
  academic: "#a4543a",
  hospital: "#4a7a7a",
  regulator: "#6b3a5a",
  exchange: "#4a525a",
};

type Hovered = { rect: DOMRect; entity: Entity; fromProse?: boolean };

export default function CompanyGrid() {
  const activeIds = useNarrative(
    (s) => s.visibleChapters[s.currentIndex]?.activeEntityIds ?? EMPTY_IDS,
  );
  const currentChapter = useNarrative(
    (s) => s.visibleChapters[s.currentIndex],
  );
  const highlightedEntity = useNarrative((s) => s.highlightedEntity);
  const proseHighlightedId =
    highlightedEntity?.type === "entity" ? highlightedEntity.id : null;
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
    const entity = entities.find((e) => e.id === proseHighlightedId);
    if (!el || !entity) return;
    cancelHide();
    setHovered({
      rect: el.getBoundingClientRect(),
      entity,
      fromProse: true,
    });
  }, [proseHighlightedId]);

  const byCategory = useMemo(() => {
    const map = new Map<EntityCategory, Entity[]>();
    for (const e of entities) {
      if (!map.has(e.category)) map.set(e.category, []);
      map.get(e.category)!.push(e);
    }
    return map;
  }, []);

  if (!currentChapter) return null;

  return (
    <section className="space-y-2">
      <header>
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[--color-muted]">
          Major players
        </h3>
      </header>
      <div>
        {CATEGORY_ORDER.map((cat) => {
          const list = byCategory.get(cat);
          if (!list || list.length === 0) return null;
          return (
            <div
              key={cat}
              className="grid grid-cols-[7rem_1fr] items-center gap-x-2 py-0.5"
            >
              <span
                className="text-[10px] font-medium uppercase tracking-wider leading-none"
                style={{ color: CATEGORY_COLOR[cat] }}
                title={CATEGORY_LABEL[cat]}
              >
                {CATEGORY_LABEL[cat]}
              </span>
              <div className="flex flex-wrap gap-[3px]">
                {list.map((e) => {
                  const isActive = activeSet.has(e.id);
                  const isHighlighted = hovered?.entity.id === e.id;
                  const color = CATEGORY_COLOR[e.category];
                  return (
                    <div
                      key={e.id}
                      ref={(el) => {
                        if (el) tileRefs.current.set(e.id, el);
                        else tileRefs.current.delete(e.id);
                      }}
                      onMouseEnter={(ev) => {
                        cancelHide();
                        setHovered({
                          rect: ev.currentTarget.getBoundingClientRect(),
                          entity: e,
                        });
                      }}
                      onMouseLeave={scheduleHide}
                      onClick={() => {
                        const span = document.querySelector(
                          `[data-entity-type="entity"][data-entity-id="${e.id}"]`,
                        );
                        if (span) {
                          span.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        }
                      }}
                      className="h-2.5 w-2.5 cursor-pointer rounded-[2px] transition-shadow"
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
          <EntityTooltip
            entity={hovered.entity}
            isActive={activeSet.has(hovered.entity.id)}
            chapterId={currentChapter.id}
            chapterDate={currentChapter.date}
          />
        ) : null}
      </Tooltip>
    </section>
  );
}

function EntityTooltip({
  entity,
  isActive,
  chapterId,
  chapterDate,
}: {
  entity: Entity;
  isActive: boolean;
  chapterId: string;
  chapterDate: string;
}) {
  const t = entity.today;
  const timelineEntry = entity.timeline?.find((e) => e.chapterId === chapterId);

  return (
    <div className="space-y-2">
      <Identity entity={entity} />
      <CategoryRow entity={entity} />

      {isActive && timelineEntry && (
        <Section label={`As of ${chapterDate}`}>
          <TimelineBlock entry={timelineEntry} category={entity.category} />
        </Section>
      )}

      {t && (
        <Section label={`Today (${t.asOf})`}>
          <TodayBlock today={t} category={entity.category} />
        </Section>
      )}

      {t?.leadAsset && (
        <Section label="Lead asset">
          <LeadAssetBlock asset={t.leadAsset} />
        </Section>
      )}

      {(entity.modalities?.length || entity.productClasses?.length || entity.therapeuticAreas?.length) && (
        <Section label="What they make">
          <PlatformBlock entity={entity} />
        </Section>
      )}

      {t?.biggestDeal && (
        <Section label="Largest deal">
          <DealBlock deal={t.biggestDeal} />
        </Section>
      )}

      {!entity.today && (
        <div className="text-[--color-fg]">{entity.shortDescription}</div>
      )}
      {!entity.today && entity.signature && (
        <div className="text-[--color-muted]">
          <span className="text-[10px] uppercase tracking-wider">
            Signature:
          </span>{" "}
          {entity.signature}
        </div>
      )}

      {entity.narrativeHook && (
        <p className="border-l-2 border-[--color-accent] pl-2 italic text-[--color-fg]">
          {entity.narrativeHook}
        </p>
      )}

      {entity.sources && entity.sources.length > 0 && (
        <Section label={`Sources (${entity.sources.length})`}>
          <SourceList ids={entity.sources} />
        </Section>
      )}

      <VerificationFooter entity={entity} />
    </div>
  );
}

function Identity({ entity }: { entity: Entity }) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-semibold text-[--color-fg]">
          {entity.name}
          {entity.nameZh ? (
            <span className="ml-1.5 text-[--color-muted]">
              {entity.nameZh}
            </span>
          ) : null}
        </span>
        {entity.founded !== undefined && (
          <span className="num text-[10px] text-[--color-muted]">
            founded {entity.founded}
          </span>
        )}
      </div>
      {(entity.headquarters || entity.founders) && (
        <div className="text-[10px] text-[--color-muted]">
          {entity.headquarters && <>{entity.headquarters}</>}
          {entity.headquarters && entity.founders && <> · </>}
          {entity.founders && <>by {entity.founders}</>}
        </div>
      )}
    </div>
  );
}

function CategoryRow({ entity }: { entity: Entity }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[--color-muted]">
      <span
        aria-hidden
        className="inline-block h-2 w-2 rounded-[2px]"
        style={{ backgroundColor: CATEGORY_COLOR[entity.category] }}
      />
      {CATEGORY_LABEL[entity.category]}
      {entity.subcategory && (
        <>
          <span aria-hidden className="text-[--color-rule]">·</span>
          <span className="text-[--color-fg]">{entity.subcategory}</span>
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
  category,
}: {
  entry: EntityTimelineEntry | undefined;
  category: EntityCategory;
}) {
  if (!entry) {
    return <span className="italic text-[--color-muted]">No data yet.</span>;
  }
  const showApprovedDrugs = category !== "platform";
  return (
    <div className="space-y-0.5">
      {entry.status && <div>{entry.status}</div>}
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-[--color-muted]">
        {showApprovedDrugs && entry.approvedDrugCount !== undefined && (
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

function TodayBlock({
  today,
  category,
}: {
  today: NonNullable<Entity["today"]>;
  category: EntityCategory;
}) {
  const showApprovedDrugs = category !== "platform";
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
      {showApprovedDrugs && today.approvedDrugCount !== undefined && (
        <Stat label="Approved drugs" value={String(today.approvedDrugCount)} />
      )}
      {today.grossMarginPct !== undefined && (
        <Stat label="Gross margin" value={`${today.grossMarginPct}%`} />
      )}
      {today.rdPctOfRevenue !== undefined && (
        <Stat label="R&D / revenue" value={`${today.rdPctOfRevenue}%`} />
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

function PlatformBlock({ entity }: { entity: Entity }) {
  return (
    <div className="space-y-1">
      {entity.modalities && entity.modalities.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {entity.modalities.map((m) => (
            <span
              key={m}
              className="rounded-sm border border-[--color-rule] px-1.5 py-0.5 text-[10px] text-[--color-fg]"
            >
              {MODALITY_LABEL[m] ?? m}
            </span>
          ))}
        </div>
      )}
      {entity.therapeuticAreas && entity.therapeuticAreas.length > 0 && (
        <div className="text-[10px] text-[--color-muted]">
          <span className="uppercase tracking-wider">TA:</span>{" "}
          {entity.therapeuticAreas.join(" · ")}
        </div>
      )}
      {entity.productClasses && entity.productClasses.length > 0 && (
        <ul className="space-y-0.5 text-[10px]">
          {entity.productClasses.map((p, i) => (
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
  asset: NonNullable<NonNullable<Entity["today"]>["leadAsset"]>;
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
  deal: NonNullable<NonNullable<Entity["today"]>["biggestDeal"]>;
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
  const unique = [...new Set(ids)];
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] leading-tight">
      {unique.map((id) => {
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

function VerificationFooter({ entity }: { entity: Entity }) {
  if (entity.verified === true) return null;
  return (
    <div className="border-t border-[--color-rule] pt-1.5 text-[9px] uppercase tracking-wider text-[--color-accent]">
      Unverified — research pending
    </div>
  );
}

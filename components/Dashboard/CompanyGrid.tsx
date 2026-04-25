"use client";

import { useState } from "react";
import { useNarrative } from "@/lib/narrativeStore";
import companiesData from "@/data/companies.json";
import type {
  Company,
  CompanyCategory,
  CompanyTimelineEntry,
} from "@/lib/types";
import Tooltip from "@/components/Tooltip";

const companies = companiesData as Company[];

const CATEGORY_LABEL: Record<CompanyCategory, string> = {
  innovator: "Innovator",
  cro_cdmo: "CRO/CDMO",
  vaccines: "Vaccines",
  genomics: "Genomics",
  traditional: "Traditional",
  adc: "ADC",
  cell_gene: "Cell & Gene",
  mrna: "mRNA",
  ai_bio: "AI bio",
};

const CATEGORY_COLOR: Record<CompanyCategory, string> = {
  innovator: "var(--color-accent)",
  cro_cdmo: "#2c5d3f",
  adc: "var(--color-gold)",
  vaccines: "#4b3a8c",
  mrna: "#7a5a3a",
  cell_gene: "#1f5f7a",
  genomics: "#5a4b8c",
  traditional: "#6b6b6b",
  ai_bio: "#8c4a6b",
};

type Hovered = { rect: DOMRect; company: Company };

export default function CompanyGrid() {
  const activeIds = useNarrative(
    (s) => s.chapters[s.currentIndex].activeCompanyIds,
  );
  const currentChapter = useNarrative(
    (s) => s.chapters[s.currentIndex],
  );
  const activeSet = new Set(activeIds);
  const [hovered, setHovered] = useState<Hovered | null>(null);

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
      <div className="flex flex-wrap gap-1">
        {companies.map((c) => {
          const isActive = activeSet.has(c.id);
          const color = CATEGORY_COLOR[c.category];
          return (
            <div
              key={c.id}
              onMouseEnter={(e) =>
                setHovered({
                  rect: e.currentTarget.getBoundingClientRect(),
                  company: c,
                })
              }
              onMouseLeave={() => setHovered(null)}
              className="h-3 w-3 rounded-[2px] transition-all"
              style={{
                backgroundColor: isActive ? color : "transparent",
                border: `1px solid ${isActive ? color : "var(--color-rule)"}`,
              }}
            />
          );
        })}
      </div>
      <CategoryLegend />
      <Tooltip show={!!hovered} anchorRect={hovered?.rect ?? null}>
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
      {today.modalities && today.modalities.length > 0 && (
        <Stat
          label="Modalities"
          value={today.modalities.join(", ")}
          full
        />
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

function VerificationFooter({ company }: { company: Company }) {
  if (company.verified === true) return null;
  return (
    <div className="border-t border-[--color-rule] pt-1.5 text-[9px] uppercase tracking-wider text-[--color-accent]">
      Unverified — research pending
    </div>
  );
}

function CategoryLegend() {
  const cats: CompanyCategory[] = [
    "innovator",
    "cro_cdmo",
    "adc",
    "vaccines",
    "mrna",
    "cell_gene",
    "genomics",
    "ai_bio",
    "traditional",
  ];
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-[10px] text-[--color-muted]">
      {cats.map((c) => (
        <span key={c} className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-[2px]"
            style={{ backgroundColor: CATEGORY_COLOR[c] }}
          />
          {CATEGORY_LABEL[c]}
        </span>
      ))}
    </div>
  );
}

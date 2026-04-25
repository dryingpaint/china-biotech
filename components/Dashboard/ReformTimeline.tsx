"use client";

import { useEffect, useRef, useState } from "react";
import { useNarrative } from "@/lib/narrativeStore";
import reformsData from "@/data/reforms.json";
import companiesData from "@/data/companies.json";
import type { Company, Reform, ReformCategory } from "@/lib/types";
import Tooltip from "@/components/Tooltip";
import { getCitation } from "@/lib/citations";

const HOVER_GRACE_MS = 200;

const reforms = reformsData as Reform[];
const companies = companiesData as Company[];
const companyById = new Map(companies.map((c) => [c.id, c]));

const sortedReforms = [...reforms].sort((a, b) => a.date.localeCompare(b.date));

const CATEGORY_COLOR: Record<ReformCategory, string> = {
  approval: "var(--color-accent)",
  market_access: "var(--color-gold)",
  capital_markets: "#2c5d3f",
  geopolitical: "#4b3a8c",
};

const CATEGORY_LABEL: Record<ReformCategory, string> = {
  approval: "Approval",
  market_access: "Market access",
  capital_markets: "Capital markets",
  geopolitical: "Geopolitical",
};

type Hovered = { rect: DOMRect; reform: Reform; fromProse?: boolean };

export default function ReformTimeline() {
  const activeIds = useNarrative(
    (s) => s.chapters[s.currentIndex].activeReformIds,
  );
  const highlightedEntity = useNarrative((s) => s.highlightedEntity);
  const proseHighlightedId =
    highlightedEntity?.type === "reform" ? highlightedEntity.id : null;
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
    const reform = reforms.find((r) => r.id === proseHighlightedId);
    if (!el || !reform) return;
    cancelHide();
    setHovered({
      rect: el.getBoundingClientRect(),
      reform,
      fromProse: true,
    });
  }, [proseHighlightedId]);

  return (
    <section className="space-y-2">
      <header className="flex items-baseline justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[--color-muted]">
          Regulatory reforms
        </h3>
        <span className="num text-xs text-[--color-muted]">
          {activeIds.length} / {reforms.length}
        </span>
      </header>
      <div className="flex flex-wrap gap-1">
        {sortedReforms.map((r) => {
          const isActive = activeSet.has(r.id);
          const isHighlighted = hovered?.reform.id === r.id;
          const color = CATEGORY_COLOR[r.category];
          return (
            <div
              key={r.id}
              ref={(el) => {
                if (el) tileRefs.current.set(r.id, el);
                else tileRefs.current.delete(r.id);
              }}
              onMouseEnter={(e) => {
                cancelHide();
                setHovered({
                  rect: e.currentTarget.getBoundingClientRect(),
                  reform: r,
                });
              }}
              onMouseLeave={scheduleHide}
              className="h-3 w-3 rounded-[2px] transition-shadow"
              style={{
                backgroundColor: isActive ? color : "transparent",
                border: `1px solid ${isActive ? color : "var(--color-rule)"}`,
                boxShadow: isHighlighted
                  ? `0 0 6px 2px ${color}`
                  : undefined,
              }}
            />
          );
        })}
      </div>
      <CategoryLegend />
      <Tooltip
        show={!!hovered}
        anchorRect={hovered?.rect ?? null}
        onMouseEnter={cancelHide}
        onMouseLeave={scheduleHide}
      >
        {hovered ? <ReformTooltip reform={hovered.reform} /> : null}
      </Tooltip>
    </section>
  );
}

function ReformTooltip({ reform }: { reform: Reform }) {
  return (
    <div className="space-y-2">
      <Identity reform={reform} />
      <CategoryRow reform={reform} />

      {(reform.agency || reform.documentRef) && (
        <Section label="Issued by">
          <AgencyBlock reform={reform} />
        </Section>
      )}

      <Section label="What it does">
        <div>{reform.shortDescription}</div>
      </Section>

      {reform.keyProvisions && reform.keyProvisions.length > 0 && (
        <Section label="Key provisions">
          <ul className="list-disc space-y-0.5 pl-4">
            {reform.keyProvisions.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </Section>
      )}

      {reform.impact && (
        <Section label="Why it mattered">
          <div>{reform.impact}</div>
        </Section>
      )}

      {reform.narrativeHook && (
        <p className="border-l-2 border-[--color-accent] pl-2 italic text-[--color-fg]">
          {reform.narrativeHook}
        </p>
      )}

      {reform.affectedCompanyIds && reform.affectedCompanyIds.length > 0 && (
        <Section label={`Affected (${reform.affectedCompanyIds.length})`}>
          <CompanyChipList ids={reform.affectedCompanyIds} />
        </Section>
      )}

      {reform.sources && reform.sources.length > 0 && (
        <Section label={`Sources (${reform.sources.length})`}>
          <SourceList ids={reform.sources} />
        </Section>
      )}

      <VerificationFooter reform={reform} />
    </div>
  );
}

function Identity({ reform }: { reform: Reform }) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-semibold text-[--color-fg]">
          {reform.name}
          {reform.nameZh ? (
            <span className="ml-1.5 text-[--color-muted]">{reform.nameZh}</span>
          ) : null}
        </span>
        <span className="num text-[10px] text-[--color-muted]">
          {formatDate(reform.date)}
        </span>
      </div>
      {reform.effectiveDate && reform.effectiveDate !== reform.date && (
        <div className="text-[10px] text-[--color-muted]">
          effective {formatDate(reform.effectiveDate)}
        </div>
      )}
    </div>
  );
}

function CategoryRow({ reform }: { reform: Reform }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[--color-muted]">
      <span
        aria-hidden
        className="inline-block h-2 w-2 rounded-sm"
        style={{ backgroundColor: CATEGORY_COLOR[reform.category] }}
      />
      {CATEGORY_LABEL[reform.category]}
    </div>
  );
}

function formatDate(d: string): string {
  const m = d.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (!m) return d;
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const month = months[parseInt(m[2], 10) - 1] ?? m[2];
  return m[3] ? `${month} ${parseInt(m[3], 10)}, ${m[1]}` : `${month} ${m[1]}`;
}

function AgencyBlock({ reform }: { reform: Reform }) {
  return (
    <div className="space-y-0.5">
      {reform.agency && <div>{reform.agency}</div>}
      {reform.documentRef && (
        <div className="text-[10px] italic text-[--color-muted]">
          {reform.documentRef}
        </div>
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

function CompanyChipList({ ids }: { ids: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {ids.map((id) => {
        const c = companyById.get(id);
        if (!c) {
          return (
            <span
              key={id}
              className="rounded border border-[--color-rule] px-1.5 py-0.5 text-[10px] text-[--color-muted]"
              title={`Unknown company: ${id}`}
            >
              {id}
            </span>
          );
        }
        return (
          <a
            key={id}
            href={`#${id}`}
            className="rounded border border-[--color-rule] px-1.5 py-0.5 text-[10px] text-[--color-fg] no-underline hover:border-[--color-accent] hover:text-[--color-accent]"
          >
            {c.name}
          </a>
        );
      })}
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

function VerificationFooter({ reform }: { reform: Reform }) {
  if (reform.verified === true) return null;
  return (
    <div className="border-t border-[--color-rule] pt-1.5 text-[9px] uppercase tracking-wider text-[--color-accent]">
      Unverified — research pending
    </div>
  );
}

function CategoryLegend() {
  const cats: ReformCategory[] = [
    "approval",
    "market_access",
    "capital_markets",
    "geopolitical",
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

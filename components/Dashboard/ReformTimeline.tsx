"use client";

import { useNarrative } from "@/lib/narrativeStore";
import reformsData from "@/data/reforms.json";
import type { Reform, ReformCategory } from "@/lib/types";

const reforms = reformsData as Reform[];

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

export default function ReformTimeline() {
  const activeIds = useNarrative(
    (s) => s.chapters[s.currentIndex].activeReformIds,
  );
  const activeSet = new Set(activeIds);

  const sorted = [...reforms].sort((a, b) => a.date.localeCompare(b.date));
  const minYear = 1985;
  const maxYear = 2026;
  const span = maxYear - minYear;

  const positionFor = (date: string) => {
    const [y, m] = date.split("-").map(Number);
    const t = y + (m - 1) / 12;
    return ((t - minYear) / span) * 100;
  };

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
      <div className="relative h-12">
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[--color-rule]" />
        {sorted.map((r) => {
          const isActive = activeSet.has(r.id);
          const left = positionFor(r.date);
          return (
            <div
              key={r.id}
              className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${left}%` }}
              title={`${r.name} (${r.date}) — ${r.impact}`}
            >
              <div
                className="h-3 w-3 rounded-sm border-2 transition-all"
                style={{
                  borderColor: isActive
                    ? CATEGORY_COLOR[r.category]
                    : "var(--color-rule)",
                  backgroundColor: isActive
                    ? CATEGORY_COLOR[r.category]
                    : "transparent",
                }}
              />
              <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-[--color-fg] px-2 py-1 text-[10px] text-[--color-bg] group-hover:block">
                {r.name}
              </div>
            </div>
          );
        })}
        <div className="num absolute bottom-0 left-0 text-[10px] text-[--color-muted]">
          {minYear}
        </div>
        <div className="num absolute bottom-0 right-0 text-[10px] text-[--color-muted]">
          {maxYear}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[--color-muted]">
        {(Object.keys(CATEGORY_LABEL) as ReformCategory[]).map((c) => (
          <span key={c} className="inline-flex items-center gap-1">
            <span
              aria-hidden
              className="inline-block h-2 w-2 rounded-sm"
              style={{ backgroundColor: CATEGORY_COLOR[c] }}
            />
            {CATEGORY_LABEL[c]}
          </span>
        ))}
      </div>
    </section>
  );
}

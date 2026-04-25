"use client";

import { useEffect, useRef, useState } from "react";
import { useNarrative } from "@/lib/narrativeStore";
import reformsData from "@/data/reforms.json";
import type { Reform, ReformCategory } from "@/lib/types";
import Tooltip from "@/components/Tooltip";

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

  useEffect(() => {
    if (!proseHighlightedId) {
      setHovered((prev) => (prev?.fromProse ? null : prev));
      return;
    }
    const el = tileRefs.current.get(proseHighlightedId);
    const reform = reforms.find((r) => r.id === proseHighlightedId);
    if (!el || !reform) return;
    setHovered({
      rect: el.getBoundingClientRect(),
      reform,
      fromProse: true,
    });
  }, [proseHighlightedId]);

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
          const isProseHighlighted = proseHighlightedId === r.id;
          const left = positionFor(r.date);
          return (
            <div
              key={r.id}
              ref={(el) => {
                if (el) tileRefs.current.set(r.id, el);
                else tileRefs.current.delete(r.id);
              }}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${left}%`,
                zIndex: isProseHighlighted ? 5 : undefined,
              }}
              onMouseEnter={(e) =>
                setHovered({
                  rect: e.currentTarget.getBoundingClientRect(),
                  reform: r,
                })
              }
              onMouseLeave={() => setHovered(null)}
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
                  transform: isProseHighlighted ? "scale(1.8)" : undefined,
                  boxShadow: isProseHighlighted
                    ? `0 0 0 2px var(--color-bg), 0 0 0 3px ${CATEGORY_COLOR[r.category]}`
                    : undefined,
                }}
              />
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
      <Tooltip show={!!hovered} anchorRect={hovered?.rect ?? null}>
        {hovered ? (
          <ReformTooltip
            reform={hovered.reform}
            isActive={activeSet.has(hovered.reform.id)}
          />
        ) : null}
      </Tooltip>
    </section>
  );
}

function ReformTooltip({
  reform,
  isActive,
}: {
  reform: Reform;
  isActive: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-semibold text-[--color-fg]">{reform.name}</span>
        <span className="num text-[10px] text-[--color-muted]">
          {reform.date}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[--color-muted]">
        <span
          aria-hidden
          className="inline-block h-2 w-2 rounded-sm"
          style={{ backgroundColor: CATEGORY_COLOR[reform.category] }}
        />
        {CATEGORY_LABEL[reform.category]}
        {!isActive ? (
          <span className="ml-1 italic">— not yet enacted</span>
        ) : null}
      </div>
      <div className="text-[--color-fg]">{reform.shortDescription}</div>
      {reform.impact ? (
        <div className="text-[--color-muted]">
          <span className="text-[10px] uppercase tracking-wider">Impact:</span>{" "}
          {reform.impact}
        </div>
      ) : null}
    </div>
  );
}

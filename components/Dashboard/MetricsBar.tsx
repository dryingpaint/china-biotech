"use client";

import { useNarrative } from "@/lib/narrativeStore";
import type { ChapterMetrics } from "@/lib/types";
import Sparkline from "./Sparkline";
import Cite from "@/components/Cite";

type Row = {
  key: "pipeline" | "inLicensing" | "outLicensing" | "primaryMarket";
  label: string;
  color: string;
  source: string;
  citeId: string;
  getValue: (m: ChapterMetrics) => number;
  prefix?: string;
  unit: string;
  barMode: "share" | "magnitude";
};

const ROWS: Row[] = [
  {
    key: "pipeline",
    label: "China-originated pipeline",
    color: "var(--color-accent)",
    source: "IQVIA Global Trends in R&D 2025",
    citeId: "iqvia-global-rd-2025",
    getValue: (m) => m.pipelineSharePct,
    unit: "%",
    barMode: "share",
  },
  {
    key: "inLicensing",
    label: "China share of big-pharma in-licensing",
    color: "var(--color-gold)",
    source: "GlobalData / Jefferies",
    citeId: "globaldata-china-licensing-2024",
    getValue: (m) => m.inLicensingSharePct,
    unit: "%",
    barMode: "share",
  },
  {
    key: "outLicensing",
    label: "Out-licensing deal value, $B/yr",
    color: "var(--color-accent)",
    source: "GlobalData / SCMP out-licensing tracker",
    citeId: "scmp-china-out-licensing-2025",
    getValue: (m) => m.outLicensingDealValueBn ?? 0,
    prefix: "$",
    unit: "B",
    barMode: "magnitude",
  },
  {
    key: "primaryMarket",
    label: "Primary-market financing, $B/yr",
    color: "var(--color-gold)",
    source: "BioPharma APAC China financing tracker",
    citeId: "biopharmaapac-china-h1-2025",
    getValue: (m) => m.primaryMarketFinancingBn ?? 0,
    prefix: "$",
    unit: "B",
    barMode: "magnitude",
  },
];

export default function MetricsBar() {
  const chapters = useNarrative((s) => s.visibleChapters);
  const idx = useNarrative((s) => s.currentIndex);
  const current = chapters[idx];
  if (!current) return null;

  const renderRow = (row: Row) => {
    const series = chapters.map((c) => row.getValue(c.metrics));
    const value = row.getValue(current.metrics);
    const seriesMax = Math.max(...series, 1);
    const barPct = row.barMode === "share" ? value : (value / seriesMax) * 100;
    const display = `${row.prefix ?? ""}${value}${row.unit}`;

    return (
      <article key={row.key} className="space-y-1.5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[10px] uppercase tracking-[0.16em] text-[--color-muted]">
            {row.label}
          </span>
          <span
            className="num text-2xl font-medium leading-none"
            style={{ color: row.color }}
          >
            {row.prefix ?? ""}
            {value}
            <span className="ml-0.5 text-sm font-normal text-[--color-muted]">
              {row.unit}
            </span>
          </span>
        </div>
        <SoloBar pct={barPct} color={row.color} ariaLabel={`${row.label}: ${display}`} />
        <Sparkline values={series} currentIndex={idx} color={row.color} />
        <p className="text-[10px] tracking-wide text-[--color-muted]">
          {row.source} <Cite id={row.citeId} />
        </p>
      </article>
    );
  };

  const [pipeline, inLicensing, outLicensing, primaryMarket] = ROWS;

  return (
    <section className="space-y-3">
      <header>
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[--color-muted]">
          Industry indicators
        </h3>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {renderRow(pipeline)}
        {renderRow(inLicensing)}
        {renderRow(outLicensing)}
        {renderRow(primaryMarket)}
      </div>
    </section>
  );
}

function SoloBar({
  pct,
  color,
  ariaLabel,
}: {
  pct: number;
  color: string;
  ariaLabel: string;
}) {
  const clamped = Math.min(100, Math.max(0, pct));
  return (
    <div
      className="flex w-full overflow-hidden rounded-sm"
      style={{ height: 12, backgroundColor: "var(--color-track)" }}
      role="img"
      aria-label={ariaLabel}
    >
      <div
        style={{
          width: `${clamped}%`,
          backgroundColor: color,
          transition: "width 350ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  );
}

"use client";

import type { ReactNode } from "react";
import { useNarrative } from "@/lib/narrativeStore";
import type { ChapterMetrics } from "@/lib/types";
import Sparkline from "./Sparkline";
import StackedBar from "./StackedBar";
import Cite from "@/components/Cite";

type Row = {
  key: "pipeline" | "inLicensing" | "trialStarts";
  label: string;
  color: string;
  source: string;
  citeId: string;
  getValue: (m: ChapterMetrics) => number;
  renderBar: (m: ChapterMetrics, color: string) => ReactNode;
};

const ROWS: Row[] = [
  {
    key: "pipeline",
    label: "China-originated pipeline",
    color: "var(--color-accent)",
    source: "IQVIA Global Trends in R&D 2025",
    citeId: "iqvia-global-rd-2025",
    getValue: (m) => m.pipelineSharePct,
    renderBar: (m, color) => <SoloBar value={m.pipelineSharePct} color={color} />,
  },
  {
    key: "inLicensing",
    label: "Licensed-out to global pharma",
    color: "var(--color-gold)",
    source: "Jefferies China Outlicensing tracker",
    citeId: "jefferies-china-outlicensing-tracker-2025",
    getValue: (m) => m.inLicensingSharePct,
    renderBar: (m, color) => <SoloBar value={m.inLicensingSharePct} color={color} />,
  },
  {
    key: "trialStarts",
    label: "Trials sponsored from China",
    color: "var(--color-accent)",
    source: "IQVIA Global Trends in R&D 2024 / 2025",
    citeId: "iqvia-global-rd-2025",
    getValue: (m) => m.trialStartsShare.china,
    renderBar: (m) => <StackedBar share={m.trialStartsShare} />,
  },
];

export default function MetricsBar() {
  const chapters = useNarrative((s) => s.chapters);
  const idx = useNarrative((s) => s.currentIndex);
  const current = chapters[idx];
  if (!current) return null;

  const renderRow = (row: Row) => {
    const series = chapters.map((c) => row.getValue(c.metrics));
    const value = row.getValue(current.metrics);
    return (
      <article key={row.key} className="space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[10px] uppercase tracking-[0.16em] text-[--color-muted]">
            {row.label}
          </span>
          <span
            className="num text-2xl font-medium leading-none"
            style={{ color: row.color }}
          >
            {value}
            <span className="ml-0.5 text-sm font-normal text-[--color-muted]">
              %
            </span>
          </span>
        </div>
        {row.renderBar(current.metrics, row.color)}
        <Sparkline values={series} currentIndex={idx} color={row.color} />
        <p className="text-[10px] tracking-wide text-[--color-muted]">
          {row.source} <Cite id={row.citeId} />
        </p>
      </article>
    );
  };

  const [pipeline, inLicensing, trialStarts] = ROWS;

  return (
    <section className="space-y-5">
      <header>
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[--color-muted]">
          Industry indicators
        </h3>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {renderRow(pipeline)}
        {renderRow(inLicensing)}
      </div>
      {renderRow(trialStarts)}
    </section>
  );
}

function SoloBar({ value, color }: { value: number; color: string }) {
  return (
    <div
      className="flex w-full overflow-hidden rounded-sm"
      style={{ height: 12, backgroundColor: "var(--color-track)" }}
      role="img"
      aria-label={`China share: ${value}%`}
    >
      <div
        style={{
          width: `${value}%`,
          backgroundColor: color,
          transition: "width 350ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  );
}

"use client";

import { useRef, useState, type ReactNode } from "react";
import { useNarrative } from "@/lib/narrativeStore";
import type { ChapterMetrics } from "@/lib/types";
import Sparkline from "./Sparkline";
import Cite from "@/components/Cite";
import Tooltip from "@/components/Tooltip";

const HOVER_GRACE_MS = 200;

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
  info?: ReactNode;
  // Optional override: render the bar from a different metric than getValue.
  // Used to put absolute count as the headline and % share as the bar width.
  getBarValue?: (m: ChapterMetrics) => number;
  barCaption?: (m: ChapterMetrics) => string;
};

const IN_LICENSING_INFO = (
  <div className="space-y-1.5">
    <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[--color-muted]">
      In-licensing
    </div>
    <p className="text-[--color-fg]">
      When a pharma company pays for rights to a drug it didn&apos;t develop, in exchange for an upfront payment plus milestones and royalties.
    </p>
    <p className="text-[--color-muted]">
      This row: of every dollar western pharma spends licensing drugs in, what fraction goes to Chinese sellers. The demand-side view of China&apos;s BD output.
    </p>
  </div>
);

const OUT_LICENSING_INFO = (
  <div className="space-y-1.5">
    <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[--color-muted]">
      Out-licensing
    </div>
    <p className="text-[--color-fg]">
      The same deal viewed from the seller&apos;s side, usually carved by territory (Akeso keeps China rights, Summit gets ex-China). Headline values are biobucks: max potential including milestones. Only the upfront (~5–15% of total) is cash on signing.
    </p>
    <p className="text-[--color-muted]">
      This row: total announced deal value of all such transactions with a Chinese seller. Same flow as the row above, in absolute dollars rather than share-of-market.
    </p>
  </div>
);

const ROWS: Row[] = [
  {
    key: "pipeline",
    label: "China-originated pipeline",
    color: "var(--color-accent)",
    source: "Pharmaprojects / IQVIA",
    citeId: "mckinsey-vision-2028-china",
    getValue: (m) => m.pipelineCount ?? 0,
    unit: "",
    barMode: "share",
    getBarValue: (m) => m.pipelineSharePct,
    barCaption: (m) => `${m.pipelineSharePct}% of global pipeline`,
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
    info: IN_LICENSING_INFO,
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
    info: OUT_LICENSING_INFO,
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

type InfoTip = { rect: DOMRect; node: ReactNode };

export default function MetricsBar() {
  const chapters = useNarrative((s) => s.visibleChapters);
  const idx = useNarrative((s) => s.currentIndex);
  const [infoTip, setInfoTip] = useState<InfoTip | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelHide = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };
  const scheduleHide = () => {
    cancelHide();
    hideTimer.current = setTimeout(() => setInfoTip(null), HOVER_GRACE_MS);
  };

  const current = chapters[idx];
  if (!current) return null;

  const renderRow = (row: Row) => {
    const series = chapters.map((c) => row.getValue(c.metrics));
    const value = row.getValue(current.metrics);
    const seriesMax = Math.max(...series, 1);
    const barSourceValue = row.getBarValue
      ? row.getBarValue(current.metrics)
      : value;
    const barPct =
      row.barMode === "share"
        ? barSourceValue
        : (barSourceValue / seriesMax) * 100;
    const caption = row.barCaption?.(current.metrics);
    const display = `${row.prefix ?? ""}${value}${row.unit}`;

    return (
      <article key={row.key} className="space-y-1.5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] text-[--color-muted]">
            {row.label}
            {row.info && (
              <button
                type="button"
                aria-label={`What is ${row.label}?`}
                onMouseEnter={(e) => {
                  cancelHide();
                  setInfoTip({
                    rect: e.currentTarget.getBoundingClientRect(),
                    node: row.info,
                  });
                }}
                onMouseLeave={scheduleHide}
                onFocus={(e) => {
                  cancelHide();
                  setInfoTip({
                    rect: e.currentTarget.getBoundingClientRect(),
                    node: row.info,
                  });
                }}
                onBlur={scheduleHide}
                className="inline-flex h-3 w-3 items-center justify-center rounded-full border border-[--color-rule] text-[8px] font-semibold normal-case leading-none text-[--color-muted] hover:border-[--color-fg] hover:text-[--color-fg]"
              >
                i
              </button>
            )}
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
        {caption && (
          <div className="text-right text-[9px] text-[--color-muted]">
            {caption}
          </div>
        )}
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

      <Tooltip
        show={!!infoTip}
        anchorRect={infoTip?.rect ?? null}
        width={300}
        onMouseEnter={cancelHide}
        onMouseLeave={scheduleHide}
      >
        {infoTip?.node}
      </Tooltip>
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

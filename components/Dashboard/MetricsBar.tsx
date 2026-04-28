"use client";

import { useRef, useState, type ReactNode } from "react";
import { useNarrative } from "@/lib/narrativeStore";
import type { ChapterMetrics, RegionShare } from "@/lib/types";
import Cite from "@/components/Cite";
import Tooltip from "@/components/Tooltip";
import StackedBar, { type StackedBarSlice } from "./StackedBar";
import RegionTrajectory from "./RegionTrajectory";

const HOVER_GRACE_MS = 200;

const REGION_SLICES: StackedBarSlice<keyof RegionShare>[] = [
  { key: "us", label: "US", color: "var(--color-slice-1)" },
  { key: "china", label: "China", color: "var(--color-accent)" },
  { key: "eu", label: "EU+UK", color: "var(--color-slice-2)" },
];

type Row = {
  key: "pipeline" | "outLicensing" | "primaryMarket" | "efficiency";
  label: string;
  color: string;
  source: string;
  citeId: string;
  getValue: (m: ChapterMetrics) => number;
  prefix?: string;
  unit: string;
  suffix?: string;
  info?: ReactNode;
  getRegionShare?: (m: ChapterMetrics) => RegionShare | undefined;
  shareCaption?: string;
  getTrajectoryValues?: (m: ChapterMetrics) => RegionShare | undefined;
  formatValue?: (v: number) => string;
};

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

const CLASS1_NME_INFO = (
  <div className="space-y-1.5">
    <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[--color-muted]">
      Class 1 NME
    </div>
    <p className="text-[--color-fg]">
      China&apos;s NMPA reserves the Class 1 designation for innovative new drugs with active ingredients never before approved anywhere in the world. Excludes generics, biosimilars, reformulations, and supplemental indications.
    </p>
    <p className="text-[--color-muted]">
      Methodologically comparable to FDA new molecular entity (NME) approvals, which is what the US line uses. EU line uses EMA centrally-approved new active substances.
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
    getRegionShare: (m) => m.pipelineRegionShare,
    shareCaption: "% of global pipeline",
  },
  {
    key: "outLicensing",
    label: "Out-licensing deal value, $B/yr",
    color: "var(--color-accent)",
    source: "GlobalData / Jefferies / SCMP",
    citeId: "scmp-china-out-licensing-2025",
    getValue: (m) => m.outLicensingDealValueBn ?? 0,
    prefix: "$",
    unit: "B",
    info: OUT_LICENSING_INFO,
    getRegionShare: (m) => m.outLicensingRegionShare,
    shareCaption: "% of global out-licensing $",
  },
  {
    key: "primaryMarket",
    label: "Primary-market financing, $B/yr",
    color: "var(--color-gold)",
    source: "Nature Biotechnology / Skadden / DealForma",
    citeId: "biopharmaapac-china-h1-2025",
    getValue: (m) => m.primaryMarketFinancingBn ?? 0,
    prefix: "$",
    unit: "B",
    getRegionShare: (m) => m.primaryMarketRegionShare,
    shareCaption: "% of global biopharma raises",
  },
  // {
  //   key: "efficiency",
  //   label: "Class 1 NMEs per $B R&D/yr",
  //   color: "var(--color-accent)",
  //   source: "CDE / FDA / NBS / PhRMA",
  //   citeId: "wellington-china-biotech-2026",
  //   getValue: (m) => m.nmesPerBnRd ?? 0,
  //   unit: "",
  //   formatValue: (v) => v.toFixed(1),
  //   info: CLASS1_NME_INFO,
  //   getTrajectoryValues: (m) => m.nmesPerBnRdByRegion,
  // },
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
    const value = row.getValue(current.metrics);
    const regionShare = row.getRegionShare?.(current.metrics);
    const trajectoryFn = row.getTrajectoryValues ?? row.getRegionShare;
    const trajectorySeries = REGION_SLICES.map((slice) => ({
      key: slice.key,
      color: slice.color,
      emphasize: slice.key === "china",
      values: chapters.map((c) => trajectoryFn?.(c.metrics)?.[slice.key] ?? 0),
    }));
    const formattedValue = row.formatValue
      ? row.formatValue(value)
      : String(value);
    const inlineRegionalValues =
      !regionShare && row.getTrajectoryValues
        ? row.getTrajectoryValues(current.metrics)
        : undefined;
    const fmt = row.formatValue ?? ((v: number) => String(v));
    const usVal = inlineRegionalValues?.us ?? 0;
    const chinaVal = inlineRegionalValues?.china ?? 0;
    const ratio = usVal > 0 ? chinaVal / usVal : 0;

    return (
      <article key={row.key} className="space-y-1">
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
            {formattedValue}
            <span className="ml-0.5 text-sm font-normal text-[--color-muted]">
              {row.unit}
            </span>
          </span>
        </div>
        {regionShare && (
          <StackedBar
            share={regionShare}
            slices={REGION_SLICES}
            height={10}
            showLegend
            caption={row.shareCaption}
          />
        )}
        {inlineRegionalValues && (
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-[10px] tracking-wider text-[--color-muted]">
            {REGION_SLICES.map((s) => (
              <span key={s.key} className="inline-flex items-center gap-1">
                <span className="uppercase">{s.label}</span>
                <span className="num text-[--color-fg]">
                  {fmt(inlineRegionalValues[s.key] ?? 0)}
                </span>
              </span>
            ))}
            {ratio > 0 && (
              <span className="num ml-auto text-[--color-fg]">
                {ratio.toFixed(1)}×
              </span>
            )}
          </div>
        )}
        <RegionTrajectory series={trajectorySeries} currentIndex={idx} height={28} />
        <p className="text-[10px] tracking-wide text-[--color-muted]">
          {row.source} <Cite id={row.citeId} />
        </p>
      </article>
    );
  };

  return (
    <section className="space-y-3">
      <header className="flex items-baseline justify-between gap-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[--color-muted]">
          Industry indicators
        </h3>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] tracking-wider text-[--color-muted]">
          {REGION_SLICES.map((s) => (
            <span key={s.key} className="inline-flex items-center gap-1">
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-sm"
                style={{ backgroundColor: s.color }}
              />
              <span className="uppercase">{s.label}</span>
            </span>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {ROWS.map(renderRow)}
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


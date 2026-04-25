"use client";

import { useNarrative } from "@/lib/narrativeStore";
import type { ChapterMetrics } from "@/lib/types";
import Sparkline from "./Sparkline";

type MetricKey = keyof ChapterMetrics;

type MetricSpec = {
  key: MetricKey;
  label: string;
  format: (v: number) => string;
  color?: string;
};

const SPECS: MetricSpec[] = [
  {
    key: "novelDrugApprovals",
    label: "Novel drug approvals",
    format: (v) => String(v),
  },
  {
    key: "licenseOutDeals",
    label: "License-out deals",
    format: (v) => String(v),
    color: "var(--color-gold)",
  },
  {
    key: "licenseInDeals",
    label: "License-in deals",
    format: (v) => String(v),
  },
  {
    key: "biotechIPOs",
    label: "Biotech IPOs",
    format: (v) => String(v),
    color: "#2c5d3f",
  },
  {
    key: "rdSpendBillions",
    label: "R&D spend",
    format: (v) => `$${v}B`,
  },
  {
    key: "globalClinicalTrialShare",
    label: "Global trial share",
    format: (v) => `${v}%`,
    color: "#4b3a8c",
  },
  {
    key: "apiGlobalShare",
    label: "Global API share",
    format: (v) => `${v}%`,
  },
];

export default function MetricsBar() {
  const chapters = useNarrative((s) => s.chapters);
  const idx = useNarrative((s) => s.currentIndex);

  return (
    <section className="space-y-2">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[--color-muted]">
        Industry indicators
      </h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {SPECS.map((m) => {
          const values = chapters.map((c) => c.metrics[m.key]);
          const current = values[idx];
          return (
            <div
              key={m.key}
              className="space-y-1 border-b border-[--color-rule]/60 pb-2"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[10px] uppercase tracking-wider text-[--color-muted]">
                  {m.label}
                </span>
                <span className="num text-base font-medium leading-none">
                  {m.format(current)}
                </span>
              </div>
              <Sparkline
                values={values}
                currentIndex={idx}
                color={m.color}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

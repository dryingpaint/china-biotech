"use client";

import { useNarrative } from "@/lib/narrativeStore";

type Metric = {
  label: string;
  value: string;
  hint?: string;
};

export default function MetricsBar() {
  const m = useNarrative((s) => s.chapters[s.currentIndex].metrics);

  const metrics: Metric[] = [
    {
      label: "Novel drug approvals",
      value: String(m.novelDrugApprovals),
      hint: "cumulative, NMPA",
    },
    {
      label: "License-out deals",
      value: String(m.licenseOutDeals),
      hint: "cumulative",
    },
    {
      label: "License-in deals",
      value: String(m.licenseInDeals),
      hint: "cumulative",
    },
    {
      label: "Biotech IPOs",
      value: String(m.biotechIPOs),
      hint: "HK 18A + STAR",
    },
    {
      label: "R&D spend",
      value: `$${m.rdSpendBillions}B`,
      hint: "annual",
    },
    {
      label: "Global API share",
      value: `${m.apiGlobalShare}%`,
      hint: "supply",
    },
    {
      label: "Global trial share",
      value: `${m.globalClinicalTrialShare}%`,
      hint: "active oncology",
    },
  ];

  return (
    <section className="space-y-2">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[--color-muted]">
        Industry indicators
      </h3>
      <div className="grid grid-cols-3 gap-x-3 gap-y-3">
        {metrics.map((x) => (
          <div key={x.label} className="space-y-0.5">
            <div className="num text-lg font-medium leading-none">
              {x.value}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-[--color-muted]">
              {x.label}
            </div>
            {x.hint ? (
              <div className="text-[10px] italic text-[--color-muted]">
                {x.hint}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

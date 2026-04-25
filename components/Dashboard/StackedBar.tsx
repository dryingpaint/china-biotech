"use client";

import type { TrialStartsShare } from "@/lib/types";

type Slice = {
  key: keyof TrialStartsShare;
  label: string;
  color: string;
};

const SLICES: Slice[] = [
  { key: "china", label: "China", color: "var(--color-accent)" },
  { key: "us", label: "US", color: "var(--color-slice-1)" },
  { key: "eu", label: "EU+UK", color: "var(--color-slice-2)" },
  { key: "japan", label: "Japan", color: "var(--color-slice-3)" },
  { key: "row", label: "RoW", color: "var(--color-slice-4)" },
];

export default function StackedBar({
  share,
  height = 12,
  showLegend = true,
}: {
  share: TrialStartsShare;
  height?: number;
  showLegend?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div
        className="flex w-full overflow-hidden rounded-sm"
        style={{ height }}
        role="img"
        aria-label={`Regional shares — China ${share.china}%, US ${share.us}%, EU+UK ${share.eu}%, Japan ${share.japan}%, RoW ${share.row}%`}
      >
        {SLICES.map((s) => {
          const v = share[s.key];
          return (
            <div
              key={s.key}
              style={{
                width: `${v}%`,
                backgroundColor: s.color,
                transition: "width 350ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              title={`${s.label}: ${v}%`}
            />
          );
        })}
      </div>
      {showLegend && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] tracking-wider text-[--color-muted]">
          {SLICES.map((s) => (
            <span key={s.key} className="inline-flex items-center gap-1">
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-sm"
                style={{ backgroundColor: s.color }}
              />
              <span className="uppercase">{s.label}</span>
              <span className="num text-[--color-fg]">{share[s.key]}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

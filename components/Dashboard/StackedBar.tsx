"use client";

export type StackedBarSlice<K extends string> = {
  key: K;
  label: string;
  color: string;
};

type Props<K extends string> = {
  share: Record<K, number>;
  slices: StackedBarSlice<K>[];
  height?: number;
  showLegend?: boolean;
  unit?: string;
  caption?: string;
};

export default function StackedBar<K extends string>({
  share,
  slices,
  height = 12,
  showLegend = true,
  unit = "%",
  caption,
}: Props<K>) {
  const ariaLabel = slices
    .map((s) => `${s.label} ${share[s.key]}${unit}`)
    .join(", ");

  return (
    <div className="space-y-1">
      {caption && (
        <div className="text-[9px] uppercase tracking-[0.14em] text-[--color-muted]">
          {caption}
        </div>
      )}
      <div
        className="flex w-full overflow-hidden rounded-sm"
        style={{ height }}
        role="img"
        aria-label={`Regional shares — ${ariaLabel}`}
      >
        {slices.map((s) => {
          const v = share[s.key];
          return (
            <div
              key={s.key}
              style={{
                width: `${v}%`,
                backgroundColor: s.color,
                transition: "width 350ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              title={`${s.label}: ${v}${unit}`}
            />
          );
        })}
      </div>
      {showLegend && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] tracking-wider text-[--color-muted]">
          {slices.map((s) => (
            <span key={s.key} className="inline-flex items-center gap-1">
              <span className="uppercase">{s.label}</span>
              <span className="num text-[--color-fg]">
                {share[s.key]}
                <span className="text-[--color-muted]">{unit}</span>
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

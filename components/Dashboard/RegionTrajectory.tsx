"use client";

type Series = {
  key: string;
  values: number[];
  color: string;
  emphasize?: boolean;
};

type Props = {
  series: Series[];
  currentIndex: number;
  height?: number;
};

export default function RegionTrajectory({
  series,
  currentIndex,
  height = 36,
}: Props) {
  const width = 120;
  const len = series[0]?.values.length ?? 0;
  if (len === 0) return null;
  const stepX = len > 1 ? width / (len - 1) : width;

  const allValues = series.flatMap((s) => s.values);
  const dataMax = Math.max(...allValues, 1);
  const max = Math.ceil(dataMax * 1.1);
  const range = max || 1;

  const computed = series.map((s) => {
    const points = s.values.map((v, i) => ({
      x: i * stepX,
      y: height - (v / range) * (height - 4) - 2,
    }));
    const linePath = points
      .map((p, i) =>
        `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`,
      )
      .join(" ");
    const currentPoint =
      points[Math.min(Math.max(currentIndex, 0), points.length - 1)];
    return { ...s, linePath, currentPoint };
  });

  const cursorX = computed[0]?.currentPoint.x ?? 0;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      width="100%"
      height={height}
      role="img"
      aria-hidden
    >
      <line
        x1={cursorX}
        x2={cursorX}
        y1={0}
        y2={height}
        stroke="var(--color-rule)"
        strokeOpacity={0.5}
        strokeWidth={1}
      />
      {computed.map((s) => (
        <path
          key={`${s.key}-line`}
          d={s.linePath}
          stroke={s.color}
          strokeWidth={s.emphasize ? 1.5 : 1}
          strokeOpacity={s.emphasize ? 1 : 0.7}
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}
      {computed.map((s) => (
        <circle
          key={`${s.key}-dot`}
          cx={s.currentPoint.x}
          cy={s.currentPoint.y}
          r={s.emphasize ? 2.5 : 1.75}
          fill={s.color}
        />
      ))}
    </svg>
  );
}

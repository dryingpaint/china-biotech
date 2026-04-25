"use client";

type Props = {
  values: number[];
  currentIndex: number;
  color?: string;
  height?: number;
};

export default function Sparkline({
  values,
  currentIndex,
  color = "var(--color-accent)",
  height = 28,
}: Props) {
  const width = 120;
  const max = Math.max(...values, 1);
  const min = 0;
  const range = max - min || 1;
  const stepX =
    values.length > 1 ? width / (values.length - 1) : width;

  const points = values.map((v, i) => ({
    x: i * stepX,
    y: height - ((v - min) / range) * (height - 4) - 2,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${height} L 0 ${height} Z`;

  const current = points[Math.min(currentIndex, points.length - 1)];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      width="100%"
      height={height}
      role="img"
      aria-hidden
    >
      <path d={areaPath} fill={color} fillOpacity={0.12} />
      <path
        d={linePath}
        stroke={color}
        strokeWidth={1.25}
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <line
        x1={current.x}
        x2={current.x}
        y1={0}
        y2={height}
        stroke={color}
        strokeOpacity={0.25}
        strokeWidth={1}
      />
      <circle cx={current.x} cy={current.y} r={2.5} fill={color} />
    </svg>
  );
}

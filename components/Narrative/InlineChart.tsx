"use client";

import type { InlineChart as InlineChartType } from "@/lib/types";
import { getCitation } from "@/lib/citations";

const DEFAULT_COLORS = [
  "var(--color-accent)",
  "var(--color-slice-1)",
  "var(--color-slice-2)",
];

const W = 480;
const H = 200;
const PAD_L = 36;
const PAD_R = 16;
const PAD_T = 12;
const PAD_B = 30;
const INNER_W = W - PAD_L - PAD_R;
const INNER_H = H - PAD_T - PAD_B;

function formatValue(v: number): string {
  if (v >= 1000) return `${Math.round(v / 100) / 10}k`;
  if (v >= 100) return String(Math.round(v));
  if (v >= 10) return String(Math.round(v));
  return String(Math.round(v * 10) / 10);
}

export default function InlineChart({ chart }: { chart: InlineChartType }) {
  const allValues = chart.series.flatMap((s) => s.values);
  const maxV = Math.max(...allValues, 1);
  const yMax = niceCeil(maxV);
  const valueY = (v: number) =>
    PAD_T + INNER_H - (v / yMax) * INNER_H;

  const xCount = chart.xLabels.length;
  const xPos = (i: number) =>
    xCount === 1
      ? PAD_L + INNER_W / 2
      : PAD_L + (i / (xCount - 1)) * INNER_W;

  const cite = chart.source ? getCitation(chart.source) : null;

  return (
    <figure className="inline-chart">
      <figcaption className="inline-chart-title">{chart.title}</figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="inline-chart-svg"
        role="img"
        aria-label={chart.title}
      >
        {/* y-axis baseline */}
        <line
          x1={PAD_L}
          y1={H - PAD_B}
          x2={W - PAD_R}
          y2={H - PAD_B}
          stroke="var(--color-rule)"
          strokeWidth="1"
        />
        {/* y-axis ticks: 0 and yMax */}
        <text
          x={PAD_L - 6}
          y={H - PAD_B + 3}
          textAnchor="end"
          className="inline-chart-tick"
        >
          0
        </text>
        <text
          x={PAD_L - 6}
          y={PAD_T + 4}
          textAnchor="end"
          className="inline-chart-tick"
        >
          {formatValue(yMax)}
        </text>
        {chart.yLabel && (
          <text
            x={PAD_L - 28}
            y={PAD_T + INNER_H / 2}
            textAnchor="middle"
            transform={`rotate(-90, ${PAD_L - 28}, ${PAD_T + INNER_H / 2})`}
            className="inline-chart-axis-label"
          >
            {chart.yLabel}
          </text>
        )}
        {/* x-axis labels: first, last, and a few in between */}
        {chart.xLabels.map((label, i) => {
          const showEvery = Math.max(1, Math.floor(xCount / 5));
          if (i !== 0 && i !== xCount - 1 && i % showEvery !== 0) return null;
          const anchor =
            i === 0 ? "start" : i === xCount - 1 ? "end" : "middle";
          return (
            <text
              key={i}
              x={xPos(i)}
              y={H - PAD_B + 16}
              textAnchor={anchor}
              className="inline-chart-tick"
            >
              {label}
            </text>
          );
        })}
        {chart.type === "line"
          ? renderLines(chart, xPos, valueY)
          : renderBars(chart, xPos, valueY)}
      </svg>
      <div className="inline-chart-footer">
        <div className="inline-chart-legend">
          {chart.series.map((s, si) => {
            const color = s.color ?? DEFAULT_COLORS[si % DEFAULT_COLORS.length];
            return (
              <span key={si} className="inline-chart-legend-item">
                <span
                  aria-hidden
                  className="inline-chart-swatch"
                  style={{ backgroundColor: color }}
                />
                {s.label}
              </span>
            );
          })}
        </div>
        {cite && (
          <a
            href={`#cite-${cite.citation.id}`}
            className="inline-chart-source"
            title={`${cite.citation.authors}, "${cite.citation.title}" (${cite.citation.year})`}
          >
            [{cite.index + 1}]
          </a>
        )}
      </div>
      {chart.caption && (
        <figcaption className="inline-chart-caption">{chart.caption}</figcaption>
      )}
    </figure>
  );
}

function renderLines(
  chart: InlineChartType,
  xPos: (i: number) => number,
  valueY: (v: number) => number,
) {
  return chart.series.map((s, si) => {
    const color = s.color ?? DEFAULT_COLORS[si % DEFAULT_COLORS.length];
    const points = s.values.map((v, i) => `${xPos(i)},${valueY(v)}`).join(" ");
    return (
      <g key={si}>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.75"
          points={points}
        />
        {s.values.map((v, i) => (
          <circle
            key={i}
            cx={xPos(i)}
            cy={valueY(v)}
            r={2.5}
            fill={color}
          />
        ))}
      </g>
    );
  });
}

function renderBars(
  chart: InlineChartType,
  xPos: (i: number) => number,
  valueY: (v: number) => number,
) {
  const xCount = chart.xLabels.length;
  const groupWidth = INNER_W / xCount;
  const seriesCount = chart.series.length;
  const barWidth = (groupWidth * 0.7) / seriesCount;
  return chart.series.map((s, si) => {
    const color = s.color ?? DEFAULT_COLORS[si % DEFAULT_COLORS.length];
    return (
      <g key={si}>
        {s.values.map((v, i) => {
          const y = valueY(v);
          const x =
            xPos(i) - groupWidth * 0.35 + si * barWidth + barWidth * 0.05;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barWidth * 0.9}
              height={H - PAD_B - y}
              fill={color}
            />
          );
        })}
      </g>
    );
  });
}

function niceCeil(v: number): number {
  if (v <= 0) return 1;
  const exp = Math.floor(Math.log10(v));
  const base = Math.pow(10, exp);
  const norm = v / base;
  let nice;
  if (norm <= 1) nice = 1;
  else if (norm <= 2) nice = 2;
  else if (norm <= 5) nice = 5;
  else nice = 10;
  return nice * base;
}

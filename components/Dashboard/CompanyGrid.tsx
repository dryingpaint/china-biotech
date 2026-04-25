"use client";

import { useNarrative } from "@/lib/narrativeStore";
import companiesData from "@/data/companies.json";
import type { Company, CompanyCategory } from "@/lib/types";

const companies = companiesData as Company[];

const CATEGORY_LABEL: Record<CompanyCategory, string> = {
  innovator: "Innovator",
  cro_cdmo: "CRO/CDMO",
  vaccines: "Vaccines",
  genomics: "Genomics",
  traditional: "Traditional",
  adc: "ADC",
  cell_gene: "Cell & Gene",
  mrna: "mRNA",
  ai_bio: "AI bio",
};

const CATEGORY_COLOR: Record<CompanyCategory, string> = {
  innovator: "var(--color-accent)",
  cro_cdmo: "#2c5d3f",
  adc: "var(--color-gold)",
  vaccines: "#4b3a8c",
  mrna: "#7a5a3a",
  cell_gene: "#1f5f7a",
  genomics: "#5a4b8c",
  traditional: "#6b6b6b",
  ai_bio: "#8c4a6b",
};

export default function CompanyGrid() {
  const activeIds = useNarrative(
    (s) => s.chapters[s.currentIndex].activeCompanyIds,
  );
  const activeSet = new Set(activeIds);

  return (
    <section className="space-y-2">
      <header className="flex items-baseline justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[--color-muted]">
          Companies on the board
        </h3>
        <span className="num text-xs text-[--color-muted]">
          {activeIds.length} / {companies.length}
        </span>
      </header>
      <div className="flex flex-wrap gap-1">
        {companies.map((c) => {
          const isActive = activeSet.has(c.id);
          const color = CATEGORY_COLOR[c.category];
          return (
            <div
              key={c.id}
              title={`${c.name} (${c.founded}) — ${c.shortDescription}`}
              className="group relative h-3 w-3 rounded-[2px] transition-all"
              style={{
                backgroundColor: isActive ? color : "transparent",
                border: `1px solid ${isActive ? color : "var(--color-rule)"}`,
              }}
            >
              <span className="pointer-events-none absolute -top-1 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded bg-[--color-fg] px-1.5 py-0.5 text-[10px] text-[--color-bg] group-hover:block">
                {c.name}
              </span>
            </div>
          );
        })}
      </div>
      <CategoryLegend />
    </section>
  );
}

function CategoryLegend() {
  const cats: CompanyCategory[] = [
    "innovator",
    "cro_cdmo",
    "adc",
    "vaccines",
    "mrna",
    "cell_gene",
    "genomics",
    "ai_bio",
    "traditional",
  ];
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-[10px] text-[--color-muted]">
      {cats.map((c) => (
        <span key={c} className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-[2px]"
            style={{ backgroundColor: CATEGORY_COLOR[c] }}
          />
          {CATEGORY_LABEL[c]}
        </span>
      ))}
    </div>
  );
}

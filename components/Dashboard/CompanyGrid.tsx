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
};

const CATEGORY_GLYPH: Record<CompanyCategory, string> = {
  innovator: "◆",
  cro_cdmo: "▣",
  vaccines: "◉",
  genomics: "≋",
  traditional: "◐",
  adc: "✦",
  cell_gene: "✚",
  mrna: "◌",
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
      <div className="grid grid-cols-7 gap-1.5">
        {companies.map((c) => {
          const isActive = activeSet.has(c.id);
          return (
            <div
              key={c.id}
              title={`${c.name} (${c.founded}) — ${c.shortDescription}`}
              className={[
                "group relative flex aspect-square items-center justify-center rounded-md border text-base transition-all",
                isActive
                  ? "border-[--color-accent] bg-[--color-accent] text-[--color-bg]"
                  : "border-[--color-rule] bg-transparent text-[--color-rule]",
              ].join(" ")}
            >
              <span aria-hidden>{CATEGORY_GLYPH[c.category]}</span>
              <span className="pointer-events-none absolute -bottom-0.5 left-1/2 hidden -translate-x-1/2 translate-y-full whitespace-nowrap rounded bg-[--color-fg] px-2 py-1 text-[10px] text-[--color-bg] group-hover:block">
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
    "traditional",
  ];
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-[10px] text-[--color-muted]">
      {cats.map((c) => (
        <span key={c} className="inline-flex items-center gap-1">
          <span aria-hidden>{CATEGORY_GLYPH[c]}</span>
          {CATEGORY_LABEL[c]}
        </span>
      ))}
    </div>
  );
}

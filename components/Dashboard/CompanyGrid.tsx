"use client";

import { useState } from "react";
import { useNarrative } from "@/lib/narrativeStore";
import companiesData from "@/data/companies.json";
import type { Company, CompanyCategory } from "@/lib/types";
import Tooltip from "@/components/Tooltip";

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

type Hovered = { rect: DOMRect; company: Company };

export default function CompanyGrid() {
  const activeIds = useNarrative(
    (s) => s.chapters[s.currentIndex].activeCompanyIds,
  );
  const activeSet = new Set(activeIds);
  const [hovered, setHovered] = useState<Hovered | null>(null);

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
              onMouseEnter={(e) =>
                setHovered({
                  rect: e.currentTarget.getBoundingClientRect(),
                  company: c,
                })
              }
              onMouseLeave={() => setHovered(null)}
              className="h-3 w-3 rounded-[2px] transition-all"
              style={{
                backgroundColor: isActive ? color : "transparent",
                border: `1px solid ${isActive ? color : "var(--color-rule)"}`,
              }}
            />
          );
        })}
      </div>
      <CategoryLegend />
      <Tooltip show={!!hovered} anchorRect={hovered?.rect ?? null}>
        {hovered ? (
          <CompanyTooltip
            company={hovered.company}
            isActive={activeSet.has(hovered.company.id)}
          />
        ) : null}
      </Tooltip>
    </section>
  );
}

function CompanyTooltip({
  company,
  isActive,
}: {
  company: Company;
  isActive: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-semibold text-[--color-fg]">{company.name}</span>
        <span className="num text-[10px] text-[--color-muted]">
          founded {company.founded}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[--color-muted]">
        <span
          aria-hidden
          className="inline-block h-2 w-2 rounded-[2px]"
          style={{ backgroundColor: CATEGORY_COLOR[company.category] }}
        />
        {CATEGORY_LABEL[company.category]}
        {!isActive ? (
          <span className="ml-1 italic">— not yet on the board</span>
        ) : null}
      </div>
      <div className="text-[--color-fg]">{company.shortDescription}</div>
      {company.signature ? (
        <div className="text-[--color-muted]">
          <span className="text-[10px] uppercase tracking-wider">
            Signature:
          </span>{" "}
          {company.signature}
        </div>
      ) : null}
    </div>
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

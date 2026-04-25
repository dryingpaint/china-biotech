"use client";

import { useState } from "react";
import { useNarrative } from "@/lib/narrativeStore";
import type { ModalityKey } from "@/lib/types";
import Tooltip from "@/components/Tooltip";
import { renderBodyWithCitations } from "@/lib/citations";

type RungSpec = {
  label: string;
  marker: string;
};

type Modality = {
  key: ModalityKey;
  label: string;
  blurb: string;
  rungs: [RungSpec, RungSpec, RungSpec, RungSpec, RungSpec];
};

const MODALITIES: Modality[] = [
  {
    key: "smallMol",
    label: "Small molecules",
    blurb: "Synthetic-chemistry NCEs and generics",
    rungs: [
      { label: "Capability", marker: "Pharmaceutical chemistry; novel small-molecule discovery infrastructure" },
      { label: "First approval", marker: "Hengrui apatinib (Aitan) NMPA — first Chinese small-molecule angiogenesis inhibitor (Oct 2014)[[cite:frontiers-apatinib-review-2021]]" },
      { label: "Scale", marker: "Multiple Chinese firms running novel small-mol oncology pipelines (Hengrui, BeiGene, Hutchmed)" },
      { label: "Out-licensed", marker: "Apatinib licensed to LSK BioPharma; Hutchmed fruquintinib licensed to Takeda" },
      { label: "Global frontier", marker: "Brukinsa zanubrutinib FDA full approval (Nov 2019)[[cite:fiercepharma-brukinsa-fda-approval]]; Fruzaqla fruquintinib FDA approval (Nov 2023)[[cite:fda-fruquintinib-2023]]" },
    ],
  },
  {
    key: "peptide",
    label: "Peptide therapeutics",
    blurb: "Solid-phase synthesis; GLP-1, insulin analogs",
    rungs: [
      { label: "Capability", marker: "Solid-phase peptide synthesis and pegylation chemistry" },
      { label: "First approval", marker: "Hansoh peg-loxenatide NMPA — first Chinese-produced long-acting GLP-1 (2018)[[cite:pharmasources-peg-loxenatide-hansoh]]" },
      { label: "Scale", marker: "Multiple GLP-1 players; oral peptides and dual-agonist candidates emerging" },
      { label: "Out-licensed", marker: "Innovent mazdutide (IBI362) developed in partnership with Lilly[[cite:innovent-innovent-announces-mazdutide-first-dual]]" },
      { label: "Global frontier", marker: "FDA or EMA approval of a Chinese-discovered peptide therapeutic" },
    ],
  },
  {
    key: "recombinant",
    label: "Recombinant proteins",
    blurb: "Non-antibody biologics: EPO, growth factors, fusion proteins",
    rungs: [
      { label: "Capability", marker: "Bovine insulin total synthesis (1965)[[cite:bcas-insulin-2024]]" },
      { label: "First approval", marker: "3SBio EPIAO — first rhEPO marketed in China (1998)[[cite:3sbio-memorabilia]]" },
      { label: "Scale", marker: "Multiple players; biologics manufacturing at industrial scale" },
      { label: "Out-licensed", marker: "Western-pharma licensing of a Chinese-discovered recombinant protein" },
      { label: "Global frontier", marker: "FDA or EMA approval of a Chinese-discovered recombinant protein" },
    ],
  },
  {
    key: "biosimilar",
    label: "Biosimilars",
    blurb: "Off-patent biologic equivalents",
    rungs: [
      { label: "Capability", marker: "Henlius founded (2010); biosimilar development underway" },
      { label: "First approval", marker: "Henlius Hanlikang (HLX01, rituximab) — first NMPA biosimilar (Feb 2019)[[cite:henlius-hlx01-approval-press]]" },
      { label: "Scale", marker: "Multiple biosimilars approved domestically; competitive market" },
      { label: "Out-licensed", marker: "Henlius–Accord Healthcare partnership for ex-China commercialization of HLX02" },
      { label: "Global frontier", marker: "Henlius Zercepac (HLX02, trastuzumab) — first EMA-approved Chinese biosimilar (Jul 2020)[[cite:henlius-zercepac-ema-2020]]" },
    ],
  },
  {
    key: "novelMab",
    label: "Monoclonal antibodies",
    blurb: "Novel mAbs incl. checkpoint inhibitors",
    rungs: [
      { label: "Capability", marker: "BeiGene (2010), Innovent (2011) — innovator-mAb firms forming" },
      { label: "First approval", marker: "Toripalimab + sintilimab — first domestic PD-1 NMPA approvals (Dec 2018)[[cite:frontiers-toripalimab-first-domestic-pd1]][[cite:innovent-tyvyt-sintilimab-injection-included-in-t]]" },
      { label: "Scale", marker: "PD-1 swarm — roughly 100 firms running ~196 trials targeting the same checkpoint" },
      { label: "Out-licensed", marker: "Innovent–Lilly sintilimab strategic collaboration ($456M, Mar 2015)[[cite:biospace-innovent-lilly-expansion-2020]]" },
      { label: "Global frontier", marker: "Toripalimab Loqtorzi FDA approval (Oct 2023)[[cite:coherus-junshi-loqtorzi-fda-2023]]; Tislelizumab Tevimbra FDA approval (Mar 2024)[[cite:pharmexec-tevimbra-fda-2024]]" },
    ],
  },
  {
    key: "bispecific",
    label: "Bispecific antibodies",
    blurb: "Multi-target antibody architectures",
    rungs: [
      { label: "Capability", marker: "Multi-target antibody engineering capability builds out (mid-2010s)" },
      { label: "First approval", marker: "Akeso cadonilimab — world's first PD-1/CTLA-4 bispecific NMPA-approved (Jun 2022)[[cite:akeso-cadonilimab-first-bispecific-2022]]" },
      { label: "Scale", marker: "Multiple bispecific programs across Akeso, Hansoh, Innovent" },
      { label: "Out-licensed", marker: "Summit–Akeso $500M upfront for ivonescimab (Dec 2022)[[cite:summit-akeso-2022]]" },
      { label: "Global frontier", marker: "Akeso ivonescimab beats Keytruda head-to-head — HARMONi-2 (Sep 2024)[[cite:akeso-harmoni2-wclc-2024]]" },
    ],
  },
  {
    key: "adc",
    label: "Antibody–drug conjugates",
    blurb: "Antibody + linker + cytotoxic payload",
    rungs: [
      { label: "Capability", marker: "RemeGen founded (2008); disitamab vedotin development" },
      { label: "First approval", marker: "Disitamab vedotin NMPA — first Chinese-discovered ADC approved (Jun 2021)[[cite:remegen-phase-3-disitamab-vedotin-first-line-uro]]" },
      { label: "Scale", marker: "Multiple ADC programs at RemeGen, Kelun, DualityBio, SystImmune" },
      { label: "Out-licensed", marker: "Merck–Kelun $9B (Dec 2022)[[cite:merck-kelun-adc-deal-press]]; BMS–SystImmune $8.4B for BL-B01D1 (Dec 2023)[[cite:bms-systimmune-bl-b01d1-2023]]" },
      { label: "Global frontier", marker: "FDA or EMA approval of a Chinese-origin ADC, or head-to-head win vs Western standard of care" },
    ],
  },
  {
    key: "vaccine",
    label: "Vaccines (non-mRNA)",
    blurb: "Inactivated, subunit, viral-vector platforms",
    rungs: [
      { label: "Capability", marker: "PRC vaccine production established from the 1950s" },
      { label: "First approval", marker: "Wantai Hecolin — world's first hepatitis E vaccine NMPA approval (2012)[[cite:innovax-hecolin-2012]]; multiple traditional vaccines NMPA-approved" },
      { label: "Scale", marker: "Sinopharm, Sinovac, CanSino, Wantai at industrial scale" },
      { label: "International authorization", marker: "Multiple international EUAs (CoronaVac/BBIBP-CorV in Brazil, Indonesia, Turkey, etc., 2020–2021)" },
      { label: "Global frontier", marker: "Sinovac CoronaVac, Sinopharm BBIBP-CorV WHO EUL (May–Jun 2021)[[cite:who-sinovac-eul]][[cite:who-sinopharm-eul]]; Wantai Cecolin (HPV) WHO PQ (2021)[[cite:path-cecolin-who-prequalification-2021]]" },
    ],
  },
  {
    key: "cellTherapy",
    label: "Cell therapy",
    blurb: "CAR-T and other engineered cell therapies",
    rungs: [
      { label: "Capability", marker: "Academic CAR-T trials begin in early 2010s" },
      { label: "First approval", marker: "JW Therapeutics relma-cel — first domestic CAR-T NMPA-approved (Sep 2021)[[cite:jw-relmacel-nmpa-2021]]" },
      { label: "Scale", marker: "Legend, JW, Carsgen running multiple cell-therapy programs" },
      { label: "Out-licensed", marker: "Legend Biotech–Janssen partnership for cilta-cel (2017)" },
      { label: "Global frontier", marker: "Carvykti (Legend/J&J cilta-cel) — first Chinese-origin cell therapy FDA-approved (Feb 2022)[[cite:fda-cilta-cel-2022]]" },
    ],
  },
  {
    key: "nucleicAcid",
    label: "mRNA & nucleic acid",
    blurb: "mRNA, siRNA, ASO, LNP delivery",
    rungs: [
      { label: "Capability", marker: "Walvax–Abogen ARCoV mRNA reaches Phase III in Mexico/Indonesia[[cite:scmp-arcov-phase3-mexico-indonesia]]" },
      { label: "First approval", marker: "First Chinese-discovered mRNA or nucleic-acid therapeutic NMPA-authorized" },
      { label: "Scale", marker: "Multiple competing Chinese mRNA / siRNA / ASO programs at scale" },
      { label: "Out-licensed", marker: "Western-pharma licensing of a Chinese mRNA or nucleic-acid asset" },
      { label: "Global frontier", marker: "FDA or EMA approval of a Chinese-discovered mRNA or nucleic-acid therapeutic" },
    ],
  },
  {
    key: "geneTherapy",
    label: "Gene therapy",
    blurb: "In-vivo AAV, in-vivo CRISPR",
    rungs: [
      { label: "Capability", marker: "Belief BioMed and others develop in-vivo AAV gene therapies (late 2010s)" },
      { label: "First approval", marker: "Belief BioMed BBM-H901 — China's first hemophilia B gene therapy NMPA-approved (Apr 2025)[[cite:belief-biomed-bbm-h901-nmpa-2025]]" },
      { label: "Scale", marker: "Multiple Chinese in-vivo gene-therapy programs at clinical scale" },
      { label: "Out-licensed", marker: "Belief BioMed partnership with Takeda China for BBM-H901 commercialization[[cite:belief-biomed-bbm-h901-nmpa-2025]]" },
      { label: "Global frontier", marker: "FDA or EMA approval of a Chinese-discovered gene therapy" },
    ],
  },
  {
    key: "radiopharm",
    label: "Radiopharmaceuticals",
    blurb: "Targeted radioligand therapies",
    rungs: [
      { label: "Capability", marker: "Domestic radioligand programs emerging (Sinotau, Newland)" },
      { label: "First approval", marker: "First Chinese-discovered radiopharmaceutical NMPA-approved" },
      { label: "Scale", marker: "Multiple competing Chinese radiopharmaceutical programs" },
      { label: "Out-licensed", marker: "Western-pharma licensing of a Chinese radiopharmaceutical" },
      { label: "Global frontier", marker: "FDA or EMA approval of a Chinese-discovered radiopharmaceutical" },
    ],
  },
];

type Hovered = {
  rect: DOMRect;
  modality: Modality;
  rungIndex: number; // 1..5
  reached: boolean;
  frontierHere: boolean;
};

export default function CapabilityGrid() {
  const progress = useNarrative((s) => s.chapters[s.currentIndex].modalityProgress);
  const [hovered, setHovered] = useState<Hovered | null>(null);

  if (!progress) return null;

  const presentCount = MODALITIES.filter((m) => (progress[m.key]?.rung ?? 0) > 0).length;

  return (
    <section className="space-y-2">
      <header className="flex items-baseline justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[--color-muted]">
          Therapeutic modalities
        </h3>
        <span className="num text-xs text-[--color-muted]">
          {presentCount} / {MODALITIES.length}
        </span>
      </header>
      <div>
        {MODALITIES.map((m) => {
          const state = progress[m.key] ?? { rung: 0 };
          return (
            <div
              key={m.key}
              className="flex items-center justify-between gap-2 py-px"
            >
              <span className="text-[10px] leading-none text-[--color-fg]">
                {m.label}
              </span>
              <div className="flex items-center gap-[3px]">
                {[1, 2, 3, 4, 5].map((r) => {
                  const reached = state.rung >= r;
                  const frontierHere = !!state.frontier && state.rung === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      aria-label={`${m.label}, rung ${r}: ${m.rungs[r - 1].label}`}
                      onMouseEnter={(e) =>
                        setHovered({
                          rect: e.currentTarget.getBoundingClientRect(),
                          modality: m,
                          rungIndex: r,
                          reached,
                          frontierHere,
                        })
                      }
                      onMouseLeave={() => setHovered(null)}
                      onFocus={(e) =>
                        setHovered({
                          rect: e.currentTarget.getBoundingClientRect(),
                          modality: m,
                          rungIndex: r,
                          reached,
                          frontierHere,
                        })
                      }
                      onBlur={() => setHovered(null)}
                      className="h-2 w-2 rounded-[1px] transition-colors hover:ring-1 hover:ring-[--color-accent] focus:outline-none focus:ring-1 focus:ring-[--color-accent]"
                      style={{
                        backgroundColor: reached ? "var(--color-accent)" : "transparent",
                        border: `1px solid ${reached ? "var(--color-accent)" : "var(--color-rule)"}`,
                      }}
                    />
                  );
                })}
                <span
                  aria-label={state.frontier ? "Global frontier event in this chapter" : undefined}
                  className="ml-1 inline-block w-2 text-[9px] leading-none"
                  style={{ color: "var(--color-gold)", visibility: state.frontier ? "visible" : "hidden" }}
                >
                  ★
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <Tooltip show={!!hovered} anchorRect={hovered?.rect ?? null}>
        {hovered ? (
          <RungTooltip
            modality={hovered.modality}
            rungIndex={hovered.rungIndex}
            reached={hovered.reached}
            frontierHere={hovered.frontierHere}
          />
        ) : null}
      </Tooltip>
    </section>
  );
}

function RungTooltip({
  modality,
  rungIndex,
  reached,
  frontierHere,
}: {
  modality: Modality;
  rungIndex: number;
  reached: boolean;
  frontierHere: boolean;
}) {
  const spec = modality.rungs[rungIndex - 1];
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-semibold text-[--color-fg]">{modality.label}</span>
        <span className="num text-[10px] text-[--color-muted]">
          {rungIndex} / 5
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[--color-muted]">
        <span>{spec.label}</span>
        {frontierHere ? (
          <span className="text-[--color-gold]">★ this chapter</span>
        ) : null}
      </div>
      <div
        className="text-[--color-fg]"
        dangerouslySetInnerHTML={{ __html: renderBodyWithCitations(spec.marker) }}
      />
    </div>
  );
}

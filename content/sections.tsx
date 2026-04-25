import type { ReactNode } from "react";

export type Section = { id: string; body: ReactNode };

function SectionHeader({ title, date }: { title: string; date: string }) {
  return (
    <>
      <h2 className="mb-2 font-serif text-3xl font-semibold">{title}</h2>
      <p className="text-[--color-muted]">{date}</p>
    </>
  );
}

function Placeholder() {
  return (
    <p className="italic text-[--color-muted]">
      AI-generated, must revise.
    </p>
  );
}

export const sections: Section[] = [
  {
    id: "prelude",
    body: (
      <>
        <SectionHeader title="Reform & Opening" date="1978 — 1998" />
        <p>
          Modern Chinese biotech does not begin with a startup. It begins with
          Deng Xiaoping&apos;s 1978 National Science Conference and the
          deliberate rebuilding of a research base the Cultural Revolution had
          nearly extinguished — the Chinese Academy of Sciences budget had
          fallen to less than one-sixth of its 1965 level, with hundreds of
          scientists killed or driven to suicide.
        </p>
        <p>
          The funding architecture came in sequence. <em>NSFC</em> was
          established in February 1986 as China&apos;s peer-reviewed basic
          research funder. Weeks later, four senior physicists wrote to Deng,
          and the <em>863 Program</em> was approved within two days, naming
          biotechnology one of seven national high-tech priorities. The{" "}
          <em>Torch Program</em> followed in 1988 to industrialize the output,
          and the <em>973 Program</em> in 1997 funded strategic basic science.
        </p>
        <p>
          The other quiet revolution was human capital. From the early 1990s,
          the state began offering returnees — the <em>haigui</em>, &ldquo;sea
          turtles&rdquo; — labs, budgets, and faculty positions to come home.
          By 1999, when BGI was founded to claim China&apos;s 1% share of the
          Human Genome Project, the institutional ground had been quietly
          prepared.
        </p>
      </>
    ),
  },
  {
    id: "foundations",
    body: (
      <>
        <SectionHeader title="Foundations" date="1999 — 2010" />
        <Placeholder />
      </>
    ),
  },
  {
    id: "scandal",
    body: (
      <>
        <SectionHeader title="The SFDA Scandal" date="2007" />
        <Placeholder />
      </>
    ),
  },
  {
    id: "innovator-generation",
    body: (
      <>
        <SectionHeader title="The Innovator Generation" date="2010 — 2014" />
        <Placeholder />
      </>
    ),
  },
  {
    id: "bi-jingquan-bigbang",
    body: (
      <>
        <SectionHeader title="Bi Jingquan's Big Bang" date="2015 — 2016" />
        <Placeholder />
      </>
    ),
  },
  {
    id: "ich-and-18a",
    body: (
      <>
        <SectionHeader title="ICH and the 18A Boom" date="2017 — 2018" />
        <Placeholder />
      </>
    ),
  },
  {
    id: "license-in-era",
    body: (
      <>
        <SectionHeader title="The License-In Era" date="2019 — 2020" />
        <Placeholder />
      </>
    ),
  },
  {
    id: "vbp-and-value",
    body: (
      <>
        <SectionHeader
          title="VBP Pressure and the Value Turn"
          date="2021 — 2022"
        />
        <Placeholder />
      </>
    ),
  },
  {
    id: "going-global",
    body: (
      <>
        <SectionHeader title="Going Global" date="2023 — 2024" />
        <Placeholder />
      </>
    ),
  },
  {
    id: "frontier-era",
    body: (
      <>
        <SectionHeader title="The Frontier Era" date="2025 — 2026" />
        <p>
          The licensing-out story compounded faster than anyone in 2023 had
          forecast. China&apos;s outbound deals in 2025 reached a record 157
          transactions worth roughly <em>$135.7 billion</em> — more than
          double 2024 — with US drugmakers signing 14 China-asset deals worth
          $18.3 billion in the first half alone. Roughly a third of all
          big-pharma licensing spending in 2025 sourced from China.
        </p>
        <p>
          Akeso&apos;s <em>ivonescimab</em> beat Keytruda head-to-head in
          HARMONi-2 — the first time a Chinese-discovered molecule
          outperformed Merck&apos;s $30B-a-year flagship — and the next signal
          came from somewhere unexpected. Insilico Medicine published positive
          Phase II data for <em>rentosertib</em>, the first AI-discovered,
          AI-designed drug to clear that bar; XtalPi listed under Hong
          Kong&apos;s new Chapter 18C and signed a deal with Gregory
          Verdine&apos;s DoveTree reportedly worth as much as $10 billion.
          The DeepSeek-era frontier-LLM ecosystem began feeding domestic
          protein and genomic foundation models.
        </p>
        <p>
          Decoupling moved in the other direction. The <em>BIOSECURE Act</em>{" "}
          was signed into law on December 17, 2025 as Section 851 of the
          FY2026 NDAA. WuXi divested its US cell-and-gene-therapy and
          device-testing businesses; BeiGene rebranded as{" "}
          <em>BeOne Medicines</em> and redomiciled from the Caymans to Basel.
          The company that had been the canonical American-Chinese hybrid
          biotech was actively distancing itself from China as a corporate
          identity — even as it remained, by every operating metric, the same
          firm.
        </p>
      </>
    ),
  },
];

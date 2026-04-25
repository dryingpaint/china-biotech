import type { ReactNode } from "react";
import DraftTag from "@/components/DraftTag";
import Cite from "@/components/Cite";

export type Section = { id: string; body: ReactNode };

function SectionHeader({ title, date }: { title: string; date: string }) {
  return (
    <>
      <h2 className="mb-2 font-serif text-3xl font-semibold">{title}</h2>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-[--color-muted]">{date}</p>
        <DraftTag />
      </div>
    </>
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
          scientists killed or driven to suicide.<Cite id="deng-1978-conference" />
        </p>
        <p>
          The funding architecture came in sequence. <em>NSFC</em> was
          established in February 1986 as China&apos;s peer-reviewed basic
          research funder. Weeks later, four senior physicists wrote to Deng,
          and the <em>863 Program</em> was approved within two days, naming
          biotechnology one of seven national high-tech priorities.
          <Cite id="863-program-origin" /> The <em>Torch Program</em> followed
          in 1988 to industrialize the output, and the <em>973 Program</em> in
          1997 funded strategic basic science.
        </p>
        <p>
          The other quiet revolution was human capital. From the early 1990s,
          the state began offering returnees — the <em>haigui</em>, &ldquo;sea
          turtles&rdquo; — labs, budgets, and faculty positions to come home.
          <Cite id="haigui-returnees" />
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
        <p>
          For most of the late twentieth century, China&apos;s pharmaceutical
          industry was a generics business. Domestic firms competed on cost, not
          discovery. The few real research outfits were state-linked or
          academic; the few biotechs that existed — <em>3SBio</em>,{" "}
          <em>Hengrui Medicine</em> — built their early franchises on
          off-patent biologics or reformulated small molecules.
        </p>
        <p>
          Two enabling institutions appeared during this era. <em>BGI</em> was
          founded in 1999 to participate in the Human Genome Project, and quickly
          became the largest sequencing operation in the world. <em>WuXi
          AppTec</em> was founded in 2000 to provide chemistry services to
          Western pharma; it would grow into the backbone of China&apos;s drug
          development outsourcing economy.
        </p>
      </>
    ),
  },
  {
    id: "scandal",
    body: (
      <>
        <SectionHeader title="The SFDA Scandal" date="2007" />
        <p>
          In July 2007, China executed Zheng Xiaoyu, the former director of the
          State Food and Drug Administration, for accepting bribes to approve
          unsafe drugs.<Cite id="zheng-xiaoyu-execution" /> It was a public confession that the country&apos;s
          approval system had collapsed under corruption.
        </p>
        <p>
          Backlogs swelled. By the early 2010s, more than twenty thousand
          applications were pending review. International regulators viewed
          Chinese clinical data with deep skepticism. The reformist case became
          unanswerable.
        </p>
      </>
    ),
  },
  {
    id: "innovator-generation",
    body: (
      <>
        <SectionHeader title="The Innovator Generation" date="2010 — 2014" />
        <p>
          Between 2010 and 2014, a generation of true biotechs was founded —
          most by returnees from American or European pharma. <em>BeiGene</em>{" "}
          (2010) would eventually beat Imbruvica head-to-head with Brukinsa.{" "}
          <em>Innovent</em> (2011), <em>Junshi</em> (2012) and <em>Akeso</em>{" "}
          (2012) built oncology pipelines. <em>Zai Lab</em> (2014) defined the
          license-in playbook. <em>Legend Biotech</em> (2014) began the CAR-T
          program that became Carvykti.
        </p>
        <p>
          The companies existed. The regulatory architecture they needed did
          not.
        </p>
      </>
    ),
  },
  {
    id: "bi-jingquan-bigbang",
    body: (
      <>
        <SectionHeader title="Bi Jingquan's Big Bang" date="2015 — 2016" />
        <p>
          In July 2015, the CFDA issued <em>Order 117</em> — the so-called 722
          self-inspection.<Cite id="order-117-722" /> Sponsors were given a
          window to withdraw clinical trial applications voluntarily, or face
          an audit. Roughly eighty percent of pending applications were pulled.
          The data, it turned out, was largely fabricated.
        </p>
        <p>
          What followed was a four-year overhaul under commissioner Bi Jingquan:<Cite id="bi-jingquan-reform-overview" />
          a priority review pathway for innovative drugs, a Marketing
          Authorization Holder pilot that decoupled drug ownership from
          manufacturing, and the first conditional approvals for breakthrough
          therapies. The regime that had executed Zheng Xiaoyu was dismantling
          itself.
        </p>
      </>
    ),
  },
  {
    id: "ich-and-18a",
    body: (
      <>
        <SectionHeader title="ICH and the 18A Boom" date="2017 — 2018" />
        <p>
          In June 2017, China joined the <em>International Council for
          Harmonisation</em> — the body that sets pharmaceutical standards in
          the US, EU and Japan.<Cite id="ich-china-membership" /> Foreign
          clinical data could now support Chinese approvals; Chinese trials, in
          turn, could feed global filings.
        </p>
        <p>
          In April 2018, the Hong Kong Stock Exchange enacted{" "}
          <em>Chapter 18A</em>, allowing pre-revenue biotechs to list.<Cite id="hkex-18a-rule" /> Tens of
          billions of dollars flowed in within eighteen months. Innovent,
          BeiGene, Junshi, Hansoh — the first wave of innovator IPOs went off in
          rapid succession.
        </p>
        <p>
          That same year, the National Healthcare Security Administration was
          created and <em>Volume-Based Procurement</em> began in pilot cities,
          collapsing generic prices and forcing the industry, slowly, toward
          drugs that could justify a premium.
        </p>
      </>
    ),
  },
  {
    id: "license-in-era",
    body: (
      <>
        <SectionHeader title="The License-In Era" date="2019 — 2020" />
        <p>
          For three years, the easiest way to build a Chinese biotech was to buy
          rights to Western assets. Zai Lab pioneered the model; dozens of
          imitators followed. The STAR Market opened in Shanghai in mid-2019,
          giving biotechs a domestic listing venue alongside Hong Kong.
        </p>
        <p>
          Then COVID arrived. Sinovac and CanSino scaled vaccine production to
          unprecedented levels; Abogen Biosciences emerged as the country&apos;s
          flagship mRNA platform. The pandemic also accelerated the regulatory
          pipeline — emergency authorization frameworks bled into permanent
          accelerated pathways.
        </p>
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
        <p>
          By 2021, VBP had expanded to biologics.<Cite id="vbp-impact-prices" />
          The PD-1 class — flooded with domestic me-toos — was being negotiated
          down by the NHSA to a small fraction of US prices. NMPA published
          guidelines explicitly demanding oncology drugs prove themselves
          against the standard of care, not against placebo.<Cite id="value-oriented-onc-guideline" />
        </p>
        <p>
          The funding environment turned sharply. HK biotech valuations
          collapsed. The cohort that had IPO&apos;d in the 18A boom was forced
          to either differentiate or consolidate. The survivors began turning
          outward.
        </p>
      </>
    ),
  },
  {
    id: "going-global",
    body: (
      <>
        <SectionHeader title="Going Global" date="2023 — 2024" />
        <p>
          The flow reversed. License-out deals — Chinese companies selling
          rights to Western pharma — overtook license-in for the first time.
          Kelun Biotech&apos;s ADC partnerships with Merck were valued at over
          $9 billion.<Cite id="kelun-merck-adc-deal" /> Duality Biologics
          signed a $1.5B+ ADC deal with BioNTech. LaNova Medicines licensed
          its PD-1/VEGF bispecific to Merck for $3.3B.<Cite id="lanova-merck-deal" />
          Akeso&apos;s ivonescimab — partnered to Summit Therapeutics — beat
          Keytruda in a head-to-head Phase III.<Cite id="ivonescimab-phase3" />
        </p>
        <p>
          Meanwhile in Washington, the <em>BIOSECURE Act</em> was introduced,<Cite id="biosecure-act-text" />
          targeting WuXi AppTec, WuXi Biologics, BGI and MGI. The CRO/CDMO
          stack that had built the industry was suddenly a geopolitical
          liability. The story that opens in 2026 is no longer about whether
          China can innovate. It is about whether the world will let it.
        </p>
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
          AI-designed drug to clear that bar;<Cite id="insilico-tnik-phase2" /> XtalPi listed under Hong
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

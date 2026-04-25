import type { ReactNode } from "react";

export type Section = { id: string; body: ReactNode };

export const sections: Section[] = [
  {
    id: "foundations",
    body: (
      <>
        <h2 className="mb-2 font-serif text-3xl font-semibold">Foundations</h2>
        <p className="text-[--color-muted]">1999 — 2010</p>
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
        <h2 className="mb-2 font-serif text-3xl font-semibold">
          The SFDA Scandal
        </h2>
        <p className="text-[--color-muted]">2007</p>
        <p>
          In July 2007, China executed Zheng Xiaoyu, the former director of the
          State Food and Drug Administration, for accepting bribes to approve
          unsafe drugs. It was a public confession that the country&apos;s
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
        <h2 className="mb-2 font-serif text-3xl font-semibold">
          The Innovator Generation
        </h2>
        <p className="text-[--color-muted]">2010 — 2014</p>
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
        <h2 className="mb-2 font-serif text-3xl font-semibold">
          Bi Jingquan&apos;s Big Bang
        </h2>
        <p className="text-[--color-muted]">2015 — 2016</p>
        <p>
          In July 2015, the CFDA issued <em>Order 117</em> — the so-called 722
          self-inspection. Sponsors were given a window to withdraw clinical
          trial applications voluntarily, or face an audit. Roughly eighty
          percent of pending applications were pulled. The data, it turned out,
          was largely fabricated.
        </p>
        <p>
          What followed was a four-year overhaul under commissioner Bi Jingquan:
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
        <h2 className="mb-2 font-serif text-3xl font-semibold">
          ICH and the 18A Boom
        </h2>
        <p className="text-[--color-muted]">2017 — 2018</p>
        <p>
          In June 2017, China joined the <em>International Council for
          Harmonisation</em> — the body that sets pharmaceutical standards in
          the US, EU and Japan. Foreign clinical data could now support Chinese
          approvals; Chinese trials, in turn, could feed global filings.
        </p>
        <p>
          In April 2018, the Hong Kong Stock Exchange enacted{" "}
          <em>Chapter 18A</em>, allowing pre-revenue biotechs to list. Tens of
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
        <h2 className="mb-2 font-serif text-3xl font-semibold">
          The License-In Era
        </h2>
        <p className="text-[--color-muted]">2019 — 2020</p>
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
        <h2 className="mb-2 font-serif text-3xl font-semibold">
          VBP Pressure and the Value Turn
        </h2>
        <p className="text-[--color-muted]">2021 — 2022</p>
        <p>
          By 2021, VBP had expanded to biologics. The PD-1 class — flooded with
          domestic me-toos — was being negotiated down by the NHSA to a small
          fraction of US prices. NMPA published guidelines explicitly demanding
          oncology drugs prove themselves against the standard of care, not
          against placebo.
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
        <h2 className="mb-2 font-serif text-3xl font-semibold">Going Global</h2>
        <p className="text-[--color-muted]">2023 — 2024</p>
        <p>
          The flow reversed. License-out deals — Chinese companies selling
          rights to Western pharma — overtook license-in for the first time.
          Kelun Biotech&apos;s ADC partnerships with Merck were valued at over
          $9 billion. Duality Biologics signed a $1.5B+ ADC deal with BioNTech.
          LaNova Medicines licensed its PD-1/VEGF bispecific to Merck for $3.3B.
          Akeso&apos;s ivonescimab — partnered to Summit Therapeutics — beat
          Keytruda in a head-to-head Phase III.
        </p>
        <p>
          Meanwhile in Washington, the <em>BIOSECURE Act</em> was introduced,
          targeting WuXi AppTec, WuXi Biologics, BGI and MGI. The CRO/CDMO
          stack that had built the industry was suddenly a geopolitical
          liability. The story that opens in 2026 is no longer about whether
          China can innovate. It is about whether the world will let it.
        </p>
      </>
    ),
  },
];

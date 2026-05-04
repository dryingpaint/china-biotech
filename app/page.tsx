import SplitPanel from "@/components/Layout/SplitPanel";
import Dashboard from "@/components/Dashboard/Dashboard";
import Scroller from "@/components/Narrative/Scroller";
import Bibliography from "@/components/Bibliography";
import chapters from "@/data/chapters.json";
import site from "@/data/site.json";
import type { Chapter, SiteContent } from "@/lib/types";
import { renderBodyWithCitations } from "@/lib/citations";

export default function Home() {
  const siteContent = site as SiteContent;
  const visibleChapters = (chapters as unknown as Chapter[]).filter(
    (c) => !c.hidden,
  );
  return (
    <main>
      <Hero site={siteContent} />
      {siteContent.intro && <Intro html={siteContent.intro} />}
      <SplitPanel
        narrative={<Scroller chapters={visibleChapters} />}
        dashboard={<Dashboard />}
      />
      <Bibliography />
    </main>
  );
}

function Hero({ site }: { site: SiteContent }) {
  return (
    <header className="mx-auto max-w-3xl px-6 pb-16 pt-32 text-center">
      <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
        {site.heroTitle}
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[--color-muted]">
        {site.heroSubtitle}
      </p>
      <div className="dashboard mt-10 text-xs uppercase tracking-[0.25em] text-[--color-muted]">
        {site.heroByline}
      </div>
    </header>
  );
}

function Intro({ html }: { html: string }) {
  return (
    <section className="mx-auto max-w-2xl px-6 pb-20">
      <div
        className="prose-narrative space-y-5 text-[18px] leading-[1.7]"
        dangerouslySetInnerHTML={{ __html: renderBodyWithCitations(html) }}
      />
    </section>
  );
}

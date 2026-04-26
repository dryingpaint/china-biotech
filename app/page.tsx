import SplitPanel from "@/components/Layout/SplitPanel";
import Dashboard from "@/components/Dashboard/Dashboard";
import Scroller from "@/components/Narrative/Scroller";
import Bibliography from "@/components/Bibliography";
import chapters from "@/data/chapters.json";
import site from "@/data/site.json";
import type { Chapter, SiteContent } from "@/lib/types";

export default function Home() {
  return (
    <main>
      <Hero site={site as SiteContent} />
      <SplitPanel
        narrative={<Scroller chapters={chapters as unknown as Chapter[]} />}
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

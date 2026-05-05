import Bibliography from "@/components/Bibliography";
import AllChaptersPanel from "@/components/Narrative/AllChaptersPanel";
import chapters from "@/data/chapters.json";
import site from "@/data/site.json";
import type { Chapter, SiteContent } from "@/lib/types";
import { renderBodyWithCitations } from "@/lib/citations";

export default function AllChaptersPage() {
  const siteContent = site as SiteContent;
  const allChapters = chapters as unknown as Chapter[];
  return (
    <main>
      <Hero site={siteContent} />
      {siteContent.intro && <Intro html={siteContent.intro} />}
      <TableOfContents chapters={allChapters} />
      <AllChaptersPanel />
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
        {site.heroByline} · all chapters
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

function TableOfContents({ chapters }: { chapters: Chapter[] }) {
  return (
    <section className="mx-auto max-w-2xl px-6 pb-24">
      <div className="dashboard mb-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-accent]">
        Contents
      </div>
      <ol className="divide-y divide-[--color-rule] border-y border-[--color-rule]">
        {chapters.map((c, i) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              className="flex items-baseline gap-4 py-3 text-[--color-fg] transition-colors hover:text-[--color-accent]"
            >
              <span className="w-6 font-mono text-xs tabular-nums text-[--color-muted]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 font-serif text-lg">{c.title}</span>
              <span className="text-xs uppercase tracking-[0.12em] text-[--color-muted]">
                {c.date}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

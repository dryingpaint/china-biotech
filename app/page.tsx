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
  const allChapters = chapters as unknown as Chapter[];
  const tocChapters = allChapters.filter((c) => !c.hidden);
  const visibleChapters = allChapters.filter((c) => !c.hidden && !c.draft);
  return (
    <main>
      <Hero site={siteContent} />
      {siteContent.intro && <Intro html={siteContent.intro} />}
      <TableOfContents chapters={tocChapters} />
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

function TableOfContents({ chapters }: { chapters: Chapter[] }) {
  return (
    <section className="mx-auto max-w-2xl px-6 pb-24">
      <div className="dashboard mb-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-accent]">
        Contents
      </div>
      <ol className="divide-y divide-[--color-rule] border-y border-[--color-rule]">
        {chapters.map((c, i) => {
          const pending = !!c.draft;
          const num = (
            <span className="w-6 font-mono text-xs tabular-nums text-[--color-muted]">
              {String(i + 1).padStart(2, "0")}
            </span>
          );
          const title = (
            <span
              className={`flex-1 font-serif text-lg ${pending ? "text-[--color-muted]" : ""}`}
            >
              {c.title}
            </span>
          );
          const tag = pending && (
            <span className="rounded border border-[--color-rule] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-muted]">
              Pending
            </span>
          );
          const date = (
            <span className="text-xs uppercase tracking-[0.12em] text-[--color-muted]">
              {c.date}
            </span>
          );
          return (
            <li key={c.id}>
              {pending ? (
                <div className="flex items-baseline gap-4 py-3">
                  {num}
                  {title}
                  {tag}
                  {date}
                </div>
              ) : (
                <a
                  href={`#${c.id}`}
                  className="flex items-baseline gap-4 py-3 text-[--color-fg] transition-colors hover:text-[--color-accent]"
                >
                  {num}
                  {title}
                  {date}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

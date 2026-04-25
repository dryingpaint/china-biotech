import SplitPanel from "@/components/Layout/SplitPanel";
import Dashboard from "@/components/Dashboard/Dashboard";
import Scroller from "@/components/Narrative/Scroller";
import DraftTag from "@/components/DraftTag";
import Bibliography from "@/components/Bibliography";
import { sections } from "@/content/sections";

export default function Home() {
  return (
    <main>
      <DraftBanner />
      <Hero />
      <SplitPanel
        narrative={<Scroller sections={sections} />}
        dashboard={<Dashboard />}
      />
      <Bibliography />
      <Footer />
    </main>
  );
}

function DraftBanner() {
  return (
    <div className="dashboard sticky top-0 z-40 border-b border-[--color-accent]/40 bg-[--color-accent]/10 px-4 py-1.5 text-center text-[11px] uppercase tracking-[0.2em] text-[--color-accent]">
      Draft — all content and figures may be inaccurate
    </div>
  );
}

function Hero() {
  return (
    <header className="mx-auto max-w-3xl px-6 pb-16 pt-32 text-center">
      <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
        How China became a global biotech power
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[--color-muted]">
        From a generics-only industry crippled by fraud, to a pipeline now
        feeding global pharma deals — one regulatory reform at a time.
      </p>
      <div className="mt-8 flex justify-center">
        <DraftTag size="md" />
      </div>
      <div className="dashboard mt-10 text-xs uppercase tracking-[0.25em] text-[--color-muted]">
        Melissa Du
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="dashboard mx-auto max-w-3xl px-6 py-24 text-center text-xs text-[--color-muted]">
      Draft. Numbers are illustrative — refine before publishing.
    </footer>
  );
}

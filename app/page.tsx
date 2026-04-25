import SplitPanel from "@/components/Layout/SplitPanel";
import Dashboard from "@/components/Dashboard/Dashboard";
import Scroller from "@/components/Narrative/Scroller";
import { sections } from "@/content/sections";

export default function Home() {
  return (
    <main>
      <Hero />
      <SplitPanel
        narrative={<Scroller sections={sections} />}
        dashboard={<Dashboard />}
      />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <header className="mx-auto max-w-3xl px-6 pb-16 pt-32 text-center">
      <div className="dashboard text-xs uppercase tracking-[0.25em] text-[--color-muted]">
        A scrollable history
      </div>
      <h1 className="mt-3 text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
        How China became a global biotech power
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[--color-muted]">
        From a generics-only industry crippled by fraud, to a pipeline now
        feeding global pharma deals — one regulatory reform at a time.
      </p>
      <div className="dashboard mt-10 text-xs text-[--color-muted]">
        Scroll to begin ↓
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

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
    </main>
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
      <div className="dashboard mt-10 text-xs uppercase tracking-[0.25em] text-[--color-muted]">
        Melissa Du
      </div>
    </header>
  );
}

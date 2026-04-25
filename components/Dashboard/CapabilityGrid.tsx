"use client";

import { useNarrative } from "@/lib/narrativeStore";

type Capability = {
  id: string;
  label: string;
  unlockChapterIndex: number;
};

const CAPABILITIES: Capability[] = [
  { id: "generics", label: "Generics", unlockChapterIndex: 0 },
  { id: "biosimilars", label: "Biosimilars", unlockChapterIndex: 3 },
  { id: "pd1", label: "PD-1 / PD-L1", unlockChapterIndex: 5 },
  { id: "adc", label: "ADCs", unlockChapterIndex: 6 },
  { id: "bispecifics", label: "Bispecifics", unlockChapterIndex: 6 },
  { id: "cart", label: "CAR-T", unlockChapterIndex: 7 },
  { id: "mrna", label: "mRNA", unlockChapterIndex: 7 },
  { id: "first-in-class", label: "First-in-class", unlockChapterIndex: 8 },
  { id: "global-pivotal", label: "Global pivotal", unlockChapterIndex: 9 },
  { id: "ai-bio", label: "AI-discovered", unlockChapterIndex: 9 },
];

export default function CapabilityGrid() {
  const idx = useNarrative((s) => s.currentIndex);
  return (
    <section className="space-y-2">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[--color-muted]">
        Therapeutic capabilities
      </h3>
      <div className="grid grid-cols-3 gap-1.5">
        {CAPABILITIES.map((c) => {
          const unlocked = idx >= c.unlockChapterIndex;
          return (
            <div
              key={c.id}
              className={[
                "rounded-md border px-2 py-1.5 text-[11px] transition-all",
                unlocked
                  ? "border-[--color-accent] bg-[--color-accent]/10 text-[--color-fg]"
                  : "border-[--color-rule] bg-transparent text-[--color-rule]",
              ].join(" ")}
            >
              {c.label}
            </div>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { useNarrative } from "@/lib/narrativeStore";

export default function DateHeader() {
  const chapter = useNarrative((s) => s.visibleChapters[s.currentIndex]);
  return (
    <div className="flex items-baseline justify-between border-b border-[--color-rule] pb-3">
      <span className="num inline-flex items-center rounded-md bg-[--color-fg] px-2.5 py-1 text-xs font-medium tracking-wide text-[--color-bg]">
        {chapter.date}
      </span>
      <span className="text-xs uppercase tracking-[0.18em] text-[--color-muted]">
        {chapter.title}
      </span>
    </div>
  );
}

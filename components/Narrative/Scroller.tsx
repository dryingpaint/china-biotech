"use client";

import { Scrollama, Step } from "react-scrollama";
import { useNarrative } from "@/lib/narrativeStore";
import type { Chapter } from "@/lib/types";

export default function Scroller({ chapters }: { chapters: Chapter[] }) {
  const setIndex = useNarrative((s) => s.setCurrentIndex);

  return (
    <Scrollama
      offset={0.55}
      onStepEnter={({ data }) => {
        if (typeof data === "number") setIndex(data);
      }}
    >
      {chapters.map((chapter, i) => (
        <Step key={chapter.id} data={i}>
          <section
            id={chapter.id}
            className="mx-auto max-w-2xl py-[40vh] first:pt-[20vh] last:pb-[40vh]"
          >
            <ChapterBody chapter={chapter} />
          </section>
        </Step>
      ))}
    </Scrollama>
  );
}

export function ChapterBody({ chapter }: { chapter: Chapter }) {
  return (
    <div className="prose-narrative space-y-5 text-[18px] leading-[1.7]">
      <h2 className="mb-2 font-serif text-3xl font-semibold">{chapter.title}</h2>
      <p className="text-[--color-muted]">{chapter.date}</p>
      <div
        className="space-y-5"
        dangerouslySetInnerHTML={{ __html: chapter.body }}
      />
    </div>
  );
}

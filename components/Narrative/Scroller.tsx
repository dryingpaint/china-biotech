"use client";

import { Scrollama, Step } from "react-scrollama";
import { useEffect, useRef } from "react";
import { useNarrative, type EntityRef } from "@/lib/narrativeStore";
import { renderBodyWithCitations } from "@/lib/citations";
import type { Chapter } from "@/lib/types";

export default function Scroller({ chapters: _chapters }: { chapters: Chapter[] }) {
  const setIndex = useNarrative((s) => s.setCurrentIndex);
  const visibleChapters = useNarrative((s) => s.visibleChapters);

  return (
    <Scrollama
      offset={0.55}
      onStepEnter={({ data }) => {
        if (typeof data === "number") setIndex(data);
      }}
    >
      {visibleChapters.map((chapter, i) => (
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
  const setHighlight = useNarrative((s) => s.setHighlightedEntity);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const findEntity = (target: EventTarget | null): EntityRef | null => {
      if (!(target instanceof Element)) return null;
      const el = target.closest<HTMLElement>("[data-entity-type]");
      if (!el) return null;
      const type = el.getAttribute("data-entity-type");
      const id = el.getAttribute("data-entity-id");
      if ((type !== "entity" && type !== "reform") || !id) return null;
      return { type, id };
    };
    const handleOver = (e: Event) => {
      const entity = findEntity(e.target);
      if (entity) setHighlight(entity);
    };
    const handleOut = (e: Event) => {
      const entity = findEntity(e.target);
      if (entity) setHighlight(null);
    };
    const handleClick = (e: Event) => {
      if (!(e.target instanceof Element)) return;
      const trigger = e.target.closest<HTMLButtonElement>(".deepdive-trigger");
      if (!trigger || !root.contains(trigger)) return;
      e.preventDefault();
      const id = trigger.getAttribute("data-deepdive-id");
      if (!id) return;
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!expanded));
      const selector = `.deepdive-content[data-deepdive-id="${CSS.escape(id)}"]`;
      const content = root.querySelector<HTMLElement>(selector);
      if (content) {
        if (expanded) content.setAttribute("hidden", "");
        else content.removeAttribute("hidden");
      }
    };
    root.addEventListener("mouseover", handleOver);
    root.addEventListener("mouseout", handleOut);
    root.addEventListener("click", handleClick);
    return () => {
      root.removeEventListener("mouseover", handleOver);
      root.removeEventListener("mouseout", handleOut);
      root.removeEventListener("click", handleClick);
    };
  }, [setHighlight]);

  return (
    <div className="prose-narrative space-y-5 text-[18px] leading-[1.7]">
      <h2 className="mb-2 font-serif text-3xl font-semibold">{chapter.title}</h2>
      <p className="text-[--color-muted]">{chapter.date}</p>
      <div
        ref={ref}
        className="space-y-5"
        dangerouslySetInnerHTML={{
          __html: renderBodyWithCitations(chapter.body),
        }}
      />
    </div>
  );
}

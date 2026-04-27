"use client";

import { useEffect, useRef, useState } from "react";
import { useNarrative, type EntityRef } from "@/lib/narrativeStore";
import { renderBodyWithCitations } from "@/lib/citations";
import Tooltip from "@/components/Tooltip";
import type { Chapter } from "@/lib/types";

const TRIGGER_OFFSET = 0.55; // chapter "active" once its top crosses this fraction of the viewport

type HoveredNote = { rect: DOMRect; text: string };

export default function Scroller({ chapters: _chapters }: { chapters: Chapter[] }) {
  const setIndex = useNarrative((s) => s.setCurrentIndex);
  const visibleChapters = useNarrative((s) => s.visibleChapters);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const [hoveredNote, setHoveredNote] = useState<HoveredNote | null>(null);

  // Active chapter tracking — sync immediately on mount, then on every scroll/resize.
  useEffect(() => {
    const update = () => {
      const triggerY = window.innerHeight * TRIGGER_OFFSET;
      let activeIdx = 0;
      for (let i = 0; i < sectionRefs.current.length; i++) {
        const el = sectionRefs.current[i];
        if (!el) continue;
        if (el.getBoundingClientRect().top <= triggerY) activeIdx = i;
        else break;
      }
      setIndex(activeIdx);
    };

    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [setIndex, visibleChapters.length]);

  // Note-ref tooltip — single page-level listener; shows when cursor enters
  // a .note-ref, hides on every other transition.
  useEffect(() => {
    const onMouseOver = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return;
      const note = e.target.closest<HTMLElement>(".note-ref");
      const text = note?.getAttribute("data-tooltip");
      setHoveredNote(note && text ? { rect: note.getBoundingClientRect(), text } : null);
    };
    document.addEventListener("mouseover", onMouseOver);
    return () => document.removeEventListener("mouseover", onMouseOver);
  }, []);

  return (
    <>
      {visibleChapters.map((chapter, i) => (
        <section
          key={chapter.id}
          id={chapter.id}
          ref={(el) => {
            sectionRefs.current[i] = el;
          }}
          className="mx-auto max-w-2xl py-[40vh] first:pt-[20vh] last:pb-[40vh]"
        >
          <ChapterBody chapter={chapter} />
        </section>
      ))}
      <Tooltip
        show={!!hoveredNote}
        anchorRect={hoveredNote?.rect ?? null}
        width={280}
      >
        {hoveredNote ? (
          <p className="text-[12px] leading-relaxed">{hoveredNote.text}</p>
        ) : null}
      </Tooltip>
    </>
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
      const type = el?.getAttribute("data-entity-type");
      const id = el?.getAttribute("data-entity-id");
      if ((type !== "entity" && type !== "reform") || !id) return null;
      return { type, id };
    };
    const onOver = (e: Event) => {
      const entity = findEntity(e.target);
      if (entity) setHighlight(entity);
    };
    const onOut = (e: Event) => {
      if (findEntity(e.target)) setHighlight(null);
    };
    const onClick = (e: Event) => {
      if (!(e.target instanceof Element)) return;
      const trigger = e.target.closest<HTMLButtonElement>(".deepdive-trigger");
      if (!trigger || !root.contains(trigger)) return;
      e.preventDefault();
      const id = trigger.getAttribute("data-deepdive-id");
      if (!id) return;
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!expanded));
      const content = root.querySelector<HTMLElement>(
        `.deepdive-content[data-deepdive-id="${CSS.escape(id)}"]`,
      );
      if (content) {
        if (expanded) content.setAttribute("hidden", "");
        else content.removeAttribute("hidden");
      }
    };

    root.addEventListener("mouseover", onOver);
    root.addEventListener("mouseout", onOut);
    root.addEventListener("click", onClick);
    return () => {
      root.removeEventListener("mouseover", onOver);
      root.removeEventListener("mouseout", onOut);
      root.removeEventListener("click", onClick);
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

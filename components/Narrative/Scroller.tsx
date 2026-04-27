"use client";

import { useEffect, useRef, useState } from "react";
import { useNarrative, type EntityRef } from "@/lib/narrativeStore";
import { renderBodyWithCitations } from "@/lib/citations";
import Tooltip from "@/components/Tooltip";
import type { Chapter } from "@/lib/types";

const TRIGGER_OFFSET = 0.55; // chapter "active" once its top crosses this fraction of the viewport

export default function Scroller({ chapters: _chapters }: { chapters: Chapter[] }) {
  const setIndex = useNarrative((s) => s.setCurrentIndex);
  const visibleChapters = useNarrative((s) => s.visibleChapters);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const update = () => {
      const triggerY = window.innerHeight * TRIGGER_OFFSET;
      let activeIdx = 0;
      for (let i = 0; i < sectionRefs.current.length; i++) {
        const el = sectionRefs.current[i];
        if (!el) continue;
        if (el.getBoundingClientRect().top <= triggerY) {
          activeIdx = i;
        } else {
          break;
        }
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

    update(); // sync immediately on mount so deep-links and refreshes land on the right chapter
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [setIndex, visibleChapters.length]);

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
    </>
  );
}

type HoveredNote = { rect: DOMRect; text: string };

export function ChapterBody({ chapter }: { chapter: Chapter }) {
  const setHighlight = useNarrative((s) => s.setHighlightedEntity);
  const ref = useRef<HTMLDivElement>(null);
  const [hoveredNote, setHoveredNote] = useState<HoveredNote | null>(null);

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

    // Direct mouseenter/mouseleave on each note-ref. No grace period, instant
    // dismiss on leave. Tooltip is non-interactive (pointer-events: none) so
    // the cursor moving over it can never keep it alive.
    const noteRefs = root.querySelectorAll<HTMLElement>(".note-ref");
    const noteCleanups: Array<() => void> = [];
    noteRefs.forEach((note) => {
      const text = note.getAttribute("data-tooltip");
      if (!text) return;
      const onEnter = () =>
        setHoveredNote({ rect: note.getBoundingClientRect(), text });
      const onLeave = () => setHoveredNote(null);
      note.addEventListener("mouseenter", onEnter);
      note.addEventListener("mouseleave", onLeave);
      note.addEventListener("focus", onEnter);
      note.addEventListener("blur", onLeave);
      noteCleanups.push(() => {
        note.removeEventListener("mouseenter", onEnter);
        note.removeEventListener("mouseleave", onLeave);
        note.removeEventListener("focus", onEnter);
        note.removeEventListener("blur", onLeave);
      });
    });

    root.addEventListener("mouseover", handleOver);
    root.addEventListener("mouseout", handleOut);
    root.addEventListener("click", handleClick);
    return () => {
      root.removeEventListener("mouseover", handleOver);
      root.removeEventListener("mouseout", handleOut);
      root.removeEventListener("click", handleClick);
      noteCleanups.forEach((c) => c());
    };
  }, [setHighlight, chapter.body]);

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
      <Tooltip
        show={!!hoveredNote}
        anchorRect={hoveredNote?.rect ?? null}
        width={280}
      >
        {hoveredNote ? (
          <p className="text-[12px] leading-relaxed">{hoveredNote.text}</p>
        ) : null}
      </Tooltip>
    </div>
  );
}

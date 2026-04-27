"use client";

import { Scrollama, Step } from "react-scrollama";
import { useEffect, useRef, useState } from "react";
import { useNarrative, type EntityRef } from "@/lib/narrativeStore";
import { renderBodyWithCitations } from "@/lib/citations";
import Tooltip from "@/components/Tooltip";
import type { Chapter } from "@/lib/types";

const NOTE_HIDE_GRACE_MS = 80;

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

type HoveredNote = { rect: DOMRect; text: string };

export function ChapterBody({ chapter }: { chapter: Chapter }) {
  const setHighlight = useNarrative((s) => s.setHighlightedEntity);
  const ref = useRef<HTMLDivElement>(null);
  const [hoveredNote, setHoveredNote] = useState<HoveredNote | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelHideNote = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };
  const scheduleHideNote = () => {
    cancelHideNote();
    hideTimer.current = setTimeout(() => setHoveredNote(null), NOTE_HIDE_GRACE_MS);
  };

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
    const findNote = (target: EventTarget | null): HTMLElement | null => {
      if (!(target instanceof Element)) return null;
      return target.closest<HTMLElement>(".note-ref");
    };
    const handleOver = (e: Event) => {
      const entity = findEntity(e.target);
      if (entity) setHighlight(entity);
      const note = findNote(e.target);
      if (note) {
        const text = note.getAttribute("data-tooltip");
        if (text) {
          cancelHideNote();
          setHoveredNote({ rect: note.getBoundingClientRect(), text });
        }
      }
    };
    const handleOut = (e: Event) => {
      const entity = findEntity(e.target);
      if (entity) setHighlight(null);
      const note = findNote(e.target);
      if (note) scheduleHideNote();
    };
    const handleFocusIn = (e: Event) => {
      const note = findNote(e.target);
      if (!note) return;
      const text = note.getAttribute("data-tooltip");
      if (text) {
        cancelHideNote();
        setHoveredNote({ rect: note.getBoundingClientRect(), text });
      }
    };
    const handleFocusOut = (e: Event) => {
      if (findNote(e.target)) scheduleHideNote();
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
    root.addEventListener("focusin", handleFocusIn);
    root.addEventListener("focusout", handleFocusOut);
    root.addEventListener("click", handleClick);
    return () => {
      root.removeEventListener("mouseover", handleOver);
      root.removeEventListener("mouseout", handleOut);
      root.removeEventListener("focusin", handleFocusIn);
      root.removeEventListener("focusout", handleFocusOut);
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
      <Tooltip
        show={!!hoveredNote}
        anchorRect={hoveredNote?.rect ?? null}
        width={300}
      >
        {hoveredNote ? (
          <p className="text-[12px] leading-relaxed">{hoveredNote.text}</p>
        ) : null}
      </Tooltip>
    </div>
  );
}

"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useNarrative, type EntityRef } from "@/lib/narrativeStore";
import { renderBodyWithCitations } from "@/lib/citations";
import Tooltip from "@/components/Tooltip";
import InlineChart from "./InlineChart";
import type { Chapter, InlineChart as InlineChartType, ModalityKey } from "@/lib/types";

const MODALITY_KEYS: readonly ModalityKey[] = [
  "smallMol",
  "peptide",
  "recombinant",
  "biosimilar",
  "novelMab",
  "bispecific",
  "adc",
  "vaccine",
  "cellTherapy",
  "nucleicAcid",
  "geneTherapy",
  "radiopharm",
];
const MODALITY_KEY_SET = new Set<string>(MODALITY_KEYS);

const CHART_SPLIT = /(\[\[chart:[a-z0-9-]+\]\])/g;
const CHART_MATCH = /^\[\[chart:([a-z0-9-]+)\]\]$/;

function renderBodyWithCharts(
  body: string,
  charts: InlineChartType[] | undefined,
) {
  const chartMap = new Map((charts ?? []).map((c) => [c.id, c]));
  const segments = body.split(CHART_SPLIT);
  return segments.map((seg, i) => {
    const m = seg.match(CHART_MATCH);
    if (m) {
      const chart = chartMap.get(m[1]);
      return chart ? <InlineChart key={`chart-${i}`} chart={chart} /> : null;
    }
    if (!seg) return null;
    return (
      <div
        key={`prose-${i}`}
        dangerouslySetInnerHTML={{ __html: renderBodyWithCitations(seg) }}
      />
    );
  });
}

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
  const setHighlightedModality = useNarrative((s) => s.setHighlightedModality);
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
    const findModality = (
      target: EventTarget | null,
    ): { key: ModalityKey; rung: number | null } | null => {
      if (!(target instanceof Element)) return null;
      const el = target.closest<HTMLElement>(".metric-ref[data-metric-key]");
      const key = el?.getAttribute("data-metric-key");
      if (!key || !MODALITY_KEY_SET.has(key)) return null;
      const rungAttr = el?.getAttribute("data-metric-rung");
      const rung = rungAttr ? parseInt(rungAttr, 10) : null;
      return { key: key as ModalityKey, rung };
    };
    const onOver = (e: Event) => {
      const entity = findEntity(e.target);
      if (entity) setHighlight(entity);
      const modality = findModality(e.target);
      if (modality) setHighlightedModality(modality);
    };
    const onOut = (e: Event) => {
      if (findEntity(e.target)) setHighlight(null);
      if (findModality(e.target)) setHighlightedModality(null);
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
  }, [setHighlight, setHighlightedModality]);

  const hasShiftBlock = !!chapter.shift || (chapter.outcomes?.length ?? 0) > 0;

  return (
    <div className="prose-narrative space-y-5 text-[18px] leading-[1.7]">
      <h2 className="mb-2 font-serif text-3xl font-semibold">{chapter.title}</h2>
      <p className="text-[--color-muted]">{chapter.date}</p>
      <div ref={ref} className="space-y-5">
        {hasShiftBlock && (
          <aside className="shift-outcomes my-2 space-y-3 border-y border-[--color-rule] py-4">
            {chapter.shift && (
              <div className="space-y-1">
                <div className="shift-outcomes-label">The shift</div>
                <p
                  className="text-[16px] leading-snug"
                  dangerouslySetInnerHTML={{
                    __html: renderBodyWithCitations(chapter.shift),
                  }}
                />
              </div>
            )}
            {chapter.outcomes && chapter.outcomes.length > 0 && (
              <div className="space-y-1">
                <div className="shift-outcomes-label">The outcomes</div>
                <ul className="space-y-1.5 text-[15px] leading-snug">
                  {chapter.outcomes.map((o, i) => (
                    <li key={i} className="flex gap-2">
                      <span aria-hidden className="select-none text-[--color-accent]">▸</span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: renderBodyWithCitations(o),
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        )}
        <Fragment>
          {renderBodyWithCharts(chapter.body, chapter.inlineCharts)}
        </Fragment>
      </div>
    </div>
  );
}

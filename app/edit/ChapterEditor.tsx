"use client";

import type { Chapter } from "@/lib/types";
import { useEditable } from "./useEditable";

type Props = {
  chapter: Chapter;
  onChange: (patch: Partial<Chapter>) => void;
  onFocus: () => void;
};

export default function ChapterEditor({ chapter, onChange, onFocus }: Props) {
  const titleProps = useEditable<HTMLHeadingElement>(
    chapter.title,
    (v) => onChange({ title: v }),
  );
  const dateProps = useEditable<HTMLParagraphElement>(
    chapter.date,
    (v) => onChange({ date: v }),
  );
  const bodyProps = useEditable<HTMLDivElement>(
    chapter.body,
    (v) => onChange({ body: v }),
    /* isHtml */ true,
  );

  const insertSectionAtTop = () => {
    const el = bodyProps.ref.current;
    if (!el) return;
    const newSection =
      '<h3>New section<span class="section-date">YYYY–YYYY</span></h3>\n<p>New section content.</p>\n';
    el.innerHTML = newSection + el.innerHTML;
    onChange({ body: el.innerHTML });
  };

  return (
    <section
      id={chapter.id}
      onFocus={onFocus}
      className="mx-auto max-w-2xl py-[40vh] first:pt-[20vh] last:pb-[40vh]"
    >
      <div className="prose-narrative space-y-5 text-[18px] leading-[1.7]">
        <div className="dashboard flex justify-end">
          <button
            type="button"
            onClick={insertSectionAtTop}
            className="rounded border border-neutral-300 bg-white px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-neutral-500 hover:bg-neutral-50"
            title="Prepend a new <h3> sub-section to the chapter body"
          >
            + Add section above
          </button>
        </div>
        <h2
          {...titleProps}
          className="mb-2 font-serif text-3xl font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300/60"
        />
        <p
          {...dateProps}
          className="text-[--color-muted] focus:outline-none focus:ring-2 focus:ring-amber-300/60"
        />
        <div
          {...bodyProps}
          className="space-y-5 focus:outline-none focus:ring-2 focus:ring-amber-300/60"
        />
      </div>
    </section>
  );
}

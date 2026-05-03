"use client";

import type { Chapter } from "@/lib/types";
import { useState } from "react";
import { useEditable } from "./useEditable";

type Props = {
  chapter: Chapter;
  onChange: (patch: Partial<Chapter>) => void;
  onFocus: () => void;
};

export default function ChapterEditor({ chapter, onChange, onFocus }: Props) {
  const [bodyVersion, setBodyVersion] = useState(0);

  const titleProps = useEditable<HTMLHeadingElement>(
    chapter.title,
    (v) => onChange({ title: v }),
  );
  const dateProps = useEditable<HTMLParagraphElement>(
    chapter.date,
    (v) => onChange({ date: v }),
  );
  const shiftProps = useEditable<HTMLParagraphElement>(
    chapter.shift ?? "",
    (v) => onChange({ shift: v }),
  );

  const insertSectionAtTop = () => {
    const newSection =
      '<h3>New section<span class="section-date">YYYY–YYYY</span></h3>\n<p>New section content.</p>\n';
    onChange({ body: newSection + chapter.body });
    // Bump the body sub-component's key so it remounts and useEditable re-runs
    // with the new chapter.body as its initial value, preserving everything.
    setBodyVersion((v) => v + 1);
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
        <aside className="shift-outcomes my-2 space-y-1 border-y border-[--color-rule] py-4">
          <div className="shift-outcomes-label">The shift</div>
          <p
            {...shiftProps}
            className="min-h-[1.2em] text-[16px] leading-snug focus:outline-none focus:ring-2 focus:ring-amber-300/60"
          />
        </aside>
        <EditableBody
          key={bodyVersion}
          body={chapter.body}
          onChange={(v) => onChange({ body: v })}
        />
      </div>
    </section>
  );
}

function EditableBody({
  body,
  onChange,
}: {
  body: string;
  onChange: (v: string) => void;
}) {
  const bodyProps = useEditable<HTMLDivElement>(body, onChange, /* isHtml */ true);
  return (
    <div
      {...bodyProps}
      className="space-y-5 focus:outline-none focus:ring-2 focus:ring-amber-300/60"
    />
  );
}

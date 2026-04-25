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

  return (
    <section
      id={chapter.id}
      onFocus={onFocus}
      className="mx-auto max-w-2xl py-[40vh] first:pt-[20vh] last:pb-[40vh]"
    >
      <div className="prose-narrative space-y-5 text-[18px] leading-[1.7]">
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

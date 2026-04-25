"use client";

import { getCitation } from "@/lib/citations";

type Props = {
  id: string;
};

export default function Cite({ id }: Props) {
  const found = getCitation(id);
  if (!found) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`<Cite id="${id}" />: citation not found`);
    }
    return (
      <sup
        className="ml-[1px] text-[--color-accent]"
        title={`Missing citation: ${id}`}
      >
        [?]
      </sup>
    );
  }
  const { citation, index } = found;
  const number = index + 1;
  return (
    <sup className="ml-[1px] inline-block align-baseline text-[0.8em] leading-none">
      <a
        href={`#cite-${citation.id}`}
        className="font-medium text-[--color-accent] no-underline hover:underline"
        title={`${citation.authors}, "${citation.title}" (${citation.year})`}
      >
        [{number}]
      </a>
    </sup>
  );
}

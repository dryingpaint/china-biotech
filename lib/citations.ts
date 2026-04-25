import citationsData from "@/data/citations.json";

export type Citation = {
  id: string;
  authors: string;
  title: string;
  publisher: string;
  year: number;
  url?: string;
};

export const citations = citationsData as Citation[];

const indexById = new Map(citations.map((c, i) => [c.id, i]));

export function getCitation(id: string): { citation: Citation; index: number } | null {
  const index = indexById.get(id);
  if (index === undefined) return null;
  return { citation: citations[index], index };
}

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function renderBodyWithCitations(html: string): string {
  return html
    .replace(
      /\[\[(entity|reform):([a-z0-9-]+)\|([^\]]+)\]\]/g,
      (_, type, id, text) => {
        return `<span class="entity-ref" data-entity-type="${type}" data-entity-id="${escapeAttr(id)}">${text}</span>`;
      },
    )
    .replace(/\[\[cite:([a-z0-9-]+)\]\]/g, (_, id) => {
      const found = getCitation(id);
      if (found) {
        const n = found.index + 1;
        const titleAttr = escapeAttr(
          `${found.citation.authors}, "${found.citation.title}" (${found.citation.year})`,
        );
        return `<sup class="cite-ref"><a href="#cite-${found.citation.id}" title="${titleAttr}" class="font-medium text-[--color-accent] no-underline hover:underline">[${n}]</a></sup>`;
      }
      if (process.env.NODE_ENV !== "production") {
        console.warn(`renderBodyWithCitations: citation not found: ${id}`);
      }
      return `<sup class="cite-ref" title="Missing citation: ${escapeAttr(id)}" style="color:#c00">[?]</sup>`;
    });
}

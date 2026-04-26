import citationsData from "@/data/citations.json";
import { getDeepDive } from "./deepdives";

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

function processSimpleMarkers(html: string): string {
  return html
    .replace(
      /\[\[(entity|reform):([a-z0-9-]+)\|([^\]]+)\]\]/g,
      (_, type, id, text) => {
        return `<span class="entity-ref" data-entity-type="${type}" data-entity-id="${escapeAttr(id)}">${text}</span>`;
      },
    )
    .replace(/\[\[note:([^\]]+)\]\]/g, (_, text) => {
      const escaped = escapeAttr(text);
      return `<sup class="note-ref" data-tooltip="${escaped}" title="${escaped}" tabindex="0" aria-label="${escaped}">?</sup>`;
    })
    .replace(/\[\[cite:([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (_, id, inlineText) => {
      const found = getCitation(id);
      if (found) {
        const n = found.index + 1;
        const titleAttr = escapeAttr(
          `${found.citation.authors}, "${found.citation.title}" (${found.citation.year})`,
        );
        if (inlineText) {
          // Inline-citation form: text becomes a hyperlink to the bibliography entry
          return `<a href="#cite-${found.citation.id}" title="${titleAttr}" class="cite-inline">${inlineText}</a>`;
        }
        // Default form: numbered superscript
        return `<sup class="cite-ref"><a href="#cite-${found.citation.id}" title="${titleAttr}" class="font-medium text-[--color-accent] no-underline hover:underline">[${n}]</a></sup>`;
      }
      if (process.env.NODE_ENV !== "production") {
        console.warn(`renderBodyWithCitations: citation not found: ${id}`);
      }
      return `<sup class="cite-ref" title="Missing citation: ${escapeAttr(id)}" style="color:#c00">[?]</sup>`;
    });
}

export function renderBodyWithCitations(html: string): string {
  // Process at paragraph level so deep-dive content can render outside the parent <p>.
  // Triggers stay inline inside the paragraph; the expandable content block follows it.
  const withDeepDives = html.replace(/<p>([^]*?)<\/p>/g, (_match, paraInner) => {
    const ddIds: string[] = [];
    const paraReplaced = paraInner.replace(
      /\[\[deepdive:([a-z0-9-]+)\|([^\]]+)\]\]/g,
      (_m: string, id: string, text: string) => {
        ddIds.push(id);
        return `<button class="deepdive-trigger" type="button" data-deepdive-id="${escapeAttr(id)}" aria-expanded="false">${text}<span class="deepdive-chevron" aria-hidden="true">▾</span></button>`;
      },
    );
    const seen = new Set<string>();
    const blocks: string[] = [];
    for (const id of ddIds) {
      if (seen.has(id)) continue;
      seen.add(id);
      const dd = getDeepDive(id);
      if (!dd) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`renderBodyWithCitations: deep-dive not found: ${id}`);
        }
        continue;
      }
      blocks.push(
        `<div class="deepdive-content" data-deepdive-id="${escapeAttr(id)}" hidden>${processSimpleMarkers(dd.body)}</div>`,
      );
    }
    return `<p>${paraReplaced}</p>${blocks.join("")}`;
  });

  return processSimpleMarkers(withDeepDives);
}

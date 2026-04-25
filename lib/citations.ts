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

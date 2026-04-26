import deepdivesData from "@/data/deepdives.json";
import type { DeepDive } from "./types";

export const deepdives = deepdivesData as DeepDive[];

const indexById = new Map(deepdives.map((d) => [d.id, d]));

export function getDeepDive(id: string): DeepDive | undefined {
  return indexById.get(id);
}

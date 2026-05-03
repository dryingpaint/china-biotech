"use client";

import { create } from "zustand";
import type { Chapter, ModalityKey } from "./types";
import chaptersData from "@/data/chapters.json";

const allChapters = chaptersData as unknown as Chapter[];
const visibleAtLoad = allChapters.filter((c) => !c.hidden);

export type EntityRef = {
  type: "entity" | "reform";
  id: string;
};

type NarrativeState = {
  chapters: Chapter[];                  // full list (incl. hidden)
  visibleChapters: Chapter[];           // chapters where hidden !== true
  currentIndex: number;                 // index into visibleChapters
  setCurrentIndex: (i: number) => void;
  current: () => Chapter | undefined;
  highlightedEntity: EntityRef | null;
  setHighlightedEntity: (e: EntityRef | null) => void;
  highlightedModality: ModalityHighlight | null;
  setHighlightedModality: (m: ModalityHighlight | null) => void;
};

export type ModalityHighlight = {
  key: ModalityKey;
  rung: number | null; // 1..5 if explicit; null = use current chapter's reached rung
};

export const useNarrative = create<NarrativeState>((set, get) => ({
  chapters: allChapters,
  visibleChapters: visibleAtLoad,
  currentIndex: 0,
  setCurrentIndex: (i) => set({ currentIndex: i }),
  current: () => get().visibleChapters[get().currentIndex],
  highlightedEntity: null,
  setHighlightedEntity: (e) => set({ highlightedEntity: e }),
  highlightedModality: null,
  setHighlightedModality: (m) => set({ highlightedModality: m }),
}));

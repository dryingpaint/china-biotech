"use client";

import { create } from "zustand";
import type { Chapter } from "./types";
import chaptersData from "@/data/chapters.json";

const chapters = chaptersData as Chapter[];

export type EntityRef = {
  type: "company" | "reform";
  id: string;
};

type NarrativeState = {
  chapters: Chapter[];
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
  current: () => Chapter;
  highlightedEntity: EntityRef | null;
  setHighlightedEntity: (e: EntityRef | null) => void;
};

export const useNarrative = create<NarrativeState>((set, get) => ({
  chapters,
  currentIndex: 0,
  setCurrentIndex: (i) => set({ currentIndex: i }),
  current: () => get().chapters[get().currentIndex],
  highlightedEntity: null,
  setHighlightedEntity: (e) => set({ highlightedEntity: e }),
}));

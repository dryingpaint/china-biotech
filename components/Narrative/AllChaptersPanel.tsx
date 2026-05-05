"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useNarrative } from "@/lib/narrativeStore";
import chaptersData from "@/data/chapters.json";
import type { Chapter } from "@/lib/types";

const allChapters = chaptersData as unknown as Chapter[];
const defaultVisible = allChapters.filter((c) => !c.hidden && !c.draft);

// Render the narrative + dashboard client-only. This avoids the RSC/SSR
// quirk where the zustand store seen by AllChaptersPanel and the store seen
// by Scroller end up being different module instances during SSR, leaving
// Scroller stuck on the default-visible chapter list.
const Scroller = dynamic(() => import("@/components/Narrative/Scroller"), {
  ssr: false,
});
const Dashboard = dynamic(() => import("@/components/Dashboard/Dashboard"), {
  ssr: false,
});

export default function AllChaptersPanel() {
  // On the client, override the store synchronously on first render so
  // Scroller/Dashboard read the full chapter list as soon as they mount.
  if (typeof window !== "undefined") {
    if (useNarrative.getState().visibleChapters !== allChapters) {
      useNarrative.setState({ visibleChapters: allChapters, currentIndex: 0 });
    }
  }

  // Reset to the default filtered list when leaving this route, so other
  // pages that share the singleton store don't inherit hidden/draft chapters.
  useEffect(() => {
    return () => {
      useNarrative.setState({ visibleChapters: defaultVisible, currentIndex: 0 });
    };
  }, []);

  return (
    <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-16 lg:px-10">
      <div className="min-w-0">
        <Scroller chapters={allChapters} />
      </div>
      <aside className="hidden lg:block">
        <div className="sticky top-0 flex h-screen items-center">
          <div className="dashboard w-full max-h-[92vh] overflow-hidden p-4">
            <Dashboard />
          </div>
        </div>
      </aside>
    </div>
  );
}

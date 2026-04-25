"use client";

import { Scrollama, Step } from "react-scrollama";
import type { ReactNode } from "react";
import { useNarrative } from "@/lib/narrativeStore";

type Section = {
  id: string;
  body: ReactNode;
};

export default function Scroller({ sections }: { sections: Section[] }) {
  const setIndex = useNarrative((s) => s.setCurrentIndex);

  return (
    <Scrollama
      offset={0.55}
      onStepEnter={({ data }) => {
        if (typeof data === "number") setIndex(data);
      }}
    >
      {sections.map((section, i) => (
        <Step key={section.id} data={i}>
          <section
            id={section.id}
            className="mx-auto max-w-2xl py-[40vh] first:pt-[20vh] last:pb-[40vh]"
          >
            <div className="prose-narrative space-y-5 text-[18px] leading-[1.7]">
              {section.body}
            </div>
          </section>
        </Step>
      ))}
    </Scrollama>
  );
}

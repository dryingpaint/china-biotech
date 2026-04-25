"use client";

import { createPortal } from "react-dom";
import { useEffect, useState, type ReactNode } from "react";

type Props = {
  show: boolean;
  anchorRect: DOMRect | null;
  children: ReactNode;
};

export default function Tooltip({ show, anchorRect, children }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !show || !anchorRect) return null;

  const top = anchorRect.top - 8;
  const left = Math.min(
    Math.max(anchorRect.left + anchorRect.width / 2, 160),
    window.innerWidth - 160,
  );

  return createPortal(
    <div
      role="tooltip"
      className="dashboard pointer-events-none fixed z-50 w-[280px] -translate-x-1/2 -translate-y-full rounded-md border border-[--color-rule] px-3 py-2 text-xs leading-snug text-[--color-fg] shadow-lg"
      style={{
        top,
        left,
        backgroundColor: "var(--color-bg)",
        opacity: 1,
      }}
    >
      {children}
    </div>,
    document.body,
  );
}

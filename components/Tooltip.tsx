"use client";

import { createPortal } from "react-dom";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Props = {
  show: boolean;
  anchorRect: DOMRect | null;
  children: ReactNode;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  width?: number;
};

const DEFAULT_TOOLTIP_W = 420;
const MARGIN = 8;

export default function Tooltip({
  show,
  anchorRect,
  children,
  onMouseEnter,
  onMouseLeave,
  width = DEFAULT_TOOLTIP_W,
}: Props) {
  const interactive = !!(onMouseEnter || onMouseLeave);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{
    top: number;
    left: number;
    placement: "above" | "below";
  } | null>(null);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!show || !anchorRect || !ref.current) {
      setPos(null);
      return;
    }
    const tooltipH = ref.current.getBoundingClientRect().height;
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    const fitsAbove = anchorRect.top - tooltipH - MARGIN >= MARGIN;
    const placement: "above" | "below" = fitsAbove ? "above" : "below";

    const top =
      placement === "above"
        ? anchorRect.top - MARGIN
        : Math.min(
            anchorRect.bottom + MARGIN + tooltipH,
            vh - MARGIN,
          );

    const half = width / 2;
    const left = Math.max(
      half + MARGIN,
      Math.min(anchorRect.left + anchorRect.width / 2, vw - half - MARGIN),
    );

    setPos({ top, left, placement });
  }, [show, anchorRect, children, width]);

  if (!mounted || !show || !anchorRect) return null;

  return createPortal(
    <div
      ref={ref}
      role="tooltip"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`dashboard fixed z-50 -translate-x-1/2 -translate-y-full overflow-y-auto rounded-md border border-[--color-rule] px-3.5 py-2.5 text-xs leading-relaxed text-[--color-fg] ${
        interactive ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        width,
        maxHeight: "calc(100vh - 32px)",
        backgroundColor: "var(--color-bg)",
        opacity: pos ? 1 : 0,
      }}
    >
      {children}
    </div>,
    document.body,
  );
}

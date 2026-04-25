"use client";

import { useEffect, useRef } from "react";

// React + contentEditable: we set the initial value once on mount via the DOM.
// Re-rendering with `dangerouslySetInnerHTML` or `children` would clobber the
// caret position on every keystroke, so the DOM is the source of truth between
// mount and unmount. To reflect an external change (e.g., reload from disk),
// remount the field by changing its `key`.
export function useEditable<T extends HTMLElement>(
  initial: string,
  onChange: (next: string) => void,
  isHtml = false,
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isHtml) el.innerHTML = initial;
    else el.textContent = initial;
    // intentionally only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ref,
    contentEditable: true,
    suppressContentEditableWarning: true,
    spellCheck: false,
    onInput: (e: React.FormEvent<T>) => {
      const el = e.currentTarget;
      onChange(isHtml ? el.innerHTML : (el.textContent ?? ""));
    },
    onPaste: (e: React.ClipboardEvent<T>) => {
      // Force plain-text paste so we don't pollute clean prose with foreign HTML.
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      // execCommand is deprecated but the only cross-browser way to insert at
      // the caret while preserving undo. Acceptable in dev-only tooling.
      document.execCommand("insertText", false, text);
    },
  };
}

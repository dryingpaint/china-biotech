"use client";

import { useState } from "react";
import { useNarrative } from "@/lib/narrativeStore";

export default function ChapterToggle() {
  const allChapters = useNarrative((s) => s.chapters);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(allChapters.map((c) => [c.id, !!c.hidden])),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = allChapters.some((c) => !!c.hidden !== !!hidden[c.id]);

  const toggle = (id: string) =>
    setHidden((h) => ({ ...h, [id]: !h[id] }));

  const save = async () => {
    setSaving(true);
    setError(null);
    const updated = allChapters.map((c) => {
      const isHidden = !!hidden[c.id];
      const { hidden: _omit, ...rest } = c;
      return isHidden ? { ...rest, hidden: true } : rest;
    });
    const res = await fetch("/api/edit/chapters", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      setSaving(false);
      setError(`Save failed: ${res.status}`);
    }
  };

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="dashboard fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-80 rounded-md border border-[--color-rule] bg-[--color-card] p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">Chapter visibility</span>
            <button
              onClick={() => setOpen(false)}
              className="text-lg leading-none text-[--color-muted] hover:text-[--color-fg]"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="max-h-96 space-y-1 overflow-y-auto pr-1">
            {allChapters.map((c) => (
              <label
                key={c.id}
                className="flex cursor-pointer items-center gap-2 text-xs leading-tight"
              >
                <input
                  type="checkbox"
                  checked={!hidden[c.id]}
                  onChange={() => toggle(c.id)}
                  className="shrink-0"
                />
                <span
                  className={
                    hidden[c.id]
                      ? "text-[--color-muted] line-through"
                      : ""
                  }
                >
                  {c.title}
                </span>
              </label>
            ))}
          </div>
          {error && (
            <div className="mt-2 text-xs text-[--color-accent]">{error}</div>
          )}
          <button
            onClick={save}
            disabled={saving || !dirty}
            className="mt-3 w-full rounded bg-[--color-accent] py-1.5 text-xs font-medium text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : dirty ? "Save and reload" : "No changes"}
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="rounded-md border border-[--color-rule] bg-[--color-card] px-3 py-2 text-xs shadow-md hover:shadow-lg"
        >
          Chapters
        </button>
      )}
    </div>
  );
}

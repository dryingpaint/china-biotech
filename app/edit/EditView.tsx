"use client";

import { useCallback, useEffect, useState } from "react";
import SplitPanel from "@/components/Layout/SplitPanel";
import Dashboard from "@/components/Dashboard/Dashboard";
import { useNarrative } from "@/lib/narrativeStore";
import type { Chapter, SiteContent } from "@/lib/types";
import ChapterEditor from "./ChapterEditor";
import { useEditable } from "./useEditable";

type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; site: SiteContent; chapters: Chapter[] };

export default function EditView() {
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [reloadKey, setReloadKey] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [siteRes, chRes] = await Promise.all([
        fetch("/api/edit/site"),
        fetch("/api/edit/chapters"),
      ]);
      if (!siteRes.ok || !chRes.ok) throw new Error("Failed to load");
      const site = (await siteRes.json()) as SiteContent;
      const chapters = (await chRes.json()) as Chapter[];
      setState({ kind: "ready", site, chapters });
      setDirty(false);
      setReloadKey((k) => k + 1);
    } catch (e) {
      setState({ kind: "error", message: String(e) });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateSite = useCallback((patch: Partial<SiteContent>) => {
    setState((s) =>
      s.kind === "ready" ? { ...s, site: { ...s.site, ...patch } } : s,
    );
    setDirty(true);
    setStatus(null);
  }, []);

  const updateChapter = useCallback(
    (id: string, patch: Partial<Chapter>) => {
      setState((s) => {
        if (s.kind !== "ready") return s;
        return {
          ...s,
          chapters: s.chapters.map((c) =>
            c.id === id ? { ...c, ...patch } : c,
          ),
        };
      });
      setDirty(true);
      setStatus(null);
    },
    [],
  );

  const save = useCallback(async () => {
    if (state.kind !== "ready") return;
    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      const [a, b] = await Promise.all([
        fetch("/api/edit/site", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(state.site),
        }),
        fetch("/api/edit/chapters", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(state.chapters),
        }),
      ]);
      if (!a.ok || !b.ok) {
        const detail = !a.ok ? await a.text() : await b.text();
        throw new Error(`Save failed: ${detail}`);
      }
      setSaving(false);
      setDirty(false);
      setStatus("Saved.");
    } catch (e) {
      setSaving(false);
      setError(String(e));
    }
  }, [state]);

  // Save on Cmd/Ctrl+S
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (dirty && !saving) save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dirty, saving, save]);

  // Warn before navigating away with unsaved edits
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  if (state.kind === "loading") {
    return (
      <main className="mx-auto max-w-3xl px-6 pt-32 text-center text-sm text-[--color-muted]">
        Loading editor…
      </main>
    );
  }
  if (state.kind === "error") {
    return (
      <main className="mx-auto max-w-3xl px-6 pt-32 text-center text-sm text-red-600">
        {state.message}
      </main>
    );
  }

  return (
    <>
      <main key={reloadKey}>
        <EditableHero site={state.site} onChange={updateSite} />
        <SplitPanel
          narrative={
            <ScrollerWithEdits
              chapters={state.chapters}
              onChangeChapter={updateChapter}
            />
          }
          dashboard={<Dashboard />}
        />
      </main>
      <SaveBar
        dirty={dirty}
        saving={saving}
        status={status}
        error={error}
        onSave={save}
        onReload={load}
      />
    </>
  );
}

function EditableHero({
  site,
  onChange,
}: {
  site: SiteContent;
  onChange: (patch: Partial<SiteContent>) => void;
}) {
  const titleProps = useEditable<HTMLHeadingElement>(site.heroTitle, (v) =>
    onChange({ heroTitle: v }),
  );
  const subtitleProps = useEditable<HTMLParagraphElement>(
    site.heroSubtitle,
    (v) => onChange({ heroSubtitle: v }),
  );
  const bylineProps = useEditable<HTMLDivElement>(site.heroByline, (v) =>
    onChange({ heroByline: v }),
  );
  const introProps = useEditable<HTMLDivElement>(
    site.intro ?? "",
    (v) => onChange({ intro: v }),
    /* isHtml */ true,
  );
  return (
    <>
      <header className="mx-auto max-w-3xl px-6 pb-16 pt-32 text-center">
        <h1
          {...titleProps}
          className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl focus:outline-none focus:ring-2 focus:ring-amber-300/60"
        />
        <p
          {...subtitleProps}
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[--color-muted] focus:outline-none focus:ring-2 focus:ring-amber-300/60"
        />
        <div
          {...bylineProps}
          className="dashboard mt-10 text-xs uppercase tracking-[0.25em] text-[--color-muted] focus:outline-none focus:ring-2 focus:ring-amber-300/60"
        />
      </header>
      <section className="mx-auto max-w-2xl px-6 pb-20">
        <div
          {...introProps}
          className="prose-narrative space-y-5 text-[18px] leading-[1.7] focus:outline-none focus:ring-2 focus:ring-amber-300/60"
        />
      </section>
    </>
  );
}

function ScrollerWithEdits({
  chapters,
  onChangeChapter,
}: {
  chapters: Chapter[];
  onChangeChapter: (id: string, patch: Partial<Chapter>) => void;
}) {
  const setIndex = useNarrative((s) => s.setCurrentIndex);
  return (
    <div>
      {chapters.map((chapter, i) => (
        <ChapterEditor
          key={chapter.id}
          chapter={chapter}
          onChange={(patch) => onChangeChapter(chapter.id, patch)}
          onFocus={() => setIndex(i)}
        />
      ))}
    </div>
  );
}

function SaveBar({
  dirty,
  saving,
  status,
  error,
  onSave,
  onReload,
}: {
  dirty: boolean;
  saving: boolean;
  status: string | null;
  error: string | null;
  onSave: () => void;
  onReload: () => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-4">
      <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-neutral-200 bg-white/95 px-4 py-2 shadow-lg backdrop-blur">
        <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          edit mode
        </span>
        <span className="text-xs text-neutral-400">·</span>
        <span className="text-sm">
          {error ? (
            <span className="text-red-600">{error}</span>
          ) : status && !dirty ? (
            <span className="text-emerald-600">{status}</span>
          ) : dirty ? (
            <span className="text-amber-600">Unsaved changes</span>
          ) : (
            <span className="text-neutral-400">No changes</span>
          )}
        </span>
        <button
          onClick={onSave}
          disabled={!dirty || saving}
          className="rounded-full bg-neutral-900 px-3 py-1 text-sm text-white disabled:opacity-40"
          title="⌘S / Ctrl+S"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          onClick={onReload}
          disabled={saving}
          className="rounded-full border border-neutral-200 px-3 py-1 text-sm hover:bg-neutral-50 disabled:opacity-40"
          title="Discard edits and reload from disk"
        >
          Reload
        </button>
      </div>
    </div>
  );
}

import { citations } from "@/lib/citations";
import DraftTag from "./DraftTag";

export default function Bibliography() {
  return (
    <section
      id="bibliography"
      className="mx-auto max-w-3xl px-6 py-20"
    >
      <header className="mb-6 flex items-baseline justify-between border-b border-[--color-rule] pb-3">
        <h2 className="font-serif text-2xl font-semibold">References</h2>
        <DraftTag />
      </header>
      <ol className="dashboard space-y-3 text-sm">
        {citations.map((c, i) => (
          <li
            key={c.id}
            id={`cite-${c.id}`}
            className="grid grid-cols-[2.5rem_1fr] gap-x-2 leading-snug text-[--color-fg] target:bg-[--color-accent]/10"
          >
            <span className="num text-[--color-muted]">[{i + 1}]</span>
            <span>
              <span className="text-[--color-muted]">{c.authors}</span>{" "}
              {c.url ? (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="italic text-[--color-fg] underline decoration-[--color-rule] underline-offset-2 hover:decoration-[--color-accent]"
                >
                  {c.title}
                </a>
              ) : (
                <span className="italic">{c.title}</span>
              )}
              .{" "}
              <span className="text-[--color-muted]">
                {c.publisher}, {c.year}.
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

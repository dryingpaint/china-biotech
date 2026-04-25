type Props = {
  size?: "sm" | "md";
  className?: string;
};

export default function DraftTag({ size = "sm", className = "" }: Props) {
  const px = size === "md" ? "px-2 py-1" : "px-1.5 py-0.5";
  const text = size === "md" ? "text-[11px]" : "text-[9px]";
  return (
    <span
      className={[
        "dashboard inline-flex items-center gap-1 rounded-sm border border-[--color-accent] font-medium uppercase tracking-[0.16em] text-[--color-accent]",
        px,
        text,
        className,
      ].join(" ")}
    >
      <span aria-hidden>●</span>
      Draft — may be inaccurate
    </span>
  );
}

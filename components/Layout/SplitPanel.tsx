import type { ReactNode } from "react";

type Props = {
  narrative: ReactNode;
  dashboard: ReactNode;
};

export default function SplitPanel({ narrative, dashboard }: Props) {
  return (
    <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-16 lg:px-10">
      <div className="min-w-0">{narrative}</div>
      <aside className="hidden lg:block">
        <div className="sticky top-0 flex h-screen items-center">
          <div className="dashboard w-full max-h-[92vh] overflow-y-auto p-6">
            {dashboard}
          </div>
        </div>
      </aside>
    </div>
  );
}

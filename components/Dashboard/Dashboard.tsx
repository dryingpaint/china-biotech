"use client";

import DateHeader from "./DateHeader";
import CompanyGrid from "./CompanyGrid";
import ReformTimeline from "./ReformTimeline";
import MetricsBar from "./MetricsBar";
import CapabilityGrid from "./CapabilityGrid";

export default function Dashboard() {
  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto pr-1">
      <DateHeader />
      <CompanyGrid />
      <ReformTimeline />
      <CapabilityGrid />
      <MetricsBar />
    </div>
  );
}

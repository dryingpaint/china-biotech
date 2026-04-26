"use client";

import DateHeader from "./DateHeader";
import CompanyGrid from "./CompanyGrid";
import ReformTimeline from "./ReformTimeline";
import MetricsBar from "./MetricsBar";
import CapabilityGrid from "./CapabilityGrid";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <DateHeader />
      <CompanyGrid />
      <ReformTimeline />
      <CapabilityGrid />
      <MetricsBar />
    </div>
  );
}

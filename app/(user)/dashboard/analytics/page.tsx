"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AnalyticsChart } from "../../../../components/analytics-chart";
import { Separator } from "../../../../components/ui/separator";
import UsersTrackerTable from "../../../../components/user-tracker-table";

export default function Analytics() {
  const searchParams = useSearchParams();
  const cluster = searchParams.get("cluster");

  const [activeCluster, setActiveCluster] = useState<string | null>(null);

  useEffect(() => {
    if (cluster) {
      setActiveCluster(cluster);
    }
  }, [cluster]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="flex flex-col py-4 px-6">
        <h1>Analytics</h1>
        <p className="text-[0.8rem] text-muted-foreground">
          Here&apos;s an overview of your clusters&apos; performance
        </p>
      </header>

      <Separator />

      <div className="flex-1 overflow-auto p-4">
        <AnalyticsChart />
        <div className="flex flex-col gap-4 mt-4">
          <div>
            <h1>Clicks</h1>
            <p className="text-[0.8rem] text-muted-foreground">
              Here&apos;s an overview of performance metrics for &quot;{activeCluster ?? "N/A"}&quot;
            </p>
          </div>
          <UsersTrackerTable />
        </div>
      </div>
    </div>
  );
}

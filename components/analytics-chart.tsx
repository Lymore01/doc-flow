"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { CLUSTERS } from "../lib/constants";
import Selection from "./selection";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { CopyIcon } from "lucide-react";

export const description = "An interactive bar chart";

const chartData: Record<string, { date: string; totalClicks: number }[]> = {
  "Project Reports": [
    { date: "2024-02-01", totalClicks: 200 },
    { date: "2024-02-02", totalClicks: 250 },
    { date: "2024-02-03", totalClicks: 310 },
    { date: "2024-02-04", totalClicks: 260 },
    { date: "2024-02-05", totalClicks: 300 },
  ],
  "Marketing Materials": [
    { date: "2024-02-01", totalClicks: 150 },
    { date: "2024-02-02", totalClicks: 180 },
    { date: "2024-02-03", totalClicks: 220 },
    { date: "2024-02-04", totalClicks: 200 },
    { date: "2024-02-05", totalClicks: 250 },
  ],
  "Legal Documents": [
    { date: "2024-02-01", totalClicks: 300 },
    { date: "2024-02-02", totalClicks: 320 },
    { date: "2024-02-03", totalClicks: 340 },
    { date: "2024-02-04", totalClicks: 310 },
    { date: "2024-02-05", totalClicks: 350 },
  ],
  "Client Proposals": [
    { date: "2024-02-01", totalClicks: 30 },
    { date: "2024-02-02", totalClicks: 32 },
    { date: "2024-02-03", totalClicks: 390 },
    { date: "2024-02-04", totalClicks: 400 },
    { date: "2024-02-05", totalClicks: 380 },
  ],
};

export function AnalyticsChart() {
  const router = useRouter();
  const [activeCluster, setActiveCluster] = React.useState(CLUSTERS[0].name);

  // Get the filtered data based on the selected cluster
  const filteredData = chartData[activeCluster] || [];

  const chartConfig = {
    views: { label: "Link Clicks" },
    cluster: {
      label: `${activeCluster}`,
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  React.useEffect(() => {
    if (activeCluster) {
      const url = new URL(window.location.href);
      const searchParams = url.searchParams;
      searchParams.set("cluster", activeCluster);
      router.replace(`${url.pathname}?${searchParams.toString()}`, undefined);
    }
  }, [activeCluster, router]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="flex gap-4 items-center w-full justify-between">
            {activeCluster}{" "}
            <Button variant={"secondary"} className="bg-blue-600 text-white">
              <CopyIcon size={16} />
              <span>Copy Url</span>
            </Button>{" "}
          </CardTitle>
          <CardDescription>
            Showing total visitors for the last 1 week
          </CardDescription>
        </div>
        <div className="flex justify-center px-6 py-5 sm:py-6">
          <Selection
            items={Object.keys(chartData)}
            onValueChange={(value: string) => {
              setActiveCluster(value);
            }}
            label={"Cluster"}
          />
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={filteredData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Bar dataKey="totalClicks" fill={`var(--color-cluster)`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

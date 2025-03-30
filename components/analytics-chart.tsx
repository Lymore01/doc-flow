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
import Selection from "./selection";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { CopyIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "./ui/skeleton";

export const description = "An interactive bar chart";

export function AnalyticsChart() {
  const { user } = useUser();
  const router = useRouter();
  const [activeCluster, setActiveCluster] = React.useState("");

  const { data: linksData, isLoading } = useQuery({
    queryKey: ["links"],
    queryFn: async () => {
      if (user?.id) {
        const response = await fetch(`/api/links?userId=${user?.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch links.");
        }
        return response.json();
      }
      throw new Error("User ID is undefined.");
    },
    enabled: !!user?.id,
  });

  React.useEffect(()=>{
    if(linksData?.links){
      setActiveCluster((linksData.links)[0].cluster.name)
    }
  }, [linksData])

  // Get the filtered data based on the selected cluster
  const filteredData =
  linksData?.links
    .filter((link: { cluster: { name: string } }) => {
      return link.cluster.name === activeCluster;
    })
    .map((link:{
      createdAt:string;
      clickCount: number
    }) => ({
      createdAt: link.createdAt,
      clickCount: link.clickCount,
    })) || [];


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
            {isLoading ? <Skeleton className="h-8 w-32 rounded-md"/> : activeCluster}
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
            items={(linksData?.links || []).map((link: {
              cluster:{
                name:string
              }
            })=>{
              return link.cluster.name
            })}
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
            margin={{ left: 12, right: 12 }}
            data={filteredData.length > 0 ? filteredData : [{ createdAt: "", clickCount: 0 }]}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="createdAt"
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
                  nameKey="clickCount"
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
            <Bar dataKey="clickCount" fill={`var(--color-cluster)`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

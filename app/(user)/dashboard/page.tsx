/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { Card } from "../../../components/ui/card";
import { ArrowRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../../../components/ui/skeleton";

//! fix: fetch the data from the backend

type DataProps = {
  totalClusters: number;
  totalDocuments: number;
  totalLinks: number;
};

type DashboardProps = {
  message: string;
  data: DataProps;
};

export default function Dashboard() {
  const { user } = useUser();

  const {
    data: dashboardData,
    error,
    isLoading,
  } = useQuery<DashboardProps>({
    queryKey: ["dashboardData", user?.id],
    queryFn: async () => {
      if (user?.id) {
        //! fix: update the user id to be dynamic
        const response = await fetch(
          `/api/dashboard?userId=${user.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data.");
        }
        return response.json();
      }
      throw new Error("User ID is undefined.");
    },
    enabled: !!user?.id,
  });

  if (error) return <p>Error loading dashboard data.</p>;

  const STATS = [
    {
      title: "Total Clusters",
      numbers: dashboardData?.data?.totalClusters,
      href: "cluster",
      linkTitle: "My Clusters",
    },
    {
      title: "Total Documents",
      numbers: dashboardData?.data?.totalDocuments,
      href: "documents",
      linkTitle: "My documents",
    },
    {
      title: "Total Links",
      numbers: dashboardData?.data?.totalLinks,
      href: "links",
      linkTitle: "My Links",
    },
  ];

  return (
    <div className="p-4 flex flex-col">
      
        <h1 className="text-xl inline-flex">
          Hi, <span className="ml-2">
            {isLoading ? (
              <Skeleton className="w-32 h-8"/>
            ) : (
              <>{user?.firstName} {user?.lastName}</>
            )}
          </span>
        </h1>
    
      <p className="text-[0.8rem] text-muted-foreground">
        Your dashboard provides an overview of all your clusters, documents and
        links.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 w-full">
        {STATS.map((stat, index) => (
          <StatCard
            href={stat.href}
            linkTitle={stat.linkTitle}
            numbers={stat.numbers ?? 0}
            title={stat.title}
            key={index}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
}

const StatCard = ({
  title,
  numbers = 0,
  href,
  linkTitle,
  isLoading,
}: {
  title: string;
  numbers: number;
  href: string;
  linkTitle: string;
  isLoading: boolean;
}) => {
  return (
    <Card className="p-5 flex items-center md:items-start justify-between bg-secondary rounded-lg shadow-md transition-all hover:shadow-lg">
      <div>
        <h2 className="text-base font-medium text-muted-foreground">{title}</h2>
        {isLoading ? (
          <Skeleton className="w-12 h-6 rounded-lg" />
        ) : (
          <p className="text-3xl font-bold text-primary">{numbers}</p>
        )}
      </div>

      <Link
        href={`/dashboard/${href}`}
        className="text-sm font-medium text-primary hover:underline flex items-center"
      >
        {linkTitle}{" "}
        <span>
          <ArrowRight size={16} />
        </span>
      </Link>
    </Card>
  );
};

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Menu } from "lucide-react";

import { Separator } from "../../../../components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useIsMobile } from "../../../../hooks/useMobile";
import ClusterSection from "../../../../components/cluster-section";
import { usePathname } from "next/navigation";

//TODO: validate cluster name
const clusterFormSchema = z.object({
  clusterName: z
    .string()
    .min(6, { message: "Cluster name should be at least 6 characters long" })
    .max(15, "Cluster name should be less than 15 characters"),
  clusterCategory: z.string(),
});

interface ClusterProps {
  id: number;
  name: string;
  visibility: "public" | "private";
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const isClusterPage = pathname === "/dashboard/cluster";
  const form = useForm<z.infer<typeof clusterFormSchema>>({
    resolver: zodResolver(clusterFormSchema),
    defaultValues: {
      clusterName: "",
      clusterCategory: "",
    },
  });

  function onSubmit(values: z.infer<typeof clusterFormSchema>) {
    //TODO: api call
    console.log(values);
  }
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-0 h-screen">
      {/* mobile view */}
      {isMobile && isClusterPage && <ClusterSection form={form} onSubmit={onSubmit} />}
      {!isMobile && (
        <ClusterSection form={form} onSubmit={onSubmit} />
      )}
      <Separator orientation="vertical" className="hidden md:flex" />
      <Separator className="flex md:hidden" />
      <div className="flex-1">{children}</div>
    </div>
  );
}

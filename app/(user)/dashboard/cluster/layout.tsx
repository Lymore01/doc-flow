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
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "../../../../hooks/use-toast";
import { useUser } from "@clerk/nextjs";

//TODO: validate cluster name
const clusterFormSchema = z.object({
  clusterName: z
    .string()
    .min(6, { message: "Cluster name should be at least 6 characters long" })
    .max(15, "Cluster name should be less than 15 characters"),
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
  const { user } = useUser();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const isClusterPage = pathname === "/dashboard/cluster";
  const form = useForm<z.infer<typeof clusterFormSchema>>({
    resolver: zodResolver(clusterFormSchema),
    defaultValues: {
      clusterName: "",
    },
  });

    const queryClient = useQueryClient()
  

  // create a cluster
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (data: { name: string, userId: string }) => {
      try {
        const response = await fetch(`/api/clusters`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to upload document");
        }
        return response.json();
      } catch (error) {
        let errorMessage = "An unknown error occurred.";
        if (error instanceof AxiosError) {
          errorMessage = error?.response?.data?.error || errorMessage;
        }
        // throw new Error(errorMessage); //!fix: uncomment this in the future
      }
    },
    onSuccess: () => {
      toast({
        title: "Cluster Created Successfully!",
        description: "Cluster has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['clusters']});
      form.reset();
    },
    onError: (error: unknown) => {
      let errorMessage = "An unexpected error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: "destructive",
        title: "Cluster Upload Failed",
        description: errorMessage,
      });
    },
  });

  async function onSubmit(values: z.infer<typeof clusterFormSchema>) {
    await mutateAsync({
      name: values.clusterName,
      userId: user?.id || ""
    });
  }
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-0 h-screen">
      {/* mobile view */}
      {isMobile && isClusterPage && (
        <ClusterSection form={form} onSubmit={onSubmit} loading={isPending} />
      )}
      {!isMobile && (
        <ClusterSection form={form} onSubmit={onSubmit} loading={isPending} />
      )}
      <Separator orientation="vertical" className="hidden md:flex" />
      <Separator className="flex md:hidden" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
